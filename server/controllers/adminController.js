import Appointment from '../models/Appointment.js';
import { sendEmail } from '../services/emailService.js';

// Get all appointments for admin dashboard
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        return res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).send("Error: " + error.message);
    }
};

// Approve an appointment
export const approveAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(400).send("Error: Appointment not found.");
        }

        appointment.status = 'APPROVED';
        await appointment.save();

        // Send Approval HTML Email
        const subject = "🎉 Appointment Confirmed - VitalSync Healthcare";
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                
                <!-- Header Banner -->
                <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 32px 24px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800;">VitalSync</h1>
                    <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Healthcare Companion</p>
                </div>

                <!-- Content -->
                <div style="padding: 32px 24px; color: #334155;">
                    <div style="display: inline-block; background-color: #d1fae5; color: #047857; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px;">
                        ✅ Appointment Confirmed
                    </div>

                    <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 700;">Great news, ${appointment.patientName}!</h2>
                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                        Your appointment has been officially <strong>APPROVED & CONFIRMED</strong>. We look forward to providing you with exceptional medical care!
                    </p>

                    <!-- Details Card -->
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                        <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; color: #047857; font-weight: 700;">Confirmed Appointment Details</h3>
                        
                        <div style="margin-bottom: 10px; font-size: 14px; display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-weight: 600;">Doctor:</span>
                            <strong style="color: #0f172a;">${appointment.doctorName}</strong>
                        </div>
                        <div style="margin-bottom: 10px; font-size: 14px; display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-weight: 600;">Date:</span>
                            <strong style="color: #0f172a;">${appointment.appointmentDate}</strong>
                        </div>
                        <div style="margin-bottom: 10px; font-size: 14px; display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-weight: 600;">Time Slot:</span>
                            <strong style="color: #0f172a;">${appointment.appointmentTime}</strong>
                        </div>
                        <div style="font-size: 14px; display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-weight: 600;">Location:</span>
                            <strong style="color: #0f172a;">Sector 62, Mohali, Punjab, India</strong>
                        </div>
                    </div>

                    <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                        Please arrive 10 minutes prior to your scheduled time slot. For assistance, contact <a href="mailto:support@vitalsync.com" style="color: #059669; font-weight: 600;">support@vitalsync.com</a>.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 6px 0;">© 2026 VitalSync Healthcare Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        sendEmail(appointment.patientEmail, subject, htmlContent);

        return res.status(200).send("Appointment Approved.");
    } catch (error) {
        console.error("Error approving appointment:", error);
        return res.status(500).send("Error: " + error.message);
    }
};

// Reject an appointment
export const rejectAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(400).send("Error: Appointment not found.");
        }

        appointment.status = 'REJECTED';
        await appointment.save();

        // Send Rejection HTML Email
        const subject = "Appointment Update - VitalSync Healthcare";
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                
                <div style="background: linear-gradient(135deg, #e11d48, #be123c); padding: 32px 24px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800;">VitalSync</h1>
                </div>

                <div style="padding: 32px 24px; color: #334155;">
                    <div style="display: inline-block; background-color: #ffe4e6; color: #be123c; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px;">
                        ❌ Appointment Status Update
                    </div>

                    <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 700;">Hello ${appointment.patientName},</h2>
                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                        We regret to inform you that your appointment request with <strong>${appointment.doctorName}</strong> on <strong>${appointment.appointmentDate}</strong> could not be accepted due to slot unavailability.
                    </p>

                    <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 14px; padding: 20px; margin-bottom: 24px; text-align: center;">
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #be123c; font-weight: 600;">Would you like to book a different time slot?</p>
                        <a href="http://localhost:5173/doctors" style="display: inline-block; background-color: #be123c; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700;">Browse Available Doctors</a>
                    </div>
                </div>

                <div style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b;">
                    <p style="margin: 0;">© 2026 VitalSync Healthcare Platform.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        sendEmail(appointment.patientEmail, subject, htmlContent);

        return res.status(200).send("Appointment Rejected.");
    } catch (error) {
        console.error("Error rejecting appointment:", error);
        return res.status(500).send("Error: " + error.message);
    }
};

// Reschedule an appointment
export const rescheduleAppointment = async (req, res) => {
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

        // Send Reschedule HTML Email
        const subject = "📅 Your Appointment Has Been Rescheduled - VitalSync";
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                
                <div style="background: linear-gradient(135deg, #0284c7, #2563eb); padding: 32px 24px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800;">VitalSync</h1>
                    <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Appointment Schedule Update</p>
                </div>

                <div style="padding: 32px 24px; color: #334155;">
                    <div style="display: inline-block; background-color: #e0f2fe; color: #0369a1; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px;">
                        📅 Appointment Rescheduled
                    </div>

                    <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 20px; font-weight: 700;">Hello ${appointment.patientName},</h2>
                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                        Your appointment with <strong>${appointment.doctorName}</strong> has been updated by our clinic team. Here is your new confirmed appointment schedule:
                    </p>

                    <!-- Details Card -->
                    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                        <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; color: #0369a1; font-weight: 700;">Updated Schedule</h3>
                        
                        <div style="margin-bottom: 10px; font-size: 14px; display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-weight: 600;">Doctor:</span>
                            <strong style="color: #0f172a;">${appointment.doctorName}</strong>
                        </div>
                        <div style="margin-bottom: 10px; font-size: 14px; display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-weight: 600;">NEW Date:</span>
                            <strong style="color: #0369a1;">${appointment.appointmentDate}</strong>
                        </div>
                        <div style="margin-bottom: 10px; font-size: 14px; display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-weight: 600;">NEW Time Slot:</span>
                            <strong style="color: #0369a1;">${appointment.appointmentTime}</strong>
                        </div>
                        <div style="font-size: 14px; display: flex; justify-content: space-between;">
                            <span style="color: #64748b; font-weight: 600;">Location:</span>
                            <strong style="color: #0f172a;">Sector 62, Mohali, Punjab, India</strong>
                        </div>
                    </div>
                </div>

                <div style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b;">
                    <p style="margin: 0;">© 2026 VitalSync Healthcare Platform.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        sendEmail(appointment.patientEmail, subject, htmlContent);

        return res.status(200).send("Appointment Rescheduled.");
    } catch (error) {
        console.error("Error rescheduling appointment:", error);
        return res.status(500).send("Error: " + error.message);
    }
};
