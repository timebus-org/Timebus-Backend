import 'dotenv/config';
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import sendEmail from "../utils/email.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🔹 WhatsApp sender (background)
const sendWhatsAppMessage = async (message) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: process.env.OWNER_WHATSAPP,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("❌ WhatsApp Error:", err.response?.data || err.message);
  }
};

export const createCabRequest = async (req, res) => {
  try {
    console.log("📥 CAB REQUEST BODY:", req.body);

    const {
      userId,
      name,
      phone,
      email,
      from,
      to,
      date,
      time,
      cab,
      estimatedFare,
      tripType,
    } = req.body;

    const formattedDate = date?.includes("-")
      ? date.split("-").reverse().join("-")
      : date;

    // 🔹 Save to DB
    const { error } = await supabase
      .from("cab_booking_requests")
      .insert([{
        user_id: userId || null,
        name,
        phone,
        email,
        from_location: from,
        to_location: to,
        date: formattedDate,
        time,
        cab,
        estimated_fare: estimatedFare,
        trip_type: tripType,
        status: "REQUESTED",
      }]);

    if (error) throw error;

    // 🔹 Email
    const emailHtml = `
      <h2>🚖 New Cab Booking Request</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>From:</b> ${from}</p>
      <p><b>To:</b> ${to}</p>
      <p><b>Date:</b> ${formattedDate}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Cab:</b> ${cab}</p>
      <p><b>Trip:</b> ${tripType}</p>
      <p><b>Fare:</b> ₹${estimatedFare}</p>
    `;

    await sendEmail("🚖 New Cab Booking Request", emailHtml);

    // 🔹 WhatsApp message (BACKGROUND)
    const whatsappMessage = `
🚖 *New Cab Booking*

👤 ${name}
📞 ${phone}

📍 From: ${from}
📍 To: ${to}

🗓 ${formattedDate}
⏰ ${time}
🚘 ${cab}
🧭 ${tripType}

💰 ₹${estimatedFare}
`;

    sendWhatsAppMessage(whatsappMessage); // no await → background

    return res.json({ success: true });

  } catch (err) {
    console.error("❌ CAB REQUEST ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
