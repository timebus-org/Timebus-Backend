import nodemailer from "nodemailer";

console.log("📦 email.js loaded");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (subject, html) => {
  try {
    console.log("📧 sendEmail called");
    console.log("TO:", process.env.OWNER_EMAIL);

    const info = await transporter.sendMail({
      from: `"TimeBus 🚖" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject,
      html,
    });

    console.log("✅ Mail sent:", info.messageId);
  } catch (err) {
    console.error("❌ EMAIL FAILED:", err.message);
    throw err; // important
  }
};

export default sendEmail;
