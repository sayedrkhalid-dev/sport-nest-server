const express = require("express");
const { createBooking, getMyBookings, cancelBooking } = require("./booking.controller");

const router = express.Router();

router.post("/bookings", createBooking);
router.get("/bookings/my", getMyBookings);
router.patch("/bookings/:id/cancel", cancelBooking);

module.exports = router;