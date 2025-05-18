// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // check the path!

const {
  signup,
  verifyOtp,
  resendOtp,
  forgotPassword,
  requestPasswordReset,
  resetPassword,
  loginUser,
  logout,
  // Profile routes 

  getUserProfile,

  updatePassword,

} = require("../controllers/authController");
const { getUserDetails,   updateUserProfile, } = require("../controllers/userController");
const { authMiddleware, protect } = require("../middleware/authMiddleware");
const multer = require("multer");


const upload = multer({ dest: "uploads/" });

router.put("/update", authMiddleware, userController.updateUserProfile);

// Protected profile routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile/password", authMiddleware, updatePassword);
router.put("/profile/update", authMiddleware, upload.single("avatar"), updateUserProfile);


router.get("/account", authMiddleware, getUserDetails); // Requires authenticatio

router.post("/signup", signup);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logout);
router.post("/otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


module.exports = router;
