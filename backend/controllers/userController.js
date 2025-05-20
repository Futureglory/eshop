const User = require("../models/User");
const sendEmail = require("../config/emailService");
const multer = require("multer");

exports.getUserDetails = async (req, res) => {
  try {
if (!req.user) {
      return res.status(401).json({ message: "User not found." });
    }

    const {id, username, email, avatar, createdAt} = req.user;
res.status(200).json({ user: {id, username, email, avatar, createdAt} });


  } catch (error) {
    res.status(500).json({ message: "Error fetching user details.", error });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token"); // Remove authentication token
  res.json({ message: "Logged out successfully!" });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

