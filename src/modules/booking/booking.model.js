const mongoose = require("mongoose");

const { Schema } = mongoose;

const slotSchema = new Schema(
  {
    start_time: {
      type: String,
      required: [true, "Start time is required!"],
    },
    end_time: {
      type: String,
      required: [true, "End time is required!"],
    },
  },
  { _id: false },
);

const bookingSchema = new Schema(
  {
    facility_id: {
      type: Schema.Types.ObjectId,
      ref: "Facility",
      required: [true, "Facility ID is required"],
    },
    user_email: {
      type: String,
      required: [true, "User email is required"],
      lowercase: true,
      trim: true,
    },
    booking_date: {
      type: String, // "YYYY-MM-DD"
      required: [true, "Booking date is required"],
    },
    time_slot: {
      type: slotSchema,
      required: [true, "Time slot is required"],
    },
    hours: {
      type: Number,
      required: [true, "Hours is required"],
    },
    total_price: {
      type: Number,
      required: [true, "Total price is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "cancelled"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent double bookings on the exact same slot
bookingSchema.index(
  { facility_id: 1, booking_date: 1, "time_slot.start_time": 1, "time_slot.end_time": 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: "cancelled" } },
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
