import { User } from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import { Chat } from "../models/Chat.js";

// Jwt function
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '30d'
    })
}


// api to register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User with email was created already!" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);        // generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // hash password

        const user = await User.create({
            name,
            email,
            password: hashedPassword,  // store hashed password
        });

        const token = generateToken(user._id);

        return res.json({ success: true, token, message: "User created successfully!" });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: `Error in register function: ${error.message}` });
    }
};


//Login user
export const loginUser = async (req,res) =>{

 const {email,password} = req.body;

    try {
        const user = await User.findOne({email})
        
        if(!user){
            return res.json({success: false, message: "User with email doesn't exist!"})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: "Invalid email or password doesn't match!"})

        }


        const token = generateToken(user._id)
        return res.json({success: true, token, message: "Login Successfull!"})


    } catch (error) {
        return res.json({success: false, message: error.message})

    }


}

// get user data
export const getUser = async (req,res) =>{

 

    try {
        const user = req.user;
        
        return res.json({success:true,user})
        


    } catch (error) {
        return res.json({success: false, message: error.message})

    }


}

export const getPublishedImages = async (req,res) =>{

 

    try {
        const pubImages = await Chat.aggregate([
            {$unwind: "$messages"},
            {
                $match:{
                    "messages.isImage": true,
                    "messages.isPublished":true
                }
            },
            {
                $project:{
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName"
                }
            }
        ])
        
        return res.json({success:true, images: pubImages.reverse()})
        


    } catch (error) {
        return res.json({success: false, message: error.message})

    }


}



