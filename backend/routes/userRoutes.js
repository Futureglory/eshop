// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer"); // ✅ Adjust the path if needed
const {
  signup,
  verifyOtp,
  resendOtp,
  loginUser,
  logout,
  verifyLoginAttempt,
sendPasswordResetEmail,
  resetPassword,  
  forgotPassword
} = require("../controllers/authController");
const {
getUserDetails,
  updateUserProfile,
  updatePassword,
  sendProfileUpdateEmail,
  sendPasswordUpdateEmail,
  getUserProfile
} = require("../controllers/userController");
// --------- AUTHENTICATION ROUTES ---------
router.post("/signup", authController.signup);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, authController.logout);

router.post("/verifyOtp", verifyOtp);
router.post("/resend-otp", authController.resendOtp);

// --------- PASSWORD RESET ---------
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// --------- PROFILE ROUTES (Protected) ---------
router.get("/profile", authMiddleware, userController.getUserDetails); // basic profile data
router.put("/profile/update", authMiddleware, upload.single("avatar"), userController.updateUserProfile); // with avatar
router.put("/profile/password", authMiddleware, userController.updatePassword); // update password
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
