import imagekit from "../configs/imagekit.js"
import { Chat } from "../models/Chat.js"
import axios from  'axios'
import { User } from "../models/User.js"
import openai from "../configs/openai.js"

// User Text query to ai
export const sendChatMessage = async (req, res) => {
    try {
        const userId = req.user._id

        if(req.user.credits < 3){
                    return res.json({ success: false, message: "You don't have enough credits, please update balance!" })

        }



        const { chatId, prompt } = req.body



        const chat = await Chat.findOne({ userId, _id: chatId })
        chat.messages.push({
            role: "user", content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

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
            ...choices[0].message, timestamp: Date.now(),
            isImage: false
        }     
        
        
        res.json({ success: true, reply ,message: "Prompt has been Processed" })


        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId}, {$inc: {credits: -3}})




    } catch (error) {

        return res.json({ success: false, message: error.message })

    }
}

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
            timestamp: Date.now(),
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
        filename: `${Date.now()}.png`,
        folder: "neura"
      })

        const reply = {
            role: `assistant`, 
            content: uploadRes.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }     
        
        
        res.json({ success: true, reply ,message: "Prompt has been Processed" })


        chat.messages.push(reply)
        await chat.save()

        await User.updateOne({_id: userId}, {$inc: {credits: -15}})




    } catch (error) {

        return res.json({ success: false, message: error.message })

    }
}