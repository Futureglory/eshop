const User = require("../models/User");
const sendEmail = require("../config/emailService");
const multer = require("multer");

exports.getUserDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const user = await User.findByPk(req.user.id, { attributes: ["name", "email", "avatar"] });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details.", error });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const { username, email, avatar } = req.body;
    await User.update({ username, email, avatar }, { where: { id: req.user.id } });

    // Send email notification
    sendEmail(email, "Profile Updated", `Hi ${name}, your profile details have been updated.`);

    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile.", error });
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

exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const { username, email } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : req.user.avatar;

    await User.update({ username, email, avatar }, { where: { id: req.user.id } });

    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile.", error });
  }
};
