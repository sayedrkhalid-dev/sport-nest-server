const mongoose = require("mongoose");

const { Schema } = mongoose;

const slotSchema = new Schema(
  {
    start_time: {
      type: String,
      required: [true, "Start time is required!"],
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Start time must be in HH:MM format!",
      ],
    },

    end_time: {
      type: String,
      required: [true, "End time is required!"],
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "End time must be in HH:MM format!",
      ],
      validate: {
        validator: function (value) {
          return value > this.start_time;
        },
        message: "End time must be later than start time!",
      },
    },
  },
  { _id: false },
);

const facilitySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Facility name is required!"],
      trim: true,
      minlength: [3, "Facility name must be at least 3 characters!"],
      maxlength: [100, "Facility name cannot exceed 100 characters!"],
    },

    facility_type: {
      type: String,
      required: [true, "Facility type is required!"],
      trim: true,
      lowercase: true,
      enum: {
        values: [
          "football",
          "cricket",
          "badminton",
          "basketball",
          "swimming",
          "tennis",
        ],
        message: "{VALUE} is not a valid facility type!",
      },
    },

    image: {
      type: String,
      required: [true, "Image URL is required!"],
      trim: true,
      validate: {
        validator: function (value) {
          return /^https?:\/\/.+/i.test(value);
        },
        message: "Please provide a valid image URL!",
      },
    },

    location: {
      type: String,
      required: [true, "Location is required!"],
      trim: true,
      minlength: [2, "Location must be at least 2 characters!"],
      maxlength: [200, "Location cannot exceed 200 characters!"],
    },

    price_per_hour: {
      type: Number,
      required: [true, "Price per hour is required!"],
      min: [0, "Price per hour cannot be negative!"],
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required!"],
      min: [1, "Capacity must be at least 1!"],
    },

    available_slots: {
      type: [slotSchema],
      default: [],
    },

    description: {
      type: String,
      required: [true, "Facility description is required!"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters!"],
      maxlength: [2000, "Description cannot exceed 2000 characters!"],
    },

    owner_email: {
      type: String,
      required: [true, "Owner email is required!"],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address!",
      ],
    },

    booking_count: {
      type: Number,
      default: 0,
      min: [0, "Booking count cannot be negative!"],
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Facility", facilitySchema);
