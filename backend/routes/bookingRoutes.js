const express = require("express");
const router = express.Router();
const { bookFlight,getUserBookings,cancelBooking  } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

// Book a flight
router.post("/", protect, bookFlight);
router.get("/my", protect, getUserBookings);
router.delete("/:id", protect, cancelBooking);

module.exports = router;
