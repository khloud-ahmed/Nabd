const HealthRecordSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
  },
  appointment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment' 
  },
  
  
  bloodPressure: {
    systolic: Number, 
    diastolic: Number  
  },
  heartRate: Number,
  temperature: Number,
  bloodSugar: Number,
  weight: Number,
  

  chronicDiseases: [{ 
    type: String,
    name: String,    
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'controlled', 'inactive']
    }
  }],

  allergies: [{
    name: String,     
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    reaction: String 
  }],
  
 
  currentSymptoms: [{
    symptom: String,   
    duration: String,  
    severity: Number   
  }],
  

  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date
  }],
  
  
  surgeries: [{
    name: String,
    date: Date,
    hospital: String
  }],
  
  recordedAt: { 
    type: Date, 
    default: Date.now 
  }
});