const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const User = require("../models/User");
const { createNotification } = require("../services/notificationService");


// POST 
const createPrescription = async (req, res , next) => {
  try {
    const { appointmentId, diagnosis, medications, notes } = req.body;

    // 1. check if user is doctor and has profile
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    // 2. check if appointment exists and belongs to this doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // 3.check if appointment is completed (only after completion doctor can create prescription)
    if (appointment.status !== "completed") {
      return res.status(400).json({ 
        msg: "Can only create prescription after appointment is completed" 
      });
    }

    // 4. check if prescription already exists for this appointment (one prescription per appointment)
    const existingPrescription = await Prescription.findOne({ appointment: appointmentId });
    if (existingPrescription) {
      return res.status(400).json({ msg: "Prescription already exists for this appointment" });
    }

    // 5. create prescription
    const prescription = await Prescription.create({
      appointment: appointmentId,
      doctor: doctor._id,
      patient: appointment.patient,
      diagnosis,
      medications,
      notes,
    });

// Get patient for notification
    const patient = await Patient.findById(appointment.patient).populate("user");
    
    //  Send notification (INSIDE the function)
    await createNotification(patient.user._id, {
      type: "prescription_added",
      title: "New Prescription",
      message: `Dr. ${doctor.user?.username} has added a new prescription for you. Please check it.`,
      data: { prescriptionId: prescription._id },
      sendEmail: true,
      email: patient.user?.email,
      priority: "high",
    });

    // Send email notification
    sendPrescriptionNotification(patient._id, doctor._id, prescription).catch(console.error);

    res.status(201).json({
      success: true,
      msg: "Prescription created/updated successfully",
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};


//view prescriptions for patient himself
// GET 
const getMyPrescriptions = async (req, res , next) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    const prescriptions = await Prescription.find({ patient: patient._id })
      .populate("doctor", "specialization fees clinicAddress")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "username email" }
      })
      .populate("appointment", "date startTime")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// view his own prescriptions as doctor (doctor can view all prescriptions he created for his patients)
// GET /api/prescriptions/doctor/my
const getMyPrescriptionsAsDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    const prescriptions = await Prescription.find({ doctor: doctor._id })
      .populate("patient", "phone gender dateOfBirth")
      .populate({
        path: "patient",
        populate: { path: "user", select: "username email" }
      })
      .populate("appointment", "date startTime")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// specific prescription details (doctor or patient can view)
// GET 
const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    const prescription = await Prescription.findById(id)
      .populate("doctor", "specialization fees clinicAddress")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "username email" }
      })
      .populate("patient", "phone gender dateOfBirth")
      .populate({
        path: "patient",
        populate: { path: "user", select: "username email" }
      })
      .populate("appointment", "date startTime status");

    if (!prescription) {
      return res.status(404).json({ msg: "Prescription not found" });
    }

    // authorization
    if (userRole === "patient") {
      const patient = await Patient.findOne({ user: userId });
      if (prescription.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ msg: "Not authorized" });
      }
    } else if (userRole === "doctor") {
      const doctor = await Doctor.findOne({ user: userId });
      if (prescription.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({ msg: "Not authorized" });
      }
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrescription,
  getMyPrescriptions,
  getMyPrescriptionsAsDoctor,
  getPrescriptionById,
};