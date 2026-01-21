const express = require("express");
const app = express();
const bookingRoutes = require("./routes/booking.routes");



// Middleware
app.use(express.json());

// Routes
app.use("/trip", require("./routes/trip.routes"));
app.use("/booking", require("./routes/booking.routes"));
const seatRoutes = require("./routes/seatRoutes");
app.use("/api/seats", seatRoutes);
app.use("/tickets", express.static("public/tickets"));
app.use("/api/booking", bookingRoutes);
// Cron job (seat auto unlock)
require("./cron/seatUnlock.cron");

module.exports = app;
