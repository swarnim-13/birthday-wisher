const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

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

      // Load base template image
      const templatePath = path.join(process.cwd(), "birthday-template.jpeg");
      const image = await loadImage(templatePath);

      // Create canvas same size as template
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");

      // Draw template
      ctx.drawImage(image, 0, 0);

      // 🔥 Draw Name
      ctx.font = "bold 60px Arial";
      ctx.fillStyle = "#e91e63";
      ctx.textAlign = "center";
      ctx.fillText(
        student.name,
        canvas.width / 2,
        200
      );

      // 🔥 Draw Course
      ctx.font = "40px Arial";
      ctx.fillStyle = "#444";
      ctx.fillText(
        student.course,
        canvas.width / 2,
        270
      );

      // Convert canvas to buffer
      const buffer = canvas.toBuffer("image/jpeg");

      await transporter.sendMail({
        from: `"IPS Academy" <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: `🎂 Happy Birthday ${student.name} 🎉`,
        html: `
          <div style="text-align:center;font-family:Arial;padding:20px;">
            <h2>Happy Birthday ${student.name} 🎉</h2>
            <p>Wishing you a wonderful year ahead!</p>
          </div>
        `,
        attachments: [
          {
            filename: "birthday-card.jpg",
            content: buffer,
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