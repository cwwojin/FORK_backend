const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const mapRoutes = require("./routes/mapRoutes");
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
app.use("/api/maps", mapRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
