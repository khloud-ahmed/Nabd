const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
  deleteAllReadNotifications,
} = require("../controllers/NotificationController");

// All routes require authentication
router.use(authMiddleware);

// GET /notifications
router.get("/", getNotifications);

// GET /notifications/unread/count
router.get("/unread/count", getUnreadCount);

// PU/notifications/read-all
router.put("/read-all", markAllNotificationsAsRead);

// PUT /notifications/:id/read
router.put("/:id/read", markNotificationAsRead);

// DELETE /notifications/delete-all-read
router.delete("/delete-all-read", deleteAllReadNotifications);

// DELETE /notifications/:id
router.delete("/:id", deleteNotificationById);

module.exports = router;