const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
