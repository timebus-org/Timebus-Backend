import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
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

    return res.json({
      success: true,
      message: "Cab request created successfully",
    });

  } catch (err) {
    console.error("CAB REQUEST ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create cab request",
    });
  }
};
