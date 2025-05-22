const {User} = require("../models");
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

exports.getUserProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   if (!decoded.email) return res.status(400).json({ message: "Invalid token structure." });

    const user = await  User.findOne({
      where: { email: decoded.email },
      attributes: ["id", "username", "email", "isVerified"]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.updateUserProfile = async (req, res) => {

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized:  Please log in." });
    }

    const { username, email } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : req.user.avatar;
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    await User.update({ username, email, avatar }, { where: { email: req.user.email} });

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

     await sendProfileUpdateEmail(user);
   sendEmail(email, "Profile Updated", `Hi ${username}, your profile details have been updated.`);

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile updated successfully", err);
    res.status(500).json({ message: "Error updating profile.", err });
  }
};

const sendProfileUpdateEmail = async (user) => {
  const emailContent = `
    <h2>Your Eshop Profile Has Been Updated</h2>
    <p>Dear ${user.username},</p>
    <p>Your profile details have been successfully updated. Here are the latest details:</p>
    <ul>
      <li><b>Username:</b> ${user.username}</li>
      <li><b>Email:</b> ${user.email}</li>
    </ul>
    <p>If you did not make this change, please contact support immediately.</p>
  `;

  await sendEmail(user.email, "Profile Update Confirmation", emailContent);
};

exports.sendPasswordUpdateEmail = async (user) => {
  const emailContent = `
    <h2>Password Successfully Changed</h2>
    <p>Dear ${user.username},</p>
    <p>Your password was successfully updated. If you did not request this change, please reset your password immediately.</p>
  `;

  await sendEmail(user.email, "Password Change Notification", emailContent);
};

exports.updatePassword = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { currentPassword, newPassword } = req.body;
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

     await sendPasswordUpdateEmail(user);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

