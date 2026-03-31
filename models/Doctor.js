const mongoose = require("mongoose");  
const DoctorSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  specialization: { 
    type: String, 
    required: true 
  },
  fees: { 
    type: Number, 
    required: true 
  },
  schedule: [{
    day: { 
      type: String, 
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
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
    isAvailable: { 
      type: Boolean, 
      default: true 
    }
  }],
  reviews: [{
    patient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Patient' 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5 
    },
    comment: String,
    date: { 
      type: Date, 
      default: Date.now 
    }
  }],
  
  averageRating: { 
    type: Number, 
    default: 0 
  },
  totalReviews: { 
    type: Number, 
    default: 0 
  },
  bio: String,
  clinicAddress: String,
  phone: String 
  
});
const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;