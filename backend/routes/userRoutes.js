// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer"); // ✅ Adjust the path if needed



// --------- AUTHENTICATION ROUTES ---------
router.post("/signup", authController.signup);
router.post("/login", authController.loginUser);
router.post("/logout", authMiddleware, authController.logout);

router.post("/otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);

// --------- PASSWORD RESET ---------
router.post("/forgot-password", forgotPassword);
router.post("/request-reset", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);

// --------- PROFILE ROUTES (Protected) ---------
router.get("/profile", authMiddleware, userController.getUserDetails); // basic profile data
router.put("/profile/update", authMiddleware, upload.single("avatar"), userController.updateUserProfile); // with avatar
router.put("/profile/password", authMiddleware, authController.updatePassword); // update password


module.exports = router;
