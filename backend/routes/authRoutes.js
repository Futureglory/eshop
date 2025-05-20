// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  signup,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  requestPasswordReset,
  resetPassword,
  logout,
  updatePassword,
  verifyLoginAttempt,
  getUserProfile,
  updateProfile,
  sendPasswordResetEmail,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Auth & OTP
router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logout);
router.post("/otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
