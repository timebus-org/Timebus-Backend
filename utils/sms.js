import fetch from "node-fetch";

export default async function sendSMS(phone, message) {
  try {
    await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message,
        language: "english",
        numbers: phone,
      }),
    });
  } catch (err) {
    console.log("SMS failed (trial)", err.message);
  }
}
