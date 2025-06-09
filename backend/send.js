import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
  console.log("MAIL_USER:", process.env.MAIL_USER ? "******" : "Yok");
});
