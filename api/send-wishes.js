import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { students } = req.body;

  if (!students || students.length === 0) {
    return res.status(400).json({ message: "No students found" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {

    for (let student of students) {

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: "🎂 Happy Birthday 🎉",
        html: `
          <div style="text-align:center;font-family:Arial;">
            <h1>🎉 Happy Birthday ${student.name} 🎂</h1>
            <p>(${student.course})</p>
            <img src="https://yourdomain.com/birthday-template.jpeg" width="400"/>
            <p>Wishing you a wonderful year ahead!</p>
            <br/>
            <strong>IPS-ACADEMY</strong>
          </div>
        `
      });

      // small delay (safe for gmail)
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    return res.status(200).json({ message: "All emails sent successfully 🎉" });

  } catch (error) {
    return res.status(500).json({ error: "Email sending failed" });
  }
}