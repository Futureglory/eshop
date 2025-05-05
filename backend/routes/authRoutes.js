const express = require("express");
const router = express.Router(); // ✅ Don't forget this line!
const { authMiddleware, protect } = require("../middleware/authMiddleware"); // Ensure logout security
const { 
  login, 
  signup,
 verifyOTP, 
 resendOTP, 
 forgotPassword, 
 resetPassword,
 requestPasswordReset, 
 logout 
} = require("../controllers/authController.js");

router.post("/login", login);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/logout", authMiddleware, logout);
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);

module.exports = router;