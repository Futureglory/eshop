// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use "hotmail", "yahoo", etc.
  auth: {
    user: process.env.EMAIL_USER,      // Your email
    pass: process.env.EMAIL_PASS       // App password or real password
  }
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendOTPEmail;
