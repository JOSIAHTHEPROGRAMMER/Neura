import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { Chat } from "../models/Chat.js";
import { sendEmail } from "../configs/sendEmail.js";
import crypto from "crypto";

// JWT function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Forgot Password API
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

 
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    
    const message = `
      <p>Dear ${user.name},</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding:10px 20px; background:#007bff; color:white; text-decoration:none;">Reset Password</a>
      <p>If the link above does not work, please copy and paste the following URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 10 minutes.</p>
      <br/>
      <p>If you did not request a password reset, please ignore this email.</p>
      <br/>
      <p>Regards,<br/>Neura</p>
    `;

    const emailSent = await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: message,
    });

    if (!emailSent) {
      return res.json({ success: false, message: "Failed to send email!" });
    }

    return res.json({ success: true, message: "Reset link sent to email!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reset Password API
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token!" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Register User API
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User with email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id);

    return res.json({ success: true, token, message: "User created successfully!" });
  } catch (error) {
    return res.json({ success: false, message: `Error in register function: ${error.message}` });
  }
};

// Login User API
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User with email doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password!" });
    }

    const token = generateToken(user._id);
    return res.json({ success: true, token, message: "Login successful!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get User Data
export const getUser = async (req, res) => {
  try {
    const user = req.user;
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get Published Images
export const getPublishedImages = async (req, res) => {
  try {
    const pubImages = await Chat.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.isImage": true, "messages.isPublished": true } },
      { $project: { _id: 0, imageUrl: "$messages.content", userName: "$userName" } },
    ]);

    return res.json({ success: true, images: pubImages.reverse() });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
