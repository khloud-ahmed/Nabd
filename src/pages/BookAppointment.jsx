import React, { useState } from 'react';
import { doctors } from '../data/mockData';

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];
const bookedSlots = ['09:00 AM', '09:30 AM', '10:00 AM'];

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E0F7F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20 }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#0A8060', marginBottom: 8 }}>Appointment Confirmed!</div>
        <div style={{ fontSize: 14, color: '#aaa', textAlign: 'center', marginBottom: 6 }}>{selectedDoctor?.name} · {selectedDate} · {selectedTime}</div>
        <div style={{ fontSize: 13, color: '#bbb', marginBottom: 28 }}>You'll receive a reminder before your visit.</div>
        <button onClick={() => { setDone(false); setStep(1); setSelectedDoctor(null); setSelectedTime(''); }} style={{ padding: '10px 24px', borderRadius: 20, border: 'none', background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Book Another</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 24px', maxWidth: 680 }}>
      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {['Choose Doctor', 'Pick Time', 'Confirm'].map((s, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: i < 2 ? 'none' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: active ? '#1DB68A' : done ? '#E0F7F0' : '#f0f0f0', color: active ? '#fff' : done ? '#0A8060' : '#aaa' }}>{done ? '✓' : num}</div>
                <span style={{ fontSize: 13, color: active ? '#1a1a1a' : '#aaa', fontWeight: active ? 600 : 400 }}>{s}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > num ? '#1DB68A' : '#e8f5f0', margin: '0 12px' }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Choose doctor */}
      {step === 1 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Select a Doctor</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {doctors.map(d => (
              <div key={d.id} onClick={() => d.status === 'active' && setSelectedDoctor(d)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                background: '#fff', borderRadius: 14,
                border: selectedDoctor?.id === d.id ? '2px solid #1DB68A' : '1px solid #e8f5f0',
                cursor: d.status === 'active' ? 'pointer' : 'not-allowed',
                opacity: d.status === 'active' ? 1 : 0.5,
                transition: 'all 0.15s',
              }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: d.color, color: d.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{d.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{d.specialty}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: '#EF9F27', fontWeight: 600 }}>★ {d.rating}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{d.patients} patients</div>
                </div>
                {d.status === 'on-leave' && <span style={{ fontSize: 11, padding: '3px 8px', background: '#FCEBEB', color: '#A32D2D', borderRadius: 8 }}>On Leave</span>}
              </div>
            ))}
          </div>
          <button onClick={() => selectedDoctor && setStep(2)} style={{ marginTop: 20, padding: '12px 28px', borderRadius: 20, border: 'none', background: selectedDoctor ? 'linear-gradient(135deg, #1DB68A, #0D9E75)' : '#e0e0e0', color: '#fff', fontSize: 14, fontWeight: 600, cursor: selectedDoctor ? 'pointer' : 'not-allowed' }}>Continue →</button>
        </div>
      )}

      {/* Step 2: Pick time */}
      {step === 2 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Choose Date & Time</div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>Select Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min="2026-03-29" style={{ padding: '9px 14px', border: '1px solid #e8f5f0', borderRadius: 10, fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 10, display: 'block' }}>Available time slots</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {timeSlots.map(t => {
                const isBooked = bookedSlots.includes(t);
                const isSelected = selectedTime === t;
                return (
                  <button key={t} onClick={() => !isBooked && setSelectedTime(t)} style={{
                    padding: '10px 6px', borderRadius: 10, border: '1px solid',
                    borderColor: isSelected ? '#1DB68A' : isBooked ? '#f0f0f0' : '#e8f5f0',
                    background: isSelected ? '#1DB68A' : isBooked ? '#fafafa' : '#fff',
                    color: isSelected ? '#fff' : isBooked ? '#ccc' : '#555',
                    fontSize: 13, cursor: isBooked ? 'not-allowed' : 'pointer',
                    textDecoration: isBooked ? 'line-through' : 'none',
                  }}>{t}</button>
                );
              })}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 6 }}>Reason for visit</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Briefly describe your symptoms or reason..." rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8f5f0', borderRadius: 10, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 13 }}>← Back</button>
            <button onClick={() => selectedTime && selectedDate && setStep(3)} style={{ padding: '10px 24px', border: 'none', borderRadius: 20, background: selectedTime && selectedDate ? 'linear-gradient(135deg, #1DB68A, #0D9E75)' : '#e0e0e0', color: '#fff', fontSize: 14, fontWeight: 600, cursor: selectedTime && selectedDate ? 'pointer' : 'not-allowed' }}>Continue →</button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Confirm Appointment</div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '22px 24px', marginBottom: 18 }}>
            {[
              { label: 'Doctor', value: selectedDoctor?.name },
              { label: 'Specialty', value: selectedDoctor?.specialty },
              { label: 'Date', value: selectedDate },
              { label: 'Time', value: selectedTime },
              { label: 'Reason', value: reason || '—' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: 13, color: '#aaa' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 20 }}>You'll receive an email confirmation and a reminder before your appointment.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(2)} style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: 20, background: '#fff', cursor: 'pointer', fontSize: 13 }}>← Back</button>
            <button onClick={() => setDone(true)} style={{ padding: '10px 28px', border: 'none', borderRadius: 20, background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Confirm Booking ✓</button>
          </div>
        </div>
      )}
    </div>
  );
}
