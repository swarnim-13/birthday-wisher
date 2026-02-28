const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { student, image } = req.body;

  if (!student || !image) {
    return res.status(400).json({ message: "Missing data" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {

    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

    await transporter.sendMail({
      from: `"IPS Academy" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: `🎂 Happy Birthday ${student.name} 🎉`,
      html: `
        <div style="text-align:center;font-family:Arial;">
          <h2>Happy Birthday ${student.name} 🎉</h2>
          <p>Wishing you a wonderful year ahead!</p>
          <P> Find Your Birthday Card Attached </p>
        </div>
      `,
      attachments: [
        {
          filename: "birthday-card.jpg",
          content: base64Data,
          encoding: "base64"
        }
      ]
    });

    return res.status(200).json({ message: "Email sent" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Email failed" });
  }
};