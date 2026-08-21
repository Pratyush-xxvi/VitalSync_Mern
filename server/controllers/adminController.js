const Appointment = require('../models/Appointment');
const { sendEmail } = require('../services/emailService');

// Get all appointments for admin dashboard
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        return res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).send("Error: " + error.message);
    }
};

// Approve an appointment
exports.approveAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(400).send("Error: Appointment not found.");
        }

        appointment.status = 'APPROVED';
        await appointment.save();

        // Send Approval Email
        const subject = "Your Appointment is Approved!";
        const body = `Hello ${appointment.patientName},\n\n`
            + `Your appointment with ${appointment.doctorName} on `
            + `${appointment.appointmentDate} at ${appointment.appointmentTime} `
            + `has been APPROVED.\n\nWe look forward to seeing you!`;
        sendEmail(appointment.patientEmail, subject, body);

        return res.status(200).send("Appointment Approved.");
    } catch (error) {
        console.error("Error approving appointment:", error);
        return res.status(500).send("Error: " + error.message);
    }
};

// Reject an appointment
exports.rejectAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(400).send("Error: Appointment not found.");
        }

        appointment.status = 'REJECTED';
        await appointment.save();

        // Send Rejection Email
        const subject = "Your Appointment Status";
        const body = `Hello ${appointment.patientName},\n\n`
            + `We regret to inform you that your appointment with ${appointment.doctorName} on `
            + `${appointment.appointmentDate} has been REJECTED.\n\n`
            + `Please contact us for more information or to book a new time.`;
        sendEmail(appointment.patientEmail, subject, body);

        return res.status(200).send("Appointment Rejected.");
    } catch (error) {
        console.error("Error rejecting appointment:", error);
        return res.status(500).send("Error: " + error.message);
    }
};

// Reschedule an appointment
exports.rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newDate, newTime } = req.body;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(400).send("Error: Appointment not found.");
        }

        appointment.appointmentDate = newDate;
        appointment.appointmentTime = newTime;
        appointment.status = 'APPROVED';
        await appointment.save();

        // Send Reschedule Email
        const subject = "Your Appointment Has Been Rescheduled";
        const body = `Hello ${appointment.patientName},\n\n`
            + `Your appointment with ${appointment.doctorName} has been rescheduled by the admin.\n\n`
            + `Your NEW appointment time is: ${appointment.appointmentDate} at ${appointment.appointmentTime}\n`
            + `This new appointment is confirmed.`;
        sendEmail(appointment.patientEmail, subject, body);

        return res.status(200).send("Appointment Rescheduled.");
    } catch (error) {
        console.error("Error rescheduling appointment:", error);
        return res.status(500).send("Error: " + error.message);
    }
};
