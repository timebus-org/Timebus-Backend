import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (subject, html) => {
  await resend.emails.send({
    from: "TimeBus <onboarding@resend.dev>",
    to: process.env.OWNER_EMAIL,   // ✅ from .env
    subject,
    html,
  });
};

export default sendEmail;




