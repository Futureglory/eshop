const express = require("express");
const { signup, login, getUserProfile, verifyOtp, resendOtp } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile); // Requires authentication
router.post("/resend-otp", resendOtp);
router.post("/otp", verifyOtp);

module.exports = router;