const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"eshop" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `<p>Your OTP is: <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info.response; // Return response instead of just logging
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed.");
  }
};

module.exports = sendEmail;
