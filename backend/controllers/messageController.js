import imagekit from "../configs/imagekit.js";
import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";
import ai from "../configs/openai.js";
import axios from "axios";

const lastRequestMap = new Map();
const stopFlags = new Map();


const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const sendChatMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = Date.now();

    
    if (lastRequestMap.has(userId) && now - lastRequestMap.get(userId) < 3000) {
      return res.status(429).json({
        success: false,
        message: "Please wait 3 seconds before sending another message",
      });
    }
    lastRequestMap.set(userId, now);

    if (req.user.credits < 3) {
      return res.json({
        success: false,
        message: "Not enough credits",
      });
    }

    const { chatId, prompt } = req.body;
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) return res.json({ success: false, message: "Chat not found" });

    // Add user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    stopFlags.set(userId, false);

    // Retry for 429
    let responseData;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (stopFlags.get(userId)) {
        stopFlags.delete(userId);
        return res.status(499).json({ success: false, message: "Request stopped" });
      }

      try {
        responseData = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        break;
      } catch (err) {
        if (err.status === 429) await wait(2000 * (attempt + 1));
        else throw err;
      }
    }

    if (!responseData) throw new Error("API request failed");

    // Parse response text
    const candidate = responseData.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "";

    const reply = {
      role: "assistant",
      content: text,
      timeStamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -3 } });

    stopFlags.delete(userId);
    res.json({ success: true, reply, message: "Prompt processed" });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- IMAGE GENERATOR --------------------
export const imageGenerator = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = Date.now();

    // Cooldown 10s
    if (lastRequestMap.has(userId) && now - lastRequestMap.get(userId) < 10000) {
      return res.status(429).json({
        success: false,
        message: "Wait 10 seconds before generating another image",
      });
    }
    lastRequestMap.set(userId, now);

    if (req.user.credits < 15) {
      return res.json({ success: false, message: "Not enough credits" });
    }

    const { chatId, prompt, isPublished } = req.body;
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) return res.json({ success: false, message: "Chat not found" });

    chat.messages.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    stopFlags.set(userId, false);

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/neura/${Date.now()}.png?tr=w-800,h-800`;

    const aiImage = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64Image = `data:image/png;base64,${Buffer.from(aiImage.data, "binary").toString("base64")}`;

    const uploadRes = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "neura",
    });

    if (stopFlags.get(userId)) {
      stopFlags.delete(userId);
      return res.status(499).json({ success: false, message: "Request stopped" });
    }

    const reply = {
      role: "assistant",
      content: uploadRes.url,
      timeStamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -15 } });

    stopFlags.delete(userId);
    res.json({ success: true, reply, message: "Image processed" });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------- STOP REQUEST --------------------
export const stopRequest = (req, res) => {
  const userId = req.user._id;
  if (stopFlags.has(userId)) {
    stopFlags.set(userId, true);
    return res.json({ success: true, message: "Request will be stopped" });
  }
  res.json({ success: false, message: "No request in progress" });
};
