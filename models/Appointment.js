const mongoose = require("mongoose");  
const AppointmentSchema = new mongoose.Schema({
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
  },
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  }, 
  startTime: { 
    type: String, 
    required: true 
  }, 
  endTime: { 
    type: String, 
    required: true 
  }, 
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  queueNumber: Number,
  
});

AppointmentSchema.index(
  { doctor: 1, date: 1, startTime: 1 }, 
  { unique: true }
);