const express = require("express");
const cors = require("cors");
const facilityRoutes = require("./facility/facility.routes");
const bookingRoutes = require("./booking/booking.routes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => res.send("SportNest API running"));

app.use("/", facilityRoutes);
app.use("/", bookingRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

module.exports = app;