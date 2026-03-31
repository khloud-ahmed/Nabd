const Notification = require("../models/Notification");
const { sendEmail } = require("./emailService");

// Create a notification
const createNotification = async (userId, notificationData) => {
  try {
    const notification = await Notification.create({
      user: userId,
      ...notificationData,
    });

    // Send email if needed
    if (notificationData.sendEmail && notificationData.email) {
      await sendEmail({
        to: notificationData.email,
        subject: notificationData.title,
        html: `<p>${notificationData.message}</p>`,
      });
      
      notification.sentViaEmail = true;
      await notification.save();
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Get user notifications
const getUserNotifications = async (userId, limit = 50, offset = 0) => {
  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const unreadCount = await Notification.countDocuments({
    user: userId,
    isRead: false,
  });

  return { notifications, unreadCount };
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  return notification;
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Delete notification
const deleteNotification = async (notificationId, userId) => {
  const result = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });
  return result;
};

// Delete old read notifications
const deleteOldReadNotifications = async (daysOld = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  await Notification.deleteMany({
    isRead: true,
    createdAt: { $lt: cutoffDate },
  });
};

// Send appointment reminder (to be called by cron job)
const sendAppointmentReminders = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const appointments = await Appointment.find({
    date: { $gte: tomorrow, $lt: dayAfter },
    status: "scheduled",
  }).populate("patient").populate("doctor");

  for (const appointment of appointments) {
    await createNotification(appointment.patient.user, {
      type: "appointment_reminder",
      title: "Appointment Reminder",
      message: `Reminder: You have an appointment with Dr. ${appointment.doctor.user?.username} tomorrow at ${appointment.startTime}`,
      data: { appointmentId: appointment._id },
      sendEmail: true,
      email: appointment.patient.user?.email,
    });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteOldReadNotifications,
  sendAppointmentReminders,
};