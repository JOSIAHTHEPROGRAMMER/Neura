import { Chat } from "../models/Chat.js"

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
            isImage: true
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

        await User.updateOne({_id: userId}, {$inc: {credits: -15}})




    } catch (error) {

        return res.json({ success: false, message: error.message })

    }
}