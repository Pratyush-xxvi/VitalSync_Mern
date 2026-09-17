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
                // Email 1: To Patient (Pending HTML Template)
                console.log(`BOOKING: Sending confirmation email to patient: ${savedAppointment.patientEmail}`);
                const patientSubject = `⏳ Appointment Request Received - VitalSync`;
                
                const patientHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
                    <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                        
                        <!-- Header Banner -->
                        <div style="background: linear-gradient(135deg, #2563eb, #0891b2); padding: 32px 24px; text-align: center; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">VitalSync</h1>
                            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 500;">Healthcare Companion</p>
                        </div>

                        <!-- Main Content -->
                        <div style="padding: 32px 24px; color: #334155;">
                            <div style="display: inline-block; background-color: #fef3c7; color: #b45309; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px;">
                                ⏳ Pending Approval
                            </div>

                            <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 700;">Hello ${savedAppointment.patientName},</h2>
                            <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                                We have received your appointment request. Your booking is currently <strong>pending review</strong> by our clinic team. We will notify you as soon as it is confirmed!
                            </p>

                            <!-- Details Card -->
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; tracking: 0.5px; color: #2563eb; font-weight: 700;">Appointment Summary</h3>
                                
                                <div style="margin-bottom: 10px; font-size: 14px; display: flex; justify-content: space-between;">
                                    <span style="color: #64748b; font-weight: 600;">Doctor:</span>
                                    <strong style="color: #0f172a;">${savedAppointment.doctorName}</strong>
                                </div>
                                <div style="margin-bottom: 10px; font-size: 14px; display: flex; justify-content: space-between;">
                                    <span style="color: #64748b; font-weight: 600;">Date:</span>
                                    <strong style="color: #0f172a;">${savedAppointment.appointmentDate}</strong>
                                </div>
                                <div style="margin-bottom: 10px; font-size: 14px; display: flex; justify-content: space-between;">
                                    <span style="color: #64748b; font-weight: 600;">Time Slot:</span>
                                    <strong style="color: #0f172a;">${savedAppointment.appointmentTime}</strong>
                                </div>
                                <div style="font-size: 14px; display: flex; justify-content: space-between;">
                                    <span style="color: #64748b; font-weight: 600;">Clinic Location:</span>
                                    <strong style="color: #0f172a;">Mohali, Punjab, India</strong>
                                </div>
                            </div>

                            <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                                If you need to make changes or have questions, please reach out to our support team at <a href="mailto:support@vitalsync.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">support@vitalsync.com</a>.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 6px 0;">© 2026 VitalSync Healthcare Platform. All rights reserved.</p>
                            <p style="margin: 0;">Sector 62, Mohali, Punjab, India | +91 98765 43210</p>
                        </div>
                    </div>
                </body>
                </html>
                `;

                sendEmail(savedAppointment.patientEmail, patientSubject, patientHtml);

                // Email 2: To Admin (HTML Template)
                const adminSubject = `🔔 New Booking Alert: ${savedAppointment.patientName}`;
                const adminHtml = `
                <!DOCTYPE html>
                <html>
                <head><meta charset="utf-8"></head>
                <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
                    <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                        <div style="background: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
                            <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Admin Alert: New Booking</h2>
                        </div>
                        <div style="padding: 24px; color: #334155; font-size: 14px;">
                            <p style="margin-top: 0;">A new appointment booking requires admin review:</p>
                            <ul style="background-color: #f8fafc; padding: 16px 24px; border-radius: 12px; list-style-type: none; margin: 0 0 20px 0;">
                                <li style="margin-bottom: 8px;"><strong>Patient Name:</strong> ${savedAppointment.patientName}</li>
                                <li style="margin-bottom: 8px;"><strong>Patient Email:</strong> ${savedAppointment.patientEmail}</li>
                                <li style="margin-bottom: 8px;"><strong>Doctor Assigned:</strong> ${savedAppointment.doctorName}</li>
                                <li style="margin-bottom: 8px;"><strong>Date:</strong> ${savedAppointment.appointmentDate}</li>
                                <li><strong>Time:</strong> ${savedAppointment.appointmentTime}</li>
                            </ul>
                            <p style="margin: 0;">Please log into the Admin Dashboard to Approve or Reject this request.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;

                sendEmail("admin@app.com", adminSubject, adminHtml);
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
