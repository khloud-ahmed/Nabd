const express =require ("express");
const {
    getMyProfile,
    getMyAppointments,
}=require("../controllers/patientController");
const router = express.Router ();

router.get ("/", getMyProfile);
router.get ("/",  getMyAppointments);
module.exports = router;