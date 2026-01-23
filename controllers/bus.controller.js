const Bus = require("../models/Bus");

exports.searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) return res.status(400).json({ error: "Missing query params" });

    // Trim and lowercase to avoid minor mismatches
    const fromTrimmed = from.trim();
    const toTrimmed = to.trim();
    const dateTrimmed = date.trim();

    // Case-insensitive regex search for from & to
    const buses = await Bus.find({
      from: { $regex: `^${fromTrimmed}$`, $options: "i" },
      to: { $regex: `^${toTrimmed}$`, $options: "i" },
      date: dateTrimmed
    });

    console.log("Query:", { from, to, date });
    console.log("Buses found:", buses.length);

    res.json(buses);
  } catch (err) {
    console.error("Search buses error:", err);
    res.status(500).json([]);
  }
};
