const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const { blacklist } = require("../middleware/authMiddleware");

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const otp = generateOTP();
    const newUser = await User.create({
      username,
      email,
      password, // make sure you hash this!
      otp,
      isVerified: false,
    });

    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);
    res.status(201).json({ message: "Signup successful. Please verify your email." });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: remember? "30d" : "1h" });

    es.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 30d vs 1h
    });
    
    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user.id, email: user.email }, // Avoid exposing full user details
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed." });
  }
};
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
    await user.save();
 // Send email
 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Password Reset Request",
  html: `<p>Your password reset token: <b>${resetToken}</b></p><p>Expires in 10 minutes.</p>`,
});

res.status(200).json({ message: "Reset token sent to email." });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "Failed to request password reset." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.passwordResetToken || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const isMatch = await bcrypt.compare(token, user.passwordResetToken);
    if (!isMatch) return res.status(401).json({ message: "Invalid reset token." });

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password." });
  }
};

// const blacklist = new Set(); 

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP or user." });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newOTP = generateOTP();
    user.otp = newOTP;
    await user.save();

    await sendEmail(email, "Resend OTP", `Your new OTP is: ${newOTP}`);
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to resend OTP", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpires = tokenExpiry;
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
    await sendEmail(email, "Reset Password", `Reset here: ${resetUrl}`);

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset email", error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "No token provided." });

    blacklist.add(token); // Add token to blacklist
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Failed to logout." });
  }
};

// exports.authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token || blacklist.has(token)) {
//     return res.status(401).json({ message: "Invalid or expired token." });
//   }

//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token." });
//   }
// };