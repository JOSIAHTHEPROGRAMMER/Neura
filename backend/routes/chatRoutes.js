import express from 'express'
import { createChat, deleteChat, getChats } from '../controllers/chatController.js';
import { protectRoute } from '../middleware/auth.js';

const chatRouter = express.Router();


chatRouter.get('/create',protectRoute,createChat)
chatRouter.get('/get',protectRoute, getChats)
chatRouter.post('/delete',protectRoute,deleteChat)

export default chatRouter;