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

    const otp = Math.floor(100000 + Math.random() * 900000);
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
    const { email } = req.body; // 👈 Normalizes email from URL
    const { otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpExpiresAt) {
      return res.status(400).json({ message: "No OTP set for this account." });
    }

    const now = new Date();
    console.log("Current time:", now.toISOString());;
    console.log("OTP expires at:", new Date(user.otpExpiresAt).toISOString());

    if (new Date(user.otpExpiresAt) < now) {
      return res.status(400).json({ message: "OTP expired, please request a new one." });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });
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
    const { email, password, rememberDevice } = req.body;
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Allow first login without verification
    if (user.firstLogin) {
      user.firstLogin = false; // ✅ Disable future auto-login
      await user.save();
    } else {
      // ✅ Require verification if logging in from a new device
      const isTrustedDevice = user.trustedDevices?.some(device => 
        device.userAgent === userAgent && device.ip === ipAddress
      );

      if (!isTrustedDevice && rememberDevice) {
        user.trustedDevices = [...(user.trustedDevices || []), { userAgent, ip: ipAddress }];

        const verificationToken = Math.random().toString(36).substring(2, 12);
        user.loginVerificationToken = verificationToken;
        user.loginVerificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        const frontendURL = process.env.FRONTEND_URL || "http://your-public-domain.com";
        await sendEmail(
          email,
          "New Login Attempt Detected",
          `<p>We've detected a login attempt from a new device or location.</p>
          <p>If this was you, click below to verify your login:</p>
          <a href="${frontendURL}/verify-login?token=${verificationToken}">Verify Login</a>
          <p>If this wasn't you, please secure your account immediately.</p>`
        );

        return res.status(403).json({ message: "New login detected. Please verify via email." });
      }
    }

    // ✅ Generate authentication token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Set token in HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    user.lastLoginIp = ipAddress;
    user.lastLoginDevice = userAgent;

    await user.save();

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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
    secure: false,
    sameSite: "Lax",
    maxAge: 0, // ✅ Expire immediately 
  });
  res.clearCookie("token"); // Remove authentication token
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Send same response to prevent email enumeration
      return res.status(404).json({ message: "No user found with this email." });
    }

    // 2. Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 3. Set token and expiration on user model
    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
    await user.save();

    // 4. Send email
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${user.email}`; // your frontend URL
    const message = `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({ message: "Password reset link has been sent." });
  } catch (error) {
    console.error('Password reset error.', error);
    res.status(500).json({ message: "Error sending password reset email. Please try again later.", error });
  }
};
