const nodemailer = require("nodemailer");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Get user email by ID
const getUserEmail = async (userId) => {
  const user = await User.findById(userId);
  return user?.email;
};

// Get patient email
const getPatientEmail = async (patientId) => {
  const patient = await Patient.findById(patientId).populate("user");
  return patient?.user?.email;
};

// Get doctor email
const getDoctorEmail = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).populate("user");
  return doctor?.user?.email;
};

// Format date for emails
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (time) => {
  return time;
};

// ==================== EMAIL TEMPLATES ====================

// 1. Appointment Confirmation Email
const appointmentConfirmationTemplate = (patientName, doctorName, date, time, queueNumber) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .queue-number { background: #667eea; color: white; padding: 10px 20px; border-radius: 50px; display: inline-block; font-size: 24px; font-weight: bold; margin: 10px 0; }
        .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Confirmed! 🎉</h1>
          <p>Your health journey with Nabd begins</p>
        </div>
        <div class="content">
          <h2>Hello ${patientName},</h2>
          <p>Your appointment has been successfully booked. Here are the details:</p>
          
          <div class="appointment-details">
            <p><strong>👨‍⚕️ Doctor:</strong> ${doctorName}</p>
            <p><strong>📅 Date:</strong> ${formatDate(date)}</p>
            <p><strong>⏰ Time:</strong> ${formatTime(time)}</p>
            <div style="text-align: center;">
              <div class="queue-number">Queue #${queueNumber}</div>
              <p style="margin-top: 10px; color: #666;">Your position in the virtual waiting room</p>
            </div>
          </div>
          
          <p><strong>What to do next:</strong></p>
          <ul>
            <li>📝 Fill your <strong>Health Pulse</strong> data before the visit</li>
            <li>💊 Bring any previous prescriptions or test results</li>
            <li>⏰ Arrive 10 minutes before your appointment</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message from Nabd Clinic Management System.</p>
          <p>© 2024 Nabd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// 2. Your Turn Notification Email
const yourTurnTemplate = (patientName, doctorName, queueNumber) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; }
        .queue-number { font-size: 48px; font-weight: bold; color: #f5576c; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>It's Your Turn! 🔔</h1>
          <p>Please proceed to the doctor's office</p>
        </div>
        <div class="content">
          <div class="alert">
            <div class="queue-number">Queue #${queueNumber}</div>
            <p style="text-align: center;">Dr. ${doctorName} is ready to see you now!</p>
          </div>
          <p>Dear ${patientName},</p>
          <p>This is your turn. Please proceed to the doctor's consultation room.</p>
          <p>Make sure to have your health data ready for discussion.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// 3. Prescription Added Email
const prescriptionTemplate = (patientName, doctorName, medications) => {
  let medicationsList = "";
  medications.forEach((med, index) => {
    medicationsList += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${med.name}</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${med.dosage}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${med.frequency}</td>
      </tr>
    `;
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #4facfe; color: white; padding: 10px; text-align: left; }
        .button { background: #4facfe; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Prescription 📋</h1>
          <p>From Dr. ${doctorName}</p>
        </div>
        <div class="content">
          <h2>Hello ${patientName},</h2>
          <p>Dr. ${doctorName} has added a new prescription for you.</p>
          
          <h3>Medications:</h3>
          <table>
            <thead>
              <tr><th>#</th><th>Medication</th><th>Dosage</th><th>Frequency</th></tr>
            </thead>
            <tbody>
              ${medicationsList}
            </tbody>
          </table>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/prescriptions" class="button">View Full Prescription</a>
          </div>
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            <strong>⚠️ Important:</strong> Please follow the medication instructions carefully. 
            If you experience any side effects, contact your doctor immediately.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// 4. Health Pulse Reminder Email
const healthPulseReminderTemplate = (patientName, doctorName, appointmentDate) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .health-data { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Health Pulse Reminder 💓</h1>
          <p>Complete your health data before the visit</p>
        </div>
        <div class="content">
          <h2>Hello ${patientName},</h2>
          <p>Your appointment with <strong>Dr. ${doctorName}</strong> is on <strong>${formatDate(appointmentDate)}</strong>.</p>
          
          <div class="health-data">
            <p>Please take a few minutes to record:</p>
            <ul>
              <li>Blood Pressure (systolic/diastolic)</li>
              <li>Heart Rate</li>
              <li>Temperature</li>
              <li>Current Symptoms</li>
              <li>Any changes in health status</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/health-pulse" class="button">Record Health Data</a>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This helps your doctor provide better care during the consultation.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// 5. Follow-up Reminder Email
const followUpTemplate = (patientName, doctorName, daysAgo) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Follow-up Reminder 💙</h1>
        </div>
        <div class="content">
          <h2>Hello ${patientName},</h2>
          <p>It's been <strong>${daysAgo} days</strong> since your visit with <strong>Dr. ${doctorName}</strong>.</p>
          <p>We hope you're feeling better! If you have any concerns or need to schedule a follow-up:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/book-appointment" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Book Follow-up</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// 6. Appointment Cancelled Email
const appointmentCancelledTemplate = (patientName, doctorName, date, time) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Cancelled ❌</h1>
        </div>
        <div class="content">
          <p>Dear ${patientName},</p>
          <p>Your appointment with <strong>Dr. ${doctorName}</strong> on <strong>${formatDate(date)} at ${formatTime(time)}</strong> has been cancelled.</p>
          <p>If this was a mistake, please book a new appointment.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/book-appointment" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Book New Appointment</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// 7. Welcome Email
const welcomeTemplate = (username, role) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Nabd! 🎉</h1>
          <p>Your health journey starts here</p>
        </div>
        <div class="content">
          <h2>Hello ${username},</h2>
          <p>Welcome to <strong>Nabd</strong> - Smart Clinic Management System.</p>
          <p>We're excited to have you on board! Nabd helps you:</p>
          <ul>
            <li>📅 Book appointments easily</li>
            <li>💓 Track your health with Health Pulse</li>
            <li>💊 Manage prescriptions digitally</li>
            <li>🔔 Get reminders for your appointments</li>
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ==================== MAIN EMAIL FUNCTIONS ====================

// Generic send email function
const sendEmail = async ({ to, subject, html, from = process.env.EMAIL_FROM }) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Send appointment confirmation
const sendAppointmentConfirmation = async (patientId, doctorId, appointment) => {
  try {
    const patient = await Patient.findById(patientId).populate("user");
    const doctor = await Doctor.findById(doctorId).populate("user");
    
    if (!patient?.user?.email || !doctor?.user?.username) return false;
    
    const html = appointmentConfirmationTemplate(
      patient.user.username,
      doctor.user.username,
      appointment.date,
      appointment.startTime,
      appointment.queueNumber
    );
    
    return await sendEmail({
      to: patient.user.email,
      subject: "Appointment Confirmation - Nabd",
      html,
    });
  } catch (error) {
    console.error("Error sending appointment confirmation:", error);
    return false;
  }
};

// Send "Your Turn" notification
const sendYourTurnNotification = async (patientId, doctorId, queueNumber) => {
  try {
    const patient = await Patient.findById(patientId).populate("user");
    const doctor = await Doctor.findById(doctorId).populate("user");
    
    if (!patient?.user?.email) return false;
    
    const html = yourTurnTemplate(
      patient.user.username,
      doctor?.user?.username || "Doctor",
      queueNumber
    );
    
    return await sendEmail({
      to: patient.user.email,
      subject: "It's Your Turn! - Nabd",
      html,
    });
  } catch (error) {
    console.error("Error sending turn notification:", error);
    return false;
  }
};

// Send prescription notification
const sendPrescriptionNotification = async (patientId, doctorId, prescription) => {
  try {
    const patient = await Patient.findById(patientId).populate("user");
    const doctor = await Doctor.findById(doctorId).populate("user");
    
    if (!patient?.user?.email) return false;
    
    const html = prescriptionTemplate(
      patient.user.username,
      doctor?.user?.username || "Doctor",
      prescription.medications
    );
    
    return await sendEmail({
      to: patient.user.email,
      subject: "New Prescription - Nabd",
      html,
    });
  } catch (error) {
    console.error("Error sending prescription notification:", error);
    return false;
  }
};

// Send health pulse reminder
const sendHealthPulseReminder = async (patientId, doctorId, appointmentDate) => {
  try {
    const patient = await Patient.findById(patientId).populate("user");
    const doctor = await Doctor.findById(doctorId).populate("user");
    
    if (!patient?.user?.email) return false;
    
    const html = healthPulseReminderTemplate(
      patient.user.username,
      doctor?.user?.username || "Doctor",
      appointmentDate
    );
    
    return await sendEmail({
      to: patient.user.email,
      subject: "Health Pulse Reminder - Nabd",
      html,
    });
  } catch (error) {
    console.error("Error sending health pulse reminder:", error);
    return false;
  }
};

// Send follow-up reminder
const sendFollowUpReminder = async (patientId, doctorId, daysAgo) => {
  try {
    const patient = await Patient.findById(patientId).populate("user");
    const doctor = await Doctor.findById(doctorId).populate("user");
    
    if (!patient?.user?.email) return false;
    
    const html = followUpTemplate(
      patient.user.username,
      doctor?.user?.username || "Doctor",
      daysAgo
    );
    
    return await sendEmail({
      to: patient.user.email,
      subject: "Follow-up Reminder - Nabd",
      html,
    });
  } catch (error) {
    console.error("Error sending follow-up reminder:", error);
    return false;
  }
};

// Send cancellation notification
const sendCancellationNotification = async (patientId, doctorId, appointment) => {
  try {
    const patient = await Patient.findById(patientId).populate("user");
    const doctor = await Doctor.findById(doctorId).populate("user");
    
    if (!patient?.user?.email) return false;
    
    const html = appointmentCancelledTemplate(
      patient.user.username,
      doctor?.user?.username || "Doctor",
      appointment.date,
      appointment.startTime
    );
    
    return await sendEmail({
      to: patient.user.email,
      subject: "Appointment Cancelled - Nabd",
      html,
    });
  } catch (error) {
    console.error("Error sending cancellation notification:", error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (userId, username, email) => {
  try {
    const html = welcomeTemplate(username);
    
    return await sendEmail({
      to: email,
      subject: "Welcome to Nabd!",
      html,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

// Send test email (for development)
const sendTestEmail = async (to) => {
  return await sendEmail({
    to,
    subject: "Test Email - Nabd",
    html: "<h1>Test Email</h1><p>If you're seeing this, your email configuration is working!</p>",
  });
};

module.exports = {
  sendEmail,
  sendAppointmentConfirmation,
  sendYourTurnNotification,
  sendPrescriptionNotification,
  sendHealthPulseReminder,
  sendFollowUpReminder,
  sendCancellationNotification,
  sendWelcomeEmail,
  sendTestEmail,
  getUserEmail,
  getPatientEmail,
  getDoctorEmail,
};