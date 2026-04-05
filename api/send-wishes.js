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

    // 🔗 👉 YAHAN GOOGLE FORM LINK DAALNA HAI
    const formLink = "https://docs.google.com/forms/d/e/1FAIpQLSfeUIZmMUfkjzDN1MxnTjoOUipVVs0AV5tNzCgFj670EZGUnQ/viewform?usp=publish-editor";

    await transporter.sendMail({
      from: `"IPS Academy" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: `🎂 Happy Birthday ${student.name} 🎉`,

      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          
          <h2 style="color:#e91e63;">🎉 Dear Alumnus  ${student.name}! 🎂</h2>

          <p style="font-size:16px;">
            On behalf of the Alumni Cell, I am pleased to forward a birthday card sent by Ar. Achal K. Choudhary Sir, President, 
            IPSA Group of Educational Institutes. We wish you a very Happy Birthday and a wonderful year ahead filled with success, and happiness.
          </p>

          <p style="margin-top:10px;">
            🎁 Your birthday card is attached with this email.
          </p>

          <hr style="margin:20px 0;">

          <p style="font-size:15px;">
            👉 We also request you to kindly fill out the Alumni Form. This will help us stay connected with you and 
            enable us to invite you to various institutional activities and events.
          </p>

          <a href="${formLink}" 
             style="display:inline-block; padding:10px 18px; background:#667eea; color:#fff; text-decoration:none; border-radius:8px; margin-top:10px;">
             Fill Alumni Form
          </a>

          <p style="margin-top:15px; font-size:13px; color:#555;">
            Looking forward to your continued association with us.
          </p>

          <br>

          <p style="font-size:14px;">
            Warm Regards,<br>
            <strong>Dy.Registrar</strong>
            Alumni Cell
            07314014592
            https://www.ipsacademy.org
          </p>

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
