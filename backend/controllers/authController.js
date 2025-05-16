// controllers/authController.js

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Set JWT in cookie
const setTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });

    await sendEmail(
      email,
      "OTP Verification",
      `<p>Your OTP is: <b>${otp}</b>. It will expire in 10 minutes.</p>`
    );
    return res.status(201).json({ message: "Signup successful. Check your email for the OTP." });
  } catch (err) {
    console.error("signup error", err);
    res.status(500).json({ message: "Server error" });
  }

};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "OTP verified. Account is now active." });
  } catch (err) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(500).json({ message: "Server error" });
}

};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendEmail(
      email,
      "Resend OTP",
      `<p>Your new OTP is: <b>${otp}</b>. It will expire in 10 minutes.</p>`
    );
    res.status(200).json({ message: "New OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request:", email, password);
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    console.log("Login attempt for:", email);

    const user = await User.findOne({ where: { email } });
    console.log("User found:", user);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("Stored password:", user.password);
    console.log("Entered password:", password);


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    if (!user.isVerified) return res.status(401).json({ message: "Please verify your email first" });

 const token = generateToken(user.id);
setTokenCookie(res, token); // Uses your helper function

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email } 
    });

} catch (err) {
  console.error("Login error:", err);
  res.status(500).json({ message: "Server error" });
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetToken = hashedToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    await sendEmail(
      email,
      "Password Reset",
      `<p>Reset your password using the link below:</p><a href="${resetURL}">${resetURL}</a><p>This link will expire in 10 minutes.</p>`
    );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (user.resetToken !== hashedToken || user.resetTokenExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
} catch (err) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(500).json({ message: "Server error" });
}

};

exports.getUserProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "username", "email", "isVerified"]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.updateProfile = async (req, res) => {

  try {
    if (!req.user || !req.user.id) {
     return res.status(401).json({ message: "Unauthorized" });
   }
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
   }
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// In authController.js


exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email.' });
    }

    // 2. Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 3. Set token and expiry on user
    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    await user.save();

    // 4. Create reset URL
    const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${email}`; // Adjust frontend URL

    // 5. Send email
    const message = `
      <h2>Password Reset Request</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `};

    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: message,
    });

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Something went wrong. Try again later.' });
  }
};

exports.sendPasswordResetEmail = async (userEmail, resetLink) => {
    const message = `Hello,

   You have requested a password reset. Please click the link below to reset your password:
   ${resetLink}

   If you did not request this, please ignore this email.`;

    await sendEmail({
      to: userEmail,
      subject: "Password Reset Request",
      text: message,
      // html: `<p>${message}</p>`, // Optionally, use HTML content
    });
  }
}