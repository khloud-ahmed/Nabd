require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


const port = process.env.PORT || 3000;
async function dbConnection() {
  try {
    await mongoose.connect(process.env.URL);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.log(error);
  }
}
dbConnection();

// Require Routes
const authRoutes = require("./routes/AuthRoutes");
const appointmentRoutes = require("./routes/AppointmentRoutes");
const healthRecordRoutes = require("./routes/healthRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const errormiddleware = require("./middleware/errormiddleware");
// Endpoints
app.use("/api", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/health-records", healthRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/errormiddleware", errormiddleware);
// Run Server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});