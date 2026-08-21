import express from 'express';
import { getAllAppointments, approveAppointment, rejectAppointment, rescheduleAppointment } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/appointments', [verifyToken, isAdmin], getAllAppointments);
router.patch('/appointments/:id/approve', [verifyToken, isAdmin], approveAppointment);
router.patch('/appointments/:id/reject', [verifyToken, isAdmin], rejectAppointment);
router.patch('/appointments/:id/reschedule', [verifyToken, isAdmin], rescheduleAppointment);

export default router;
