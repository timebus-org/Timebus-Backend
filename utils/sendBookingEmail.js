import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendBookingEmail = async (booking) => {
  return await resend.emails.send({
    from: "TimeBus <onboarding@resend.dev>",
    to: process.env.OWNER_EMAIL,
    subject: "🚖 New Cab Booking Request",
    html: `
      <h2>New Booking Request</h2>
      <hr />

      <h3>Customer Details</h3>
      <p><b>Name:</b> ${booking.name}</p>
      <p><b>Phone:</b> ${booking.phone}</p>
      <p><b>Email:</b> ${booking.email}</p>

      <h3>Trip Details</h3>
      <p><b>From:</b> ${booking.from}</p>
      <p><b>To:</b> ${booking.to}</p>
      <p><b>Date:</b> ${booking.date}</p>
      <p><b>Time:</b> ${booking.time}</p>

      <h3>Cab Info</h3>
      <p><b>Cab:</b> ${booking.cab}</p>
      <p><b>Trip Type:</b> ${booking.tripType}</p>
      <p><b>Estimated Fare:</b> ₹${booking.estimatedFare}</p>

      <br />
      <p>Please contact the customer to confirm the booking.</p>
    `,
  });
};
