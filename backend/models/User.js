import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    credits: {type: Number, default: 50}, 
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
})



export const User = mongoose.model('User',userSchema);

