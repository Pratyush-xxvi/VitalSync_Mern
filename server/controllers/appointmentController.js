import Appointment from '../models/Appointment.js';
import { sendEmail } from '../services/emailService.js';

export const bookAppointment = async (req, res) => {
    try {
        const { doctorName, patientName, patientEmail, gender, address, appointmentDate, appointmentTime } = req.body;

        console.log(`BOOKING: Received booking request for patient: ${patientName}, email: ${patientEmail}`);

        const appointment = new Appointment({
            doctorName,
            patientName,
            patientEmail,
            gender,
            address,
            appointmentDate,
            appointmentTime,
            status: 'PENDING'
        });

        const savedAppointment = await appointment.save();
        console.log(`BOOKING: Appointment saved with ID: ${savedAppointment._id}`);

        // Send notification emails asynchronously
        setImmediate(async () => {
            try {
                // Email 1: To Patient
                console.log(`BOOKING: Sending confirmation email to patient: ${savedAppointment.patientEmail}`);
                const patientSubject = "Your Appointment is Pending";
                const patientBody = `Hello ${savedAppointment.patientName},\n\n`
                    + `Your appointment with ${savedAppointment.doctorName} on `
                    + `${savedAppointment.appointmentDate} at ${savedAppointment.appointmentTime} `
                    + `has been booked and is now PENDING approval.\n\n`
                    + `Thank you for using VitalSync!`;
                sendEmail(savedAppointment.patientEmail, patientSubject, patientBody);

                // Email 2: To Admin
                const adminSubject = "New Appointment Booked!";
                const adminBody = `A new appointment has been booked:\n\n`
                    + `Patient: ${savedAppointment.patientName}\n`
                    + `Doctor: ${savedAppointment.doctorName}\n`
                    + `Date: ${savedAppointment.appointmentDate}\n`
                    + `Time: ${savedAppointment.appointmentTime}\n\n`
                    + `Please log in to the admin dashboard to approve or reject it.`;
                sendEmail("admin@app.com", adminSubject, adminBody);
            } catch (err) {
                console.error("BOOKING: Error triggering email send:", err.message);
            }
        });

        return res.status(200).send("Appointment booked successfully!");
    } catch (error) {
        console.error("Error booking appointment:", error);
        return res.status(500).send("Error booking appointment: " + error.message);
    }
};
