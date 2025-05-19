const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the Home Page!", user: req.user });
});

module.exports = router;