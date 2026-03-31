const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { createAppointmentSchema } = require("../controllers/validations/appointmentValidation");
const { sendAppointmentConfirmation, sendCancellationNotification, sendYourTurnNotification } = require("../services/emailService");
const { createNotification } = require("../services/notificationService");

// POST appointments
const createAppointment = async (req, res, next) => {
  try {
    // Joi validation
    const { error, value } = createAppointmentSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      return res.status(400).json({ msg: "Validation Error", details: error.details });
    }

    const { doctorId, date, startTime, endTime } = value;

    // Get patient profile from logged in user
    const patient = await Patient.findOne({ user: req.userId }).populate("user");
    if (!patient) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    // Check doctor exists
    const doctor = await Doctor.findById(doctorId).populate("user");
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    // Check doctor is available on that day
    const appointmentDay = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC"
    });

    const daySchedule = doctor.schedule.find(
      (s) => s.day === appointmentDay && s.isAvailable
    );

    if (!daySchedule) {
      return res.status(400).json({ msg: "Doctor is not available on this day" });
    }

    // Check startTime is within doctor's working hours
    if (startTime < daySchedule.startTime || endTime > daySchedule.endTime) {
      return res.status(400).json({ msg: "Time is outside doctor's working hours" });
    }

    // Conflict check
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      startTime,
      status: { $ne: "cancelled" },
    });

    if (conflict) {
      return res.status(409).json({ msg: "This time slot is already booked" });
    }

    // Calculate queue number
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointmentsToday = await Appointment.countDocuments({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "cancelled" },
    });

    const queueNumber = appointmentsToday + 1;

    // Create appointment
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patient._id,
      date: new Date(date),
      startTime,
      endTime,
      queueNumber,
    });

    //  Send notification to patient
    await createNotification(patient.user._id, {
      type: "appointment_confirmation",
      title: "Appointment Confirmed",
      message: `Your appointment with Dr. ${doctor.user?.username} on ${date} at ${startTime} has been confirmed. Queue number: ${queueNumber}`,
      data: { appointmentId: appointment._id, queueNumber },
      sendEmail: true,
      email: patient.user?.email,
      priority: "high",
    });

    // Send email confirmation 
    sendAppointmentConfirmation(patient._id, doctorId, appointment).catch(console.error);

    res.status(201).json({
      success: true,
      msg: "Appointment booked successfully",
      data: {
        id: appointment._id,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        queueNumber: appointment.queueNumber,
        status: appointment.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET appointments for patient
const getMyAppointments = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.userId });
    if (!patient) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate("doctor", "specialization fees phone clinicAddress")
      .populate({ path: "doctor", populate: { path: "user", select: "username email" } })
      .sort({ date: 1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

// GET doctor appointments
const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.userId });
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    const { date } = req.query;
    const filter = { doctor: doctor._id };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(filter)
      .populate({ path: "patient", populate: { path: "user", select: "username email" } })
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

// Cancel appointment
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("doctor").populate("patient");
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    const patient = await Patient.findOne({ user: req.userId }).populate("user");
    if (appointment.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to cancel this appointment" });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ msg: "Appointment is already cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    //  Send notification
    await createNotification(patient.user._id, {
      type: "appointment_cancelled",
      title: "Appointment Cancelled",
      message: `Your appointment with Dr. ${appointment.doctor?.user?.username || "Doctor"} on ${appointment.date} at ${appointment.startTime} has been cancelled.`,
      data: { appointmentId: appointment._id },
      sendEmail: true,
      email: patient.user?.email,
      priority: "medium",
    });

    sendCancellationNotification(appointment.patient, appointment.doctor, appointment).catch(console.error);

    res.status(200).json({ success: true, msg: "Appointment cancelled successfully" });
  } catch (error) {
    next(error);
  }
};

// Get queue status
const getQueueStatus = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const queue = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["scheduled", "completed"] },
    })
      .select("queueNumber status startTime patient")
      .populate({ path: "patient", populate: { path: "user", select: "username" } })
      .sort({ queueNumber: 1 });

    const currentNumber = queue.find((a) => a.status === "scheduled")?.queueNumber || null;

    res.status(200).json({
      success: true,
      data: {
        currentlyServing: currentNumber,
        queue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    const doctor = await Doctor.findOne({ user: req.userId });
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const validStatuses = ['scheduled', 'completed', 'cancelled', 'no-show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      msg: `Appointment status updated to ${status}`,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Get current queue status with user position
const getCurrentQueueStatus = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'completed'] },
    })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'username' }
      })
      .sort({ queueNumber: 1 });

    const currentAppointment = todayAppointments.find(a => a.status === 'scheduled');
    const currentlyServing = currentAppointment ? currentAppointment.queueNumber : null;
    const waitingCount = todayAppointments.filter(a => a.status === 'scheduled').length;

    let myQueueNumber = null;
    if (req.userId) {
      const patient = await Patient.findOne({ user: req.userId });
      if (patient) {
        const myAppointment = todayAppointments.find(
          a => a.patient && a.patient._id.toString() === patient._id.toString()
        );
        myQueueNumber = myAppointment ? myAppointment.queueNumber : null;
        
        if (myAppointment && currentlyServing === myQueueNumber && myAppointment.status === 'scheduled') {
          sendYourTurnNotification(patient._id, doctorId, myQueueNumber).catch(console.error);
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        doctorId,
        date: new Date().toDateString(),
        currentlyServing,
        waitingCount,
        totalAppointments: todayAppointments.length,
        myQueueNumber,
        queue: todayAppointments.map(a => ({
          queueNumber: a.queueNumber,
          status: a.status,
          startTime: a.startTime,
          patientName: a.patient?.user?.username || 'Unknown',
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get doctor today's appointments
const getDoctorTodayAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.userId }).populate('user', 'username');
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      doctor: doctor._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'username email phone' }
      })
      .sort({ queueNumber: 1 });

    res.status(200).json({
      success: true,
      data: {
        doctor: {
          name: doctor.user?.username || 'Doctor',
          specialization: doctor.specialization,
        },
        date: new Date().toDateString(),
        appointments: appointments.map(a => ({
          id: a._id,
          queueNumber: a.queueNumber,
          startTime: a.startTime,
          endTime: a.endTime,
          status: a.status,
          patient: {
            name: a.patient?.user?.username || 'Unknown',
            phone: a.patient?.phone || null,
          },
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Complete appointment and get next
const completeAndNext = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findOne({ user: req.userId });
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    const currentAppointment = await Appointment.findById(id).populate("patient").populate("doctor");
    if (!currentAppointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (currentAppointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    currentAppointment.status = "completed";
    await currentAppointment.save();

    // ✅ Send notification for completed appointment
    const patient = await Patient.findById(currentAppointment.patient).populate("user");
    await createNotification(patient.user._id, {
      type: "appointment_completed",
      title: "Appointment Completed",
      message: `Your appointment with Dr. ${doctor.user?.username} has been completed. Please check your prescriptions and provide feedback.`,
      data: { appointmentId: currentAppointment._id },
      sendEmail: false,
      priority: "medium",
    });

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const nextAppointment = await Appointment.findOne({
      doctor: doctor._id,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "scheduled",
      queueNumber: { $gt: currentAppointment.queueNumber },
    })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'username' }
      })
      .sort({ queueNumber: 1 });

    let nextPatientName = 'Unknown';
    if (nextAppointment && nextAppointment.patient) {
      const nextPatient = await Patient.findById(nextAppointment.patient).populate('user', 'username');
      nextPatientName = nextPatient?.user?.username || 'Unknown';
      
      // ✅ Send notification for next patient
      await createNotification(nextPatient.user._id, {
        type: "your_turn",
        title: "It's Your Turn!",
        message: `Please proceed to the doctor's office. Your queue number is ${nextAppointment.queueNumber}`,
        data: { appointmentId: nextAppointment._id, queueNumber: nextAppointment.queueNumber },
        sendEmail: false,
        priority: "high",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Appointment completed",
      data: {
        completedAppointment: {
          id: currentAppointment._id,
          queueNumber: currentAppointment.queueNumber,
        },
        nextAppointment: nextAppointment ? {
          id: nextAppointment._id,
          queueNumber: nextAppointment.queueNumber,
          patientName: nextPatientName,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  getQueueStatus,
  updateAppointmentStatus,
  getCurrentQueueStatus,
  getDoctorTodayAppointments,
  completeAndNext,
};