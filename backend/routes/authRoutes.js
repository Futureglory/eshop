// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  requestPasswordReset,
  resetPassword,
  logout,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Auth & OTP
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
