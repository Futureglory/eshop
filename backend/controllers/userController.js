const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendEmail = require ("../utils/sendEmail.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // App password
  },
});

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Verification Code",
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
  });
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const otpGenerator = require("otp-generator");

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const newUser = await User.create({ username, email, password: hashedPassword,otp, otpExpiresAt,
      isVerified: false,
    });
    await sendOTPEmail(email, otp);
    // Send OTP email
    res.status(201).json({ message: "Signup successful! OTP sent to email.", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Signup failed.", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error });
  }
};

const getUserProfile = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json({ message: "User profile fetched successfully!", user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching profile.", error });
    }
  };
  const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  try{
    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
  
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed.", error });
  }
  };
  
  const resendOtp = async (req, res) => {
    const { email } = req.body;
    try{
    const user = await User.findOne({ where: { email } });
  
    if (!user) return res.status(404).json({ message: "User not found" });
  
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();
  
    await sendOTPEmail(email, otp);

    // Send new OTP email
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to resend OTP.", error });
  }
  };
  

  module.exports = { signup, login, getUserProfile, verifyOtp, resendOtp };
  // module.exports = { signup, login, getUserProfile, verifyOtp, resendOtp };
  