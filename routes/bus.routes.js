const router = require("express").Router();
const { searchBuses } = require("../controllers/bus.controller");

router.get("/search", searchBuses);
module.exports = router;
