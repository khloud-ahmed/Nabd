const Notification = require("../models/Notification");
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../services/notificationService");

// GET notifications
const getNotifications = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;

    const { notifications, unreadCount } = await getUserNotifications(
      userId,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        total: notifications.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};


const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};


const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await markAsRead(id, userId);

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      msg: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// PUTnotificationس
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await markAllAsRead(userId);

    res.status(200).json({
      success: true,
      msg: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE 
const deleteNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await deleteNotification(id, userId);

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      msg: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE ALL
const deleteAllReadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Notification.deleteMany({
      user: userId,
      isRead: true,
    });

    res.status(200).json({
      success: true,
      msg: `${result.deletedCount} notifications deleted`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
  deleteAllReadNotifications,
};