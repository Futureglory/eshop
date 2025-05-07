// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  signup,
  verifyOtp,
  resendOtp,
  forgotPassword,
  requestPasswordReset,
  resetPassword,
  login,
  logout,
  // Profile routes 

  getUserProfile,
  updateProfile,
  updatePassword

} = require("../controllers/authController");

const { authMiddleware } = require("../middleware/authMiddleware");

// Protected profile routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/profile", authMiddleware, updatePassword);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


module.exports = router;
