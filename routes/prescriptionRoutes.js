const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createPrescription,
  getMyPrescriptions,
  getMyPrescriptionsAsDoctor,
  getPrescriptionById,
} = require("../controllers/prescriptionController");

// Doctor routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("doctor"),
  createPrescription
);

router.get(
  "/doctor/my",
  authMiddleware,
  roleMiddleware("doctor"),
  getMyPrescriptionsAsDoctor
);

//  Patient routes
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("patient"),
  getMyPrescriptions
);

// Both can access 
router.get(
  "/:id",
  authMiddleware,
  getPrescriptionById
);

module.exports = router;