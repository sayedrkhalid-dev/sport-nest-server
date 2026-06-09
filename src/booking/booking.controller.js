const Booking = require("./booking.model");
const Facility = require("../facility/facility.model");

// POST /bookings — private
const createBooking = async (req, res) => {
  try {
    const { facility_id, booking_date, time_slot } = req.body;

    const facility = await Facility.findById(facility_id);
    if (!facility) return res.status(404).json({ message: "Facility not found" });

    // slot available কিনা check করো
    const slotExists = facility.available_slots.some(
      (s) => s.start_time === time_slot.start_time && s.end_time === time_slot.end_time
    );
    if (!slotExists) return res.status(400).json({ message: "Slot not available" });

    // already booked কিনা check করো
    const existing = await Booking.findOne({
      facility_id,
      booking_date,
      "time_slot.start_time": time_slot.start_time,
      "time_slot.end_time": time_slot.end_time,
      status: { $ne: "cancelled" },
    });
    if (existing) return res.status(409).json({ message: "Slot already booked" });

    // hours ও total_price calculate করো
    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const hours = (toMin(time_slot.end_time) - toMin(time_slot.start_time)) / 60;
    const total_price = hours * facility.price_per_hour;

    const booking = await Booking.create({
      facility_id,
      owner_email: req.user.email,
      booking_date,
      time_slot,
      hours,
      total_price,
      status: "pending",
    });

    // booking_count বাড়াও
    await Facility.findByIdAndUpdate(facility_id, { $inc: { booking_count: 1 } });

    const populated = await booking.populate("facility_id", "name location image");
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /bookings/my — private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner_email: req.user.email })
      .populate("facility_id", "name location image facility_type")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /bookings/:id/cancel — private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user_email: req.user.email,
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Already cancelled" });

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };
