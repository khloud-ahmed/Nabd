const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  addPreAppointmentHealthData,
  getHealthDataForDoctor,
  getMyHealthHistory,
  getPatientHealthHistory,
} = require("../controllers/healthRecordController");

//  Patient routes
router.post(
  "/pre-appointment/:appointmentId",
  authMiddleware,
  roleMiddleware("patient"),
  addPreAppointmentHealthData
);

router.get(
  "/my-history",
  authMiddleware,
  roleMiddleware("patient"),
  getMyHealthHistory
);

//Doctor routes
router.get(
  "/doctor/appointment/:appointmentId",
  authMiddleware,
  roleMiddleware("doctor"),
  getHealthDataForDoctor
);

router.get(
  "/doctor/patient/:patientId",
  authMiddleware,
  roleMiddleware("doctor"),
  getPatientHealthHistory
);

module.exports = router;