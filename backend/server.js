const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { startCronJobs } = require('./cronJobs');

const app = express();
app.set('trust proxy', 1); // Trust Render's reverse proxy for rate limiting

// Start background cron jobs
startCronJobs();

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow external images (like unsplash) to load
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 500 : 5000, // Increased limit for coaching centers / dev
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter); // Apply rate limiter to all API routes

// CORS Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json());
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/papers', require('./routes/paperRoutes'));
app.use('/api/ssc', require('./routes/sscRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
