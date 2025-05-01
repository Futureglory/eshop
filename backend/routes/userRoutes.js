const express = require("express");
const { signup, login, getUserProfile } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
const { User } = require("../models");
const crypto = require("crypto");
const sendOTPEmail = require("../utils/sendEmail");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile); // Requires authentication



// Signup Route
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  
      const user = await User.create({
        username,
        email,
        password,
        otp,
        otpExpiresAt,
      });
  
      await sendOTPEmail(email, otp); // <== Sends actual email
  
      res.status(201).json({ message: "User created. Check your email for OTP." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Signup failed." });
    }
  });

  // routes/userRoutes.js

router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) return res.status(404).json({ message: "User not found." });
  
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP." });
      }
  
      if (new Date() > user.otpExpiresAt) {
        return res.status(400).json({ message: "OTP expired." });
      }
  
      // Mark user as verified or remove OTP fields
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();
  
      res.json({ message: "OTP verified successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Verification failed." });
    }
  });
  
  
module.exports = router;