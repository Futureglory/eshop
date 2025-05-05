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
    const { username, email, password, termsAccepted } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    if (!termsAccepted) {
      return res.status(400).json({ message: "You must accept the Terms & Conditions." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      isVerified: false,
    });

    await sendOTPEmail(email, otp);

    res.cookie("signup_data", JSON.stringify({ email: newUser.email }), {
      httpOnly: true,
      secure: true,
      maxAge: 10 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Signup successful! OTP sent to email.",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Signup failed. Please try again later." });
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

    // Store token in HTTP-only cookie
res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: "Login successful!", 
      token,
      user:{id: user.id, username: user.username, email: user.email}
     });
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: " OTP expired. Request a new one" });
    }
  
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
  
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: " Verification failed. Please try again." });
  }
  };
  
  const resendOtp = async (req, res) => {
    const { email } = req.body;
    try{
    const user = await User.findOne({ where: { email } });
  
    if (!user) return res.status(404).json({ message: "User not found" });
  
    if (user.otpExpiresAt > new Date()) {
      return res.status(400).json({ message: "Wait a few minutes before requesting a new OTP." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);     await user.save();
  
    await sendOTPEmail(email, otp);

    // Send new OTP email
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to resend OTP.", error });
  }
  };
  
  const updateProfile = async (req, res) => {
    try {
      const { username, email } = req.body;
      const user = await User.findByPk(req.user.id);
  
      if (!user) return res.status(404).json({ message: "User not found." });
  
      if (username?.trim().length < 3) return res.status(400).json({ message: "Username must be at least 3 characters." });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Invalid email format." });
  
      user.username = username || user.username;
      user.email = email || user.email;
      await user.save();
  
      res.status(200).json({ message: "Profile updated successfully!", user });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile." });
    }
  };


  const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found." });
  
      const resetToken = user.generatePasswordResetToken();
      await user.save();
  
      const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
  
      await sendEmail({
        to: email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Click this link to reset: ${resetURL}`,
      });
  
      res.status(200).json({ message: "Reset link sent to email." });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Could not send reset email." });
    }
  };
  

  const crypto = require("crypto");

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      where: {
        email,
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: "Reset failed.", error });
  }
};

  module.exports = {
    signup,
    login,
    getUserProfile,
    verifyOtp,
    resendOtp,
    updateProfile,
    resetPasswordRequest,
    resetPassword,
  };
    // module.exports = { signup, login, getUserProfile, verifyOtp, resendOtp };
  