import { Chat } from "../models/Chat.js"


//Creating chat
export const createChat = async (req , res) => {
    try {
        const userId = req.user._id

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        }

        await Chat.create(chatData)
        return res.json({success:true, message: "Chat has been created"})
    } catch (error) {
        
        return res.json({success: false, message: error.message})

    }
}

// Getting all chats
export const getChats = async (req , res) => {
    try {
        const userId = req.user._id

        const chats = await Chat.find({userId}).sort({updatedAt:-1})

       
        return res.json({success:true, chats , message: "Chats has been retrieved"})
    } catch (error) {
        
        return res.json({success: false, message: error.message})

    }
}

// Getting delete chats
export const deleteChat = async (req , res) => {
    try {
        const userId = req.user._id

        const {chatId} = await req.body

        await Chat.deleteOne({_id: chatId, userId})

       
        return res.json({success:true , message: "Chat deleted"})
    } catch (error) {
        
        return res.json({success: false, message: error.message})

    }
}