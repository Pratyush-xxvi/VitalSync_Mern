import express from 'express';
import { bookAppointment } from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Require user authentication token to book an appointment
router.post('/book', verifyToken, bookAppointment);

export default router;
