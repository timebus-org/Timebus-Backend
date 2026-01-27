import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export default async function sendEmail(subject, text) {
  await transporter.sendMail({
    from: `"TimeBus" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // cab owner email
    subject,
    text,
  });
}
