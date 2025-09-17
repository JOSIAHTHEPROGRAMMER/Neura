import express from 'express'
import { protectRoute } from '../middleware/auth.js';
import { imageGenerator, sendChatMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();



messageRouter.post('/text',protectRoute,sendChatMessage)
messageRouter.post('/image',protectRoute,imageGenerator)

export default messageRouter;

