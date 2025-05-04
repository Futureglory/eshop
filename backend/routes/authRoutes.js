const express = require("express");
const { login } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware"); // Ensure logout security
const { requestPasswordReset, resetPassword } = require("../controllers/authController");


const router = express.Router();

router.post("/login", login);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/logout", authMiddleware, logout);

// If logout functionality is needed, ensure authentication first
router.post("/logout", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;