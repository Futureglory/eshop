const express = require("express");
const { signup, login, getUserProfile, verifyOtp, resendOtp  } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
const { User } = require("../models");
const crypto = require("crypto");
const sendOTPEmail = require("../utils/sendEmail");
const { protect } = require('../middleware/authMiddleware');

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile); // Requires authentication
router.post('/resend-otp', resendOtp);
router.post("/otp", verifyOtp);

  
  
module.exports = router;