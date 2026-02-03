import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (subject, html) => {
  await resend.emails.send({
    from: "TimeBus",
    to: "haribakk@gmail.com",
    subject,
    html,
  });
};

export default sendEmail;

