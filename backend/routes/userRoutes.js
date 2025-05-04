const express = require("express");
const {
  signup,
  login,
  getUserProfile,
  verifyOtp,
  resendOtp,
  updateProfile,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router(); // ✅ Don't forget this line!

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/resend-otp", resendOtp);
router.post("/otp", verifyOtp);

module.exports = router;
