const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "appointment_confirmation",
        "appointment_reminder",
        "appointment_cancelled",
        "appointment_rescheduled",
        "your_turn",
        "prescription_added",
        "health_pulse_reminder",
        "follow_up",
        "review_request",
        "system_alert",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    sentViaEmail: {
      type: Boolean,
      default: false,
    },
    sentViaSMS: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;