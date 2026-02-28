const nodemailer = require("nodemailer");
const path = require("path");

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { students } = req.body;

  if (!students || students.length === 0) {
    return res.status(400).json({ message: "No students found" });
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

    let successCount = 0;

    for (let student of students) {

      await transporter.sendMail({
  from: `"IPS Academy" <${process.env.EMAIL_USER}>`,
  to: student.email,
  subject: `🎂 Happy Birthday ${student.name} 🎉`,
  html: `
    <div style="text-align:center;font-family:Arial;background:#fdf2f8;padding:30px;">
      
      <h1 style="color:#e91e63;margin-bottom:5px;">
        🎉 Happy Birthday ${student.name} 🎂
      </h1>

      <p style="font-size:18px;color:#444;margin-top:0;">
        ${student.course}
      </p>

      <img src="cid:birthdaycard"
           style="width:400px;border-radius:12px;margin:20px 0;" />

      <p style="font-size:16px;color:#333;">
        Wishing you a wonderful year filled with happiness and success!
      </p>

      <strong style="color:#000;">IPS Academy</strong>

    </div>
  `,
  attachments: [
    {
      filename: "birthday-template.jpeg",
      path: path.join(process.cwd(), "birthday-template.jpeg"),
      cid: "birthdaycard"
    }
  ]
});
      successCount++;

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return res.status(200).json({
      message: `✅ ${successCount} emails sent successfully 🎉`
    });

  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).json({
      message: "❌ Email sending failed",
      error: error.message
    });
  }
};