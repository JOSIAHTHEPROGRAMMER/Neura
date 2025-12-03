import express from "express"
import { protectRoute } from "../middleware/auth.js";
import { forgotPassword, getPublishedImages, getUser, loginUser, registerUser, resetPassword } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protectRoute, getUser)
userRouter.get('/published', getPublishedImages)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password/:token', resetPassword)

export default userRouter;