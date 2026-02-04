import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import sendEmail from "../utils/email.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/* ===== TELEGRAM FUNCTION WITH LOGS ===== */
const sendTelegramMessage = async (message) => {
  try {
    console.log("📤 Sending Telegram message...");
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      }
    );
    console.log("✅ Telegram response:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ TELEGRAM ERROR:", err.response?.data || err.message);
    throw err;
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

    // 🔹 Save booking request to DB
    const { error } = await supabase
      .from("cab_booking_requests")
      .insert([
        {
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
        },
      ]);

    if (error) throw error;

    // 🔹 Email to owner
    const emailHtml = `
      <h2>🚖 New Cab Booking Request</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>From:</b> ${from}</p>
      <p><b>To:</b> ${to}</p>
      <p><b>Date:</b> ${formattedDate}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Cab:</b> ${cab}</p>
      <p><b>Trip:</b> ${tripType}</p>
      <p><b>Fare:</b> ₹${estimatedFare}</p>
    `;

    await sendEmail("🚖 New Cab Booking Request", emailHtml);

    // 🔹 Telegram
    const telegramMessage = `
🚖 New Cab Booking

Name: ${name}
Phone: ${phone}
Email: ${email}

From: ${from}
To: ${to}
Date: ${formattedDate}
Time: ${time}

Cab: ${cab}
Trip: ${tripType}
Fare: ₹${estimatedFare}
    `;

    const telegramResponse = await sendTelegramMessage(telegramMessage);
    console.log("📌 Telegram message sent successfully.");

    // ✅ Response
    return res.json({ success: true });

  } catch (err) {
    console.error("❌ CAB REQUEST ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
