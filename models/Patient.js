const mongoose = require("mongoose");  
const PatientSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  gender: { 
    type: String, 
    enum: ['male', 'female'],
    required: true 
  },
  dateOfBirth: { 
    type: Date, 
    required: true 
  }
  
});
const Patient = mongoose.model("Patient", PatientSchema);
module.exports = Patient;