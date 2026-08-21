import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import seedAdmin from './config/seedAdmin.js';

import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 8081;

// Connect to MongoDB
connectDB().then(() => {
    // Seed default admin user if not exists
    seedAdmin();
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (for keep-alive / monitoring)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'VitalSync Backend (MERN)',
        timestamp: Date.now()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`VitalSync Node.js/MERN Server running on port ${PORT}`);
});
