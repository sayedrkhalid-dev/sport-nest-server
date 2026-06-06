const express = require("express");
const facilityRoutes = require("./modules/facility/facility.routes");
const authRoutes = require("./modules/auth/auth.routes");
const bookingRoutes = require("./modules/booking/booking.routes");

const router = express.Router();

router.use("/", authRoutes);
router.use("/", facilityRoutes);
router.use("/", bookingRoutes); 

module.exports = router;
