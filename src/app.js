const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const {
  errorHandler,
  notFoundHandler,
} = require("./modules/facility/facility.middleware");

// Module scaffolding
const app = express();

// Configure CORS to support HTTPOnly cookies
app.use(
  cors({
    origin: true, // Auto-reflects the request origin
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Home page");
});

// Application Routes
app.use("/", routes);

// 404 Not Found Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
