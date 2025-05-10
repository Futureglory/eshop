const User = require("../models/User");
const sendEmail = require("../config/emailService");

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

    const { name, email, avatar, password } = req.body;
    await User.update({ name, email, avatar, password }, { where: { id: req.user.id } });

    // Send email notification
    sendEmail(email, "Profile Updated", `Hi ${name}, your profile details have been updated.`);

    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile.", error });
  }
};

