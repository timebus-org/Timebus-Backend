const router = require("express").Router();
const { getSeats, lockSeat } = require("../controllers/seat.controller");

router.get("/:busId", getSeats);
router.post("/lock", lockSeat);

module.exports = router;
