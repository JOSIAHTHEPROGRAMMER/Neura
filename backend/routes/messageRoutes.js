import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { sendChatMessage, imageGenerator, stopRequest } from '../controllers/messageController.js';

const messageRouter= express.Router();

messageRouter.post('/text', protectRoute, sendChatMessage);
messageRouter.post('/image', protectRoute, imageGenerator);
messageRouter.post('/stop', protectRoute, stopRequest);

export default messageRouter;
