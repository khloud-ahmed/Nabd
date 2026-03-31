export const appointments = [
  { id: 1, patient: 'Sarah Mitchell', initials: 'SM', color: '#E0F7F0', textColor: '#0F6E56', time: '09:00 AM', type: 'Blood Pressure Check', status: 'in-progress', avatar: null },
  { id: 2, patient: 'James Thornton', initials: 'JT', color: '#E6F1FB', textColor: '#185FA5', time: '09:30 AM', type: 'Follow-up Visit', status: 'upcoming', avatar: null },
  { id: 3, patient: 'Nora Hassan', initials: 'NH', color: '#FBEAF0', textColor: '#993556', time: '10:00 AM', type: 'New Consultation', status: 'upcoming', avatar: null },
  { id: 4, patient: 'Yusuf Saleh', initials: 'YS', color: '#FAEEDA', textColor: '#854F0B', time: '10:30 AM', type: 'Joint Pain', status: 'waiting', avatar: null },
  { id: 5, patient: 'Reem Adel', initials: 'RA', color: '#EEEDFE', textColor: '#534AB7', time: '11:00 AM', type: 'Diabetes Check', status: 'waiting', avatar: null },
  { id: 6, patient: 'Liam Carter', initials: 'LC', color: '#E1F5EE', textColor: '#0F6E56', time: '11:30 AM', type: 'Routine Checkup', status: 'scheduled', avatar: null },
];

export const healthPulse = {
  patient: 'Sarah Mitchell',
  bp: '130/85',
  bpStatus: 'high',
  temp: '37.2°C',
  tempStatus: 'normal',
  pulse: '78 bpm',
  pulseStatus: 'normal',
  weight: '72 kg',
  weightStatus: 'normal',
  symptoms: 'Mild headache, slight dizziness',
  submittedAt: '08:45 AM',
};

export const prescriptions = [
  {
    id: 1,
    patient: 'Sarah Mitchell',
    date: 'March 29, 2026',
    drugs: [
      { name: 'Amlodipine 5mg', dosage: '1 tablet daily — morning with food', duration: '30 days', reminder: '9:00 AM daily' },
      { name: 'Omeprazole 20mg', dosage: '1 capsule before meals — twice daily', duration: '14 days', reminder: '8:00 AM & 8:00 PM' },
    ],
    status: 'active',
  },
  {
    id: 2,
    patient: 'James Thornton',
    date: 'March 15, 2026',
    drugs: [
      { name: 'Paracetamol 500mg', dosage: '1 tablet when needed — every 8 hrs', duration: '7 days', reminder: null },
    ],
    status: 'expired',
  },
  {
    id: 3,
    patient: 'Nora Hassan',
    date: 'March 10, 2026',
    drugs: [
      { name: 'Metformin 500mg', dosage: '1 tablet twice daily with meals', duration: '60 days', reminder: '7:00 AM & 7:00 PM' },
    ],
    status: 'active',
  },
];

export const queue = [
  { position: 1, patient: 'Sarah Mitchell', initials: 'SM', status: 'in-room', wait: null },
  { position: 2, patient: 'James Thornton', initials: 'JT', status: 'next', wait: '~15 min' },
  { position: 3, patient: 'Nora Hassan', initials: 'NH', status: 'waiting', wait: '~30 min' },
  { position: 4, patient: 'Yusuf Saleh', initials: 'YS', status: 'waiting', wait: '~45 min' },
];

export const reviews = [
  {
    id: 1,
    patient: 'Sarah Mitchell',
    date: 'March 29, 2026',
    ratings: [
      { question: 'Did the doctor explain the diagnosis clearly?', stars: 5 },
      { question: 'Was the doctor attentive to your concerns?', stars: 5 },
      { question: 'Did the prescription help your condition?', stars: 4 },
      { question: 'Would you recommend this doctor?', stars: 5 },
    ],
    comment: 'Very professional and caring. Explained everything in detail.',
    overall: 4.75,
  },
  {
    id: 2,
    patient: 'James Thornton',
    date: 'March 15, 2026',
    ratings: [
      { question: 'Did the doctor explain the diagnosis clearly?', stars: 5 },
      { question: 'Was the doctor attentive to your concerns?', stars: 4 },
      { question: 'Did the prescription help your condition?', stars: 5 },
      { question: 'Would you recommend this doctor?', stars: 5 },
    ],
    comment: 'Great experience, felt heard and understood.',
    overall: 4.75,
  },
];

export const doctors = [
  { id: 1, name: 'Dr. Ahmed Khalil', specialty: 'Cardiologist', patients: 124, rating: 4.8, status: 'active', initials: 'AK', color: '#E1F5EE', textColor: '#0F6E56' },
  { id: 2, name: 'Dr. Layla Nasser', specialty: 'Neurologist', patients: 98, rating: 4.9, status: 'active', initials: 'LN', color: '#E6F1FB', textColor: '#185FA5' },
  { id: 3, name: 'Dr. Omar Farouk', specialty: 'Orthopedist', patients: 76, rating: 4.6, status: 'active', initials: 'OF', color: '#FAEEDA', textColor: '#854F0B' },
  { id: 4, name: 'Dr. Mona Saad', specialty: 'Endocrinologist', patients: 112, rating: 4.7, status: 'on-leave', initials: 'MS', color: '#FBEAF0', textColor: '#993556' },
];
