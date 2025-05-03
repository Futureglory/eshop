const express = require("express");
const { login } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware"); // Ensure logout security

const router = express.Router();

router.post("/login", login);

// If logout functionality is needed, ensure authentication first
router.post("/logout", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;