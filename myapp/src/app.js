const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const mapRoutes = require("./routes/mapRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const stampRoutes = require("./routes/stampRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev")); // Logging middleware

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/map", mapRoutes);
app.use("/api/reviews/", reviewRoutes);
app.use("/api/stamps", stampRoutes);
app.use("/api/admin", adminRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
