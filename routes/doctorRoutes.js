const express = require("express");
const { 
  getAllDoctors,
  getDoctorByName, 
  getDoctorsBySpecialization, 
  getDoctorsByMinRating ,
  getDoctorAppointments
} = require("../controllers/doctorController");

const router = express.Router();


router.get("/", getAllDoctors);                          
router.get("/search/name", getDoctorByName);             
router.get("/specialization", getDoctorsBySpecialization);
router.get("/rating", getDoctorsByMinRating);           
router.get("/rating", getDoctorAppointments);  
module.exports = router;