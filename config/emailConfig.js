const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();  

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

 
transporter.verify((error, success) => {
  if (error) {
    console.log("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const emailTemplates = {
 
  appointmentConfirmation: (patientName, doctorName, date, time, queueNumber) => ({
    subject: `✅ Appointment Confirmation - Dr. ${doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2c3e50; text-align: center;">Nabd - Appointment Confirmation</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Dear ${patientName},</strong></p>
          <p>Your appointment has been successfully booked with <strong>Dr. ${doctorName}</strong>.</p>
          <h3 style="color: #3498db;">Appointment Details:</h3>
          <ul style="list-style: none; padding-left: 0;">
            <li>📅 <strong>Date:</strong> ${date}</li>
            <li>⏰ <strong>Time:</strong> ${time}</li>
            <li>🔢 <strong>Queue Number:</strong> ${queueNumber}</li>
          </ul>
          <p style="color: #e67e22;">⚠️ Please arrive 15 minutes before your appointment time.</p>
        </div>
        <p style="color: #7f8c8d; font-size: 12px; text-align: center;">This is an automated message from Nabd System.</p>
      </div>
    `,
  }),

  appointmentCancellation: (patientName, doctorName, date, time) => ({
    subject: `❌ Appointment Cancelled - Dr. ${doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #e74c3c; text-align: center;">Nabd - Appointment Cancelled</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Dear ${patientName},</strong></p>
          <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been cancelled.</p>
          <h3 style="color: #e74c3c;">Cancelled Appointment:</h3>
          <ul style="list-style: none; padding-left: 0;">
            <li>📅 <strong>Date:</strong> ${date}</li>
            <li>⏰ <strong>Time:</strong> ${time}</li>
          </ul>
          <p>You can book a new appointment anytime through Nabd.</p>
        </div>
        <p style="color: #7f8c8d; font-size: 12px; text-align: center;">This is an automated message from Nabd System.</p>
      </div>
    `,
  }),

 
  appointmentReminder: (patientName, doctorName, date, time, queueNumber) => ({
    subject: `🔔 Appointment Reminder - Tomorrow with Dr. ${doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #3498db; text-align: center;">Nabd - Appointment Reminder</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Dear ${patientName},</strong></p>
          <p>This is a reminder for your appointment with <strong>Dr. ${doctorName}</strong> tomorrow.</p>
          <h3 style="color: #3498db;">Appointment Details:</h3>
          <ul style="list-style: none; padding-left: 0;">
            <li>📅 <strong>Date:</strong> ${date}</li>
            <li>⏰ <strong>Time:</strong> ${time}</li>
            <li>🔢 <strong>Queue Number:</strong> ${queueNumber}</li>
          </ul>
          <p style="color: #27ae60;">✅ Please don't forget to enter your health data (Health Pulse) before the visit.</p>
        </div>
        <p style="color: #7f8c8d; font-size: 12px; text-align: center;">This is an automated message from Nabd System.</p>
      </div>
    `,
  }),

  yourTurnNotification: (patientName, doctorName, queueNumber) => ({
    subject: `🔔 It's Your Turn! - Dr. ${doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #27ae60; text-align: center;">🎉 Nabd - It's Your Turn!</h2>
        <div style="background-color: #d5f5e3; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p><strong>Dear ${patientName},</strong></p>
          <p style="font-size: 24px; font-weight: bold; color: #27ae60;">Queue Number ${queueNumber}</p>
          <p>Your turn has arrived! Please proceed to <strong>Dr. ${doctorName}</strong>'s clinic now.</p>
        </div>
        <p style="color: #7f8c8d; font-size: 12px; text-align: center;">This is an automated message from Nabd System.</p>
      </div>
    `,
  }),

 
  postAppointmentFeedback: (patientName, doctorName, appointmentId) => ({
    subject: `⭐ How was your visit with Dr. ${doctorName}?`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #8e44ad; text-align: center;">Nabd - Share Your Experience</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Dear ${patientName},</strong></p>
          <p>Thank you for visiting <strong>Dr. ${doctorName}</strong>.</p>
          <p>We would love to hear about your experience! Please take a moment to rate your visit.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL}/rate/${appointmentId}" 
               style="background-color: #8e44ad; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Rate Your Visit ⭐
            </a>
          </div>
        </div>
        <p style="color: #7f8c8d; font-size: 12px; text-align: center;">This is an automated message from Nabd System.</p>
      </div>
    `,
  }),

  followUpSuggestion: (patientName, doctorName, days) => ({
    subject: `🏥 Follow-up Suggestion from Dr. ${doctorName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2980b9; text-align: center;">Nabd - Follow-up Suggestion</h2>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Dear ${patientName},</strong></p>
          <p>Based on your last visit with <strong>Dr. ${doctorName}</strong>, we suggest scheduling a follow-up appointment in ${days} days.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL}/book/${doctorName}" 
               style="background-color: #2980b9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Book Follow-up 📅
            </a>
          </div>
        </div>
        <p style="color: #7f8c8d; font-size: 12px; text-align: center;">This is an automated message from Nabd System.</p>
      </div>
    `,
  }),
};


const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Nabd Health System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { transporter, emailTemplates, sendEmail };