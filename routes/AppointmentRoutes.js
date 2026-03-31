const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  getQueueStatus,
  updateAppointmentStatus,
  getCurrentQueueStatus,
  getDoctorTodayAppointments,
  completeAndNext,
} = require("../controllers/Appointmentcontroller");

//  Public Routes
router.get("/queue/:doctorId", getQueueStatus);

//  Protected Route Patient 
router.post("/", authMiddleware, roleMiddleware("patient"), createAppointment);
router.get("/my", authMiddleware, roleMiddleware("patient"), getMyAppointments);
router.put("/:id/cancel", authMiddleware, roleMiddleware("patient"), cancelAppointment);

//  Protected RoutesDoctor
router.get("/doctor", authMiddleware, roleMiddleware("doctor"), getDoctorAppointments);
router.get("/doctor/today", authMiddleware, roleMiddleware("doctor"), getDoctorTodayAppointments);
router.put("/:id/status", authMiddleware, roleMiddleware("doctor"), updateAppointmentStatus);
router.put("/:id/complete-and-next", authMiddleware, roleMiddleware("doctor"), completeAndNext);

//  Protected Routes -  Patient & Doctor 
router.get("/queue/:doctorId/current", authMiddleware, getCurrentQueueStatus);

module.exports = router;