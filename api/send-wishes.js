import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { students } = req.body;

  if (!students || students.length === 0) {
    return res.status(400).json({ message: "No students found" });
  }

  // ✅ Google Workspace / Gmail SMTP Configuration
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS
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
        subject: "🎂 Happy Birthday 🎉",
        html: `
          <div style="text-align:center;font-family:Arial;padding:20px;">
            <h1 style="color:#ff4081;">🎉 Happy Birthday ${student.name} 🎂</h1>
            <p style="font-size:16px;">(${student.course})</p>
            
           <img 
  src="https://birthday-wisher-azure.vercel.app/birthday-template.jpeg" 
  width="400" 
  style="border-radius:10px;margin:20px 0;"
/>

            <p style="font-size:16px;">
              Wishing you a wonderful year filled with success and happiness!
            </p>

            <br/>
            <strong style="color:#333;">IPS ACADEMY</strong>
          </div>
        `
      });

      successCount++;

      // 🔒 Delay for bulk safety (important for 100–200 emails)
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
}