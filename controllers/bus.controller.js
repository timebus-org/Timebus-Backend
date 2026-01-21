const Bus = require("../models/Bus");

exports.searchBuses = async (req, res) => {
  const { from, to, date } = req.query;

  const buses = await Bus.find({ from, to, date });
  res.json(buses);
};
