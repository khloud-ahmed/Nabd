const PrescriptionSchema = new mongoose.Schema({
  appointment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment', 
    required: true 
  },
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
  
  
  diagnosis: { 
    type: String, 
    required: true 
  },
  notes: String,
  
  
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true }, 
    frequency: { type: String, required: true }, 
    duration: { type: String, required: true }, 
    instructions: String 
  }],
  
 
  date: { 
    type: Date, 
    default: Date.now 
  }
});