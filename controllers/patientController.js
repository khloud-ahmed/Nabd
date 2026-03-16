const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
// patient profile 
const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id })
      .populate('user', 'name email profileImage');
    
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 
const getMyAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    
    const appointments = await Appointment.find({ patient: patient._id })
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name specialization' }
      })
      .sort('-date');
    
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyProfile,
  getMyAppointments
};