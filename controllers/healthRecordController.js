const mongoose = require("mongoose");
const HealthRecord = require("../models/HealthRecord");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const { createNotification } = require("../services/notificationService");

// Add appointment health data
const addPreAppointmentHealthData = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const healthData = req.body;

    // Get patient
    const patient = await Patient.findOne({ user: req.userId }).populate("user");
    if (!patient) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    // Check appointment exists and belongs to patient
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (appointment.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Check if health record already exists for this appointment
    let healthRecord = await HealthRecord.findOne({ appointment: appointmentId });
    
    if (healthRecord) {
      // Update existing
      healthRecord = await HealthRecord.findOneAndUpdate(
        { appointment: appointmentId },
        { ...healthData, recordedAt: new Date() },
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      healthRecord = await HealthRecord.create({
        patient: patient._id,
        appointment: appointmentId,
        ...healthData,
      });
    }

    //  Send notification
    await createNotification(patient.user._id, {
      type: "health_pulse_reminder",
      title: "Health Data Recorded",
      message: "Your health data has been successfully recorded before your appointment.",
      data: { healthRecordId: healthRecord._id },
      sendEmail: false,
      priority: "low",
    });

    res.status(201).json({
      success: true,
      msg: "Health data saved successfully",
      data: healthRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Get health data for doctor (by appointment)
const getHealthDataForDoctor = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    // Check doctor exists
    const doctor = await Doctor.findOne({ user: req.userId });
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    // Get appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    // Check if doctor owns this appointment
    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Get health record
    const healthRecord = await HealthRecord.findOne({ appointment: appointmentId })
      .populate("patient", "phone gender dateOfBirth");

    if (!healthRecord) {
      return res.status(404).json({ msg: "Health record not found" });
    }

    res.status(200).json({
      success: true,
      data: healthRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Get my health history (patient)
const getMyHealthHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.userId });
    if (!patient) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    const healthRecords = await HealthRecord.find({ patient: patient._id })
      .populate("appointment", "date startTime doctor")
      .populate({
        path: "appointment",
        populate: { path: "doctor", populate: { path: "user", select: "username" } }
      })
      .sort({ recordedAt: -1 });

    res.status(200).json({
      success: true,
      data: healthRecords,
    });
  } catch (error) {
    next(error);
  }
};

// Get patient health history (doctor)
const getPatientHealthHistory = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Check doctor exists
    const doctor = await Doctor.findOne({ user: req.userId });
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    // Check patient exists
    const patient = await Patient.findById(patientId).populate("user");
    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    const healthRecords = await HealthRecord.find({ patient: patientId })
      .populate("appointment", "date startTime")
      .sort({ recordedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        patient: {
          id: patient._id,
          name: patient.user?.username,
          phone: patient.phone,
          gender: patient.gender,
          dateOfBirth: patient.dateOfBirth,
        },
        healthRecords,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get health record by ID
const getHealthRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const healthRecord = await HealthRecord.findById(id)
      .populate("patient", "phone gender dateOfBirth")
      .populate("appointment", "date startTime doctor");

    if (!healthRecord) {
      return res.status(404).json({ msg: "Health record not found" });
    }

    // Check authorization
    const patient = await Patient.findOne({ user: req.userId });
    const doctor = await Doctor.findOne({ user: req.userId });

    if (!patient && !doctor) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (patient && healthRecord.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (doctor) {
      const appointment = await Appointment.findById(healthRecord.appointment);
      if (appointment && appointment.doctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({ msg: "Not authorized" });
      }
    }

    res.status(200).json({
      success: true,
      data: healthRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Update health record
const updateHealthRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const healthRecord = await HealthRecord.findById(id);
    if (!healthRecord) {
      return res.status(404).json({ msg: "Health record not found" });
    }

    // Check authorization (only patient who owns it)
    const patient = await Patient.findOne({ user: req.userId });
    if (!patient || healthRecord.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      id,
      { ...updateData, recordedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      msg: "Health record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Delete health record
const deleteHealthRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    const healthRecord = await HealthRecord.findById(id);
    if (!healthRecord) {
      return res.status(404).json({ msg: "Health record not found" });
    }

    // Check authorization (only patient who owns it)
    const patient = await Patient.findOne({ user: req.userId });
    if (!patient || healthRecord.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await healthRecord.deleteOne();

    res.status(200).json({
      success: true,
      msg: "Health record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addPreAppointmentHealthData,
  getHealthDataForDoctor,
  getMyHealthHistory,
  getPatientHealthHistory,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord,
};