import jwt from 'jsonwebtoken'
import { User} from '../models/User.js';

export const protectRoute = async (req, res, next) =>{
    let token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id
  
        const user = await User.findById(userId)

        if(!user){
            return res.json({success:false, message: "Authorized user not found! ", userID: `they ${userId}`})
        }

        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({message:"Token failed, not authorized"})
    }
}