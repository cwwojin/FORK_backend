const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const { userRoutes, preferenceRoutes } = require('./routes/userRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const mapRoutes = require('./routes/mapRoutes');
const { reviewRoutes, hashtagRoutes } = require('./routes/reviewRoutes');
const stampRoutes = require('./routes/stampRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const { checkUserTypeHeader } = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging middleware
// app.use(checkUserTypeHeader());     // middleware for checking userType header

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/hashtags', hashtagRoutes);
app.use('/api/stamps', stampRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
