// controllers/authController.js

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const sendEmail = require("../utils/sendEmail");

const sendAccountCreatedEmail = async (user) => {
  const emailContent = `
    <h2>Welcome to Eshop, ${user.username}!</h2>
    <p>Your account has been successfully created.</p>
    <p>Here are your details:</p>
    <ul>
      <li><b>Username:</b> ${user.username}</li>
      <li><b>Email:</b> ${user.email}</li>
    </ul>
    <p>If this wasn't you, please contact support immediately.</p>
  `;

  await sendEmail(user.email, "Your Eshop Account Details", emailContent);
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

   
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // ✅ Generates 6-digit OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
       isVerified: false,
    });

     await sendAccountCreatedEmail(user);

    await sendEmail(
      email,
      "verify Your Account",
      `<p>Your OTP is: <b>${otp}</b>. It will expire in 10 minutes.</p>`
    );
     res.status(201).json({ message: "Signup successful. Check your email for the OTP." });
  } catch (err) {
    console.error("signup error", err);
    res.status(500).json({ message: "Server error" });
  }

};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: " OTP is expired, please request for a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "OTP verified. Account is now active." });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error" });
  }

};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

       const newOtp = Math.floor(100000 + Math.random() * 900000);
    user.otp = newOtp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    await user.save();

    await sendEmail(
      email,
      "Resend OTP",
      `<p>Your new OTP is: <b>${newOtp}</b>. It will expire in 10 minutes.</p>`
    );
    res.status(200).json({ message: "New OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password,rememberDevice } = req.body;
    const userAgent = req.headers["user-agent"]; // ✅ Get user device info
    const ipAddress = req.ip; // ✅ Get user's IP address

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { return res.status(401).json({ message: "Invalid email or password" }); }

    if (!user.isVerified) { return res.status(401).json({ message: "Please verify your email first" }); }

    const generateVerificationToken = () => crypto.randomBytes(32).toString("hex");

    const isTrustedDevice = user.trustedDevices?.some(device => device.userAgent === userAgent && device.ip === ipAddress);
  if (!isTrustedDevice) {
      const verificationToken = generateVerificationToken();
      user.loginVerificationToken = verificationToken;
      user.loginVerificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
      await user.save();

      await sendEmail(
        email,
        "New Login Attempt Detected",
        `<p>We've detected a login attempt from a new device or location.</p>
         <p>If this was you, click below to verify your login:</p>
         <a href="http://localhost:3000/verify-login?token=${verificationToken}">Verify Login</a>
         <p>If this wasn't you, please secure your account immediately.</p>`
      );

      return res.status(403).json({ message: "New login detected. Please verify via email." });
    }

    const token = jwt.sign({ id: user.id, email: user.email  }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Set token in HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    user.lastLoginIp = ipAddress;
    user.lastLoginDevice = userAgent;
    
    if (rememberDevice) {
      user.trustedDevices = [...(user.trustedDevices || []), { userAgent, ip: ipAddress }];
    }

    await user.save();

     res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  };
}

exports.verifyLoginAttempt = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Verification token required" });

    const user = await User.findOne({ where: { loginVerificationToken: token } });
    if (!user) return res.status(404).json({ message: "Invalid or expired verification token" });

    user.loginVerificationToken = null; // ✅ Clear verification token after confirmation
     user.loginVerificationTokenExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "Login verified successfully. You can now log in." });
  } catch (err) {
    console.error("Login verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "", {
     httpOnly: true,
       secure:false,
    sameSite: "Lax",
    maxAge: 0, // ✅ Expire immediately 
    });
  res.status(200).json({ message: "Logged out successfully" });
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (user.resetToken !== hashedToken || user.resetTokenExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
    }
    res.status(500).json({ message: "Server error" });
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
// In authController.js


exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email.' });
    }

    // 2. Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 3. Set token and expiry on user
    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    await user.save();

    // 4. Create reset URL
    const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${email}`; // Adjust frontend URL

    // 5. Send email
    const message = `
      <h2>Password Reset Request</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: message,
    });

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Something went wrong. Try again later.' });
  }
};

exports.sendPasswordResetEmail = async (userEmail, resetLink) => {
  const message = `Hello,

   You have requested a password reset. Please click the link below to reset your password:
   ${resetLink}

   If you did not request this, please ignore this email.`;

  await sendEmail({
    to: userEmail,
    subject: "Password Reset Request",
    text: message,
    // html: `<p>${message}</p>`, // Optionally, use HTML content
  });
}
