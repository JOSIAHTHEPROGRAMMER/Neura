import imagekit from "../configs/imagekit.js"
import { Chat } from "../models/Chat.js"
import axios from  'axios'
import { User } from "../models/User.js"
import openai from "../configs/openai.js"

// User Text query to ai
export const sendChatMessage = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.credits < 3) {
            return res.json({ 
                success: false, 
                message: "You don't have enough credits, please update balance!" 
            });
        }

        const { chatId, prompt } = req.body;

        // Find chat and validate
        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.json({ 
                success: false, 
                message: "Chat not found" 
            });
        }

        // Add user message to chat
        chat.messages.push({
            role: "user", 
            content: prompt,
            timeStamp: Date.now(),
            isImage: false
        });

        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

    
        const reply = {
            ...choices[0].message, 
            timeStamp: Date.now(),

            isImage: false
        };

        // Add AI response and save
        chat.messages.push(reply);
        await chat.save();

        // Update user credits
        await User.updateOne({ _id: userId }, { $inc: { credits: -3 } });

        res.json({ 
            success: true, 
            reply,
            message: "Prompt has been Processed" 
        });

    } catch (error) {
        console.error("Chat error:", error);
        return res.json({ 
            success: false, 
            message: error.message 
        });
    }
};


//Image query to ai
export const imageGenerator = async (req, res) => {
    try {
        const userId = req.user._id


        if(req.user.credits < 15){
                    return res.json({ success: false, message: "You don't have enough credits, please update balance!" })

        }

        const { chatId, prompt, isPublished } = req.body



        const chat = await Chat.findOne({ userId, _id: chatId })
        chat.messages.push({
            role: "user", content: prompt,
            timeStamp: Date.now(),
            isImage: false
        })

        const encodedPrompt = encodeURIComponent(prompt)





//construct imagekit url
        const imageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/neura/${Date.now()}.png?tr=w-800,h-800`;


//generate ai image using imagekit
      const aiImage =  await axios.get(imageUrl, {responseType: "arraybuffer"} )



      const base64Image = `data:image/pnng;base64,${Buffer.from(aiImage.data,"binary").toString('base64')}`


       
      const uploadRes = await imagekit.upload({
        file: base64Image,
        fileName: `${Date.now()}.png`,
        folder: "neura"
      })

        const reply = {
            role: `assistant`, 
            content: uploadRes.url,
            timeStamp: Date.now(),
            isImage: true,
            isPublished
        }     
        
        
   


        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId}, {$inc: {credits: -15}})

     res.json({ success: true, reply ,message: "Prompt has been Processed" })


    } catch (error) {

        return res.json({ success: false, message: error.message })

    }
}