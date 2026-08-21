const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/appointments', [verifyToken, isAdmin], adminController.getAllAppointments);
router.patch('/appointments/:id/approve', [verifyToken, isAdmin], adminController.approveAppointment);
router.patch('/appointments/:id/reject', [verifyToken, isAdmin], adminController.rejectAppointment);
router.patch('/appointments/:id/reschedule', [verifyToken, isAdmin], adminController.rescheduleAppointment);

module.exports = router;
