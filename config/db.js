const mongoose = require("mongoose");

module.exports = () => {
  return mongoose
    .connect("mongodb://127.0.0.1:27017/timebus")
    .then(() => console.log("User DB Connected"))
    .catch(err => {
      console.error("DB connection failed", err);
      process.exit(1);
    });
};


