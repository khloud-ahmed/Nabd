# 🫀 Nabd — Smart Clinic Management System

> **نبض** means "pulse" — a continuous health connection between patients and doctors.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.jsx       # Global state (role, page navigation)
├── data/
│   └── mockData.js          # Sample data (appointments, prescriptions, etc.)
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar with role switcher
│   └── TopBar.jsx           # Header with search & notifications
├── pages/
│   ├── Dashboard.jsx        # Role-based dashboard (Doctor / Patient / Admin)
│   ├── Appointments.jsx     # Appointment list + booking modal
│   ├── HealthPulse.jsx      # Pre-visit vitals form / doctor view
│   ├── Queue.jsx            # Virtual waiting room
│   ├── Prescriptions.jsx    # Digital prescriptions with reminders
│   ├── Reviews.jsx          # Honest question-based rating system
│   ├── BookAppointment.jsx  # 3-step booking flow (Patient)
│   └── FollowUp.jsx         # Smart post-visit follow-up (Patient)
├── App.jsx                  # Main layout + page router
└── index.js                 # React entry point
```

---

## 👥 Roles

Switch between roles using the **role switcher** in the sidebar:

| Role | Features |
|------|----------|
| **Doctor** | Dashboard, Appointments, Health Pulse viewer, Queue management, Prescriptions, Reviews |
| **Patient** | Dashboard, Book Appointment, Health Pulse form, My Queue, My Prescriptions, Follow-up |
| **Admin** | Overview, Doctors management, Reports |

---

## ✨ Key Features

### 🫀 Health Pulse
Patients submit vitals (BP, temperature, pulse, weight, blood sugar, oxygen) before their visit. Doctors see a visual summary with status indicators.

### 🏥 Virtual Waiting Room
Real-time queue position display. Patients see their estimated wait time and get notified when called in.

### 💊 Smart Prescription
Digital prescriptions with per-drug dosage instructions and automatic reminder times. Includes print functionality.

### 📅 3-Step Booking Flow
Doctor selection → Date & time picker with conflict prevention → Confirmation summary.

### 🔔 Smart Follow-up
Post-visit automated check-ins. Patients respond to doctor questions. System suggests follow-up appointments if needed.

### ★ Honest Reviews
Question-based rating system (not just stars). Covers communication, attentiveness, prescription quality, and recommendation.

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **React Router DOM v6** — (ready to integrate, currently using Context-based routing)
- **Lucide React** — Icons
- **DM Sans + DM Serif Display** — Typography (Google Fonts)
- No external UI library — all components hand-crafted

---

## 🔗 Backend Integration Points

Replace mock data in `src/data/mockData.js` with API calls to:

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/appointments
POST   /api/appointments
GET    /api/health-pulse/:appointmentId
POST   /api/health-pulse
GET    /api/prescriptions
POST   /api/prescriptions
GET    /api/queue
GET    /api/reviews
POST   /api/reviews
GET    /api/admin/reports
```

Backend: **Node.js + Express + JWT + MongoDB/PostgreSQL** (as per project spec)

---

## 🎨 Design System

- **Primary color**: `#1DB68A` (teal-green)
- **Font**: DM Sans (body) + DM Serif Display (logo)
- **Border radius**: 10–16px (soft, clinic-friendly)
- **Color coding**: green = normal, red = alert, amber = warning
