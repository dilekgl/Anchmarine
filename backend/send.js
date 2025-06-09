import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject: "İletişim Formu Mesajı",
    text: `
      Gönderen: ${name}
      Email: ${email}
      Mesaj: ${message}
    `,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Mesaj gönderildi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gönderim hatası." });
  }
}
