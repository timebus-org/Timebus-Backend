import axios from "axios";

export const sendWhatsApp = async (booking) => {
  const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

  return axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: process.env.CAB_OWNER_PHONE,
      type: "template",
      template: {
        name: "cab_booking_request", // approved template name
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: booking.name },
              { type: "text", text: booking.from },
              { type: "text", text: booking.to },
              { type: "text", text: booking.date },
              { type: "text", text: booking.time },
              { type: "text", text: booking.cab },
              { type: "text", text: String(booking.estimatedFare) },
            ],
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
};
