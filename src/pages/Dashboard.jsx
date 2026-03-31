import React from 'react';
import { useApp } from '../context/AppContext';
import { appointments, healthPulse } from '../data/mockData';

const statusColor = {
  'in-progress': { bg: '#E0F7F0', text: '#0A8060', label: 'In Room' },
  upcoming: { bg: '#FFF8E6', text: '#8A6000', label: 'Upcoming' },
  waiting: { bg: '#E6F1FB', text: '#185FA5', label: 'Waiting' },
  scheduled: { bg: '#F5F5F5', text: '#666', label: 'Scheduled' },
};

const pulseMetrics = [
  { label: 'Blood Pressure', value: '130/85', status: 'high', fill: 78 },
  { label: 'Temperature', value: '37.2°C', status: 'normal', fill: 55 },
  { label: 'Heart Rate', value: '78 bpm', status: 'normal', fill: 68 },
  { label: 'Weight', value: '72 kg', status: 'normal', fill: 62 },
];

const fillColor = { high: '#E24B4A', normal: '#1DB68A', warning: '#EF9F27' };

function StatCard({ label, value, sub, subColor }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e8f5f0', borderRadius: 14,
      padding: '16px 18px', flex: 1,
    }}>
      <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: subColor || '#aaa', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function DoctorDashboard() {
  const { navigate } = useApp();
  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 14 }}>
        <StatCard label="Today's Appointments" value="12" sub="↑ 2 from yesterday" subColor="#1DB68A" />
        <StatCard label="In Queue Now" value="4" sub="patients waiting" />
        <StatCard label="Prescriptions" value="8" sub="issued today" />
        <StatCard label="My Rating" value="4.8" sub="★ from 47 reviews" subColor="#EF9F27" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Upcoming appointments */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Today's Appointments</div>
            <button onClick={() => navigate('appointments')} style={{ fontSize: 12, color: '#1DB68A', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>View all →</button>
          </div>
          {appointments.slice(0, 4).map(apt => {
            const sc = statusColor[apt.status];
            return (
              <div key={apt.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: apt.color, color: apt.textColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, flexShrink: 0,
                }}>{apt.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{apt.patient}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{apt.time} · {apt.type}</div>
                </div>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: sc.bg, color: sc.text, fontWeight: 500 }}>{sc.label}</span>
              </div>
            );
          })}
        </div>

        {/* Health Pulse card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Health Pulse</div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#E0F7F0', color: '#0A8060' }}>Pre-visit data</span>
          </div>
          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 14 }}>Sarah Mitchell · submitted 08:45 AM</div>

          {pulseMetrics.map((m, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#888' }}>{m.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: m.status === 'high' ? '#E24B4A' : '#1a1a1a' }}>{m.value}</span>
              </div>
              <div style={{ height: 5, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${m.fill}%`, height: '100%', background: fillColor[m.status], borderRadius: 4, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: '8px 12px', background: '#FFF8E6', borderRadius: 10, fontSize: 12, color: '#8A6000' }}>
            ⚠ Symptoms: {healthPulse.symptoms}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'View Waiting Room', icon: '⏱', page: 'queue', color: '#E6F1FB', text: '#185FA5' },
          { label: 'Write Prescription', icon: '💊', page: 'prescriptions', color: '#E0F7F0', text: '#0A8060' },
          { label: 'See Reviews', icon: '★', page: 'reviews', color: '#FAEEDA', text: '#854F0B' },
        ].map(a => (
          <button key={a.label} onClick={() => navigate(a.page)} style={{
            flex: 1, padding: '14px 16px', borderRadius: 14, border: `1px solid ${a.color}`,
            background: a.color, color: a.text, cursor: 'pointer', fontSize: 13,
            fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 18 }}>{a.icon}</span> {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PatientDashboard() {
  const { navigate } = useApp();
  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1DB68A 0%, #0D9E75 100%)',
        borderRadius: 20, padding: '24px 28px', color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: 20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Good morning,</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Sarah Mitchell</div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>Your next appointment is today at 9:00 AM with Dr. Ahmed Khalil</div>
        <button onClick={() => navigate('book')} style={{
          marginTop: 14, padding: '8px 18px', borderRadius: 20, border: '2px solid rgba(255,255,255,0.5)',
          background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>Book New Appointment</button>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        <StatCard label="My Appointments" value="3" sub="this month" />
        <StatCard label="Queue Position" value="#2" sub="~15 min wait" subColor="#1DB68A" />
        <StatCard label="Active Prescriptions" value="2" sub="with reminders" />
        <StatCard label="Follow-ups" value="1" sub="due this week" subColor="#EF9F27" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '18px 20px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>My Prescriptions</div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Amlodipine 5mg</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 3 }}>1 tablet daily · 30 days</div>
            <div style={{ fontSize: 12, color: '#185FA5', marginTop: 3 }}>🔔 Reminder: 9:00 AM</div>
          </div>
          <div style={{ padding: '12px 0' }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Omeprazole 20mg</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 3 }}>1 capsule before meals · 14 days</div>
            <div style={{ fontSize: 12, color: '#185FA5', marginTop: 3 }}>🔔 Reminder: 8AM & 8PM</div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '18px 20px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Submit Health Data</div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.5 }}>Share your vitals before your visit so your doctor can prepare.</div>
          <button onClick={() => navigate('health-pulse')} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Open Health Pulse ♡</button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 14 }}>
        <StatCard label="Total Doctors" value="4" sub="3 active, 1 on leave" />
        <StatCard label="Today's Total Appts" value="38" sub="across all doctors" />
        <StatCard label="Active Patients" value="312" sub="registered this month" />
        <StatCard label="Avg Rating" value="4.75" sub="★ clinic average" subColor="#EF9F27" />
      </div>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '18px 20px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Doctors Overview</div>
        {[
          { name: 'Dr. Ahmed Khalil', spec: 'Cardiologist', appts: 12, rating: 4.8, status: 'active', initials: 'AK' },
          { name: 'Dr. Layla Nasser', spec: 'Neurologist', appts: 9, rating: 4.9, status: 'active', initials: 'LN' },
          { name: 'Dr. Omar Farouk', spec: 'Orthopedist', appts: 8, rating: 4.6, status: 'active', initials: 'OF' },
          { name: 'Dr. Mona Saad', spec: 'Endocrinologist', appts: 0, rating: 4.7, status: 'on-leave', initials: 'MS' },
        ].map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E0F7F0', color: '#0A8060', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{d.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: '#aaa' }}>{d.spec}</div>
            </div>
            <div style={{ fontSize: 13, color: '#888' }}>{d.appts} appts</div>
            <div style={{ fontSize: 13, color: '#EF9F27', fontWeight: 600 }}>★ {d.rating}</div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: d.status === 'active' ? '#E0F7F0' : '#FFF0F0', color: d.status === 'active' ? '#0A8060' : '#A32D2D' }}>{d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { currentRole } = useApp();
  if (currentRole === 'patient') return <PatientDashboard />;
  if (currentRole === 'admin') return <AdminDashboard />;
  return <DoctorDashboard />;
}
