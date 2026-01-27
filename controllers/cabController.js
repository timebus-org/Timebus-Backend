import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";
import sendTelegram from "../utils/telegram.js";
import sendEmail from "../utils/email.js";
import sendSMS from "../utils/sms.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY   // ✅ FIXED HERE
);

export const createCabRequest = async (req, res) => {
  try {
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
    } = req.body;

    // 1️⃣ SAVE REQUEST
    const { error } = await supabase
      .from("cab_booking_requests")
      .insert([
        {
          user_id: userId,
          name,
          phone,
          email,
          from_location: from,
          to_location: to,
          date,
          time,
          cab,
          estimated_fare: estimatedFare,
          status: "REQUESTED",
        },
      ]);

    if (error) throw error;

    // 2️⃣ MESSAGE TEMPLATE
    const message = `
🚖 New Cab Booking Request

Customer: ${name}
Phone: ${phone}

From: ${from}
To: ${to}
Date: ${date}
Time: ${time}

Cab: ${cab}
Estimated Fare: ₹${estimatedFare}

Please contact the customer.
`;

    // 3️⃣ NOTIFICATIONS (FAIL-SAFE)
    await sendTelegram(message);
    await sendEmail("New Cab Booking", message);
    await sendSMS(phone, message);

    return res.json({ success: true });

  } catch (err) {
    console.error("CAB REQUEST ERROR:", err);
    return res.status(500).json({ success: false });
  }
};
