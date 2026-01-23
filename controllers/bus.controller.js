const Bus = require("../models/Bus");

exports.searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    // Trim inputs to remove extra spaces
    const fromTrimmed = from?.trim();
    const toTrimmed = to?.trim();
    const dateTrimmed = date?.trim();

    const buses = await Bus.find({
      from: { $regex: new RegExp(`^${fromTrimmed}$`, "i") },
      to: { $regex: new RegExp(`^${toTrimmed}$`, "i") },
      date: dateTrimmed
    });

    console.log("Query:", req.query);
    console.log("Buses found:", buses.length);

    res.json(buses);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json([]);
  }
};
