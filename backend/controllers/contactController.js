const nodemailer = require('nodemailer');

exports.submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Optionally check for bots using honeypot or reCAPTCHA here

  try {
    // Configure your mailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_RECEIVER, // your admin or support email
      subject: `Contact Form Submission from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p><p>${message}</p>`
    });

    return res.status(200).json({ message: 'Thank you! Your message has been sent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong. Try again later.' });
  }
};
