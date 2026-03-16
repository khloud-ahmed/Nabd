const Doctor = require("../models/Doctor");
const User = require("../models/User");

// get all doctors 
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate('user', 'name email profileImage')
            .select('specialization fees averageRating schedule profileImage');
        
        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
//get doctors by name 
const getDoctorByName = async (req, res) => {
  try {
    const { name } = req.query;
    
    const doctors = await Doctor.find()
      .populate({
        path: 'user',
        match: { 
          name: { $regex: name, $options: 'i' }  
        },
        select: 'name email profileImage'
      })
      .select('specialization fees averageRating profileImage');
    
    const foundDoctors = doctors.filter(doctor => doctor.user !== null);
    if (foundDoctors.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Not found ' 
      });
    }
    res.status(200).json({ 
      success: true, 
      count: foundDoctors.length,
      data: foundDoctors 
    });
    
  } catch (error) {
    res.status(500).json(
        { success: false, 
            message: error.message
         });
  }
};

//get doc appointment 
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    const appointments = await Appointment.find({ 
      doctor: doctor._id,
      status: 'scheduled'
    })
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name phone' }
    })
    .sort('date');
    
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Specialization
const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.query;
    
    const doctors = await Doctor.find({ 
      specialization: { $regex: specialization, $options: 'i' } 
    })
    .populate('user', 'name email profileImage')
    .select('specialization fees averageRating profileImage');
    
    if (doctors.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Not found " 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      count: doctors.length,
      data: doctors 
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/// by rating 
const getDoctorsByMinRating = async (req, res) => {
  try {
    const { rating } = req.query; 
    
   
    const doctors = await Doctor.find({ 
      averageRating: { $gte: parseFloat(rating) } 
    })
    .populate('user', 'name email profileImage')
    .select('specialization fees averageRating profileImage')
    .sort({ averageRating: -1 }); 
    
    if (doctors.length === 0) {
      return res.status(404).json({ 
        success: false, 
       message: "Not found "  
      });
    }
    
    res.status(200).json({ 
      success: true, 
      count: doctors.length,
      data: doctors 
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
 getAllDoctors,
  getDoctorByName,
  getDoctorAppointments ,
  getDoctorsBySpecialization,
   getDoctorsByMinRating,

};