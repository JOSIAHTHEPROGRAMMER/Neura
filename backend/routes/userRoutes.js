import express from "express"
import { protectRoute } from "../middleware/auth.js";
import { getUser, loginUser, registerUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protectRoute, getUser)

export default userRouter;