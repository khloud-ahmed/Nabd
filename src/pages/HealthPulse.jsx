import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const metrics = [
  { key: 'bp', label: 'Blood Pressure', unit: 'mmHg', placeholder: '120/80', icon: '🫀', normal: '< 120/80', color: '#E24B4A' },
  { key: 'temp', label: 'Temperature', unit: '°C', placeholder: '37.0', icon: '🌡', normal: '36.1 – 37.2°C', color: '#1DB68A' },
  { key: 'pulse', label: 'Heart Rate', unit: 'bpm', placeholder: '75', icon: '♡', normal: '60 – 100 bpm', color: '#185FA5' },
  { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '70', icon: '⚖', normal: 'BMI reference', color: '#BA7517' },
  { key: 'sugar', label: 'Blood Sugar', unit: 'mg/dL', placeholder: '90', icon: '💉', normal: '70 – 100 mg/dL', color: '#534AB7' },
  { key: 'oxygen', label: 'Oxygen Saturation', unit: '%', placeholder: '98', icon: '🫁', normal: '95 – 100%', color: '#1DB68A' },
];

export default function HealthPulse() {
  const { currentRole } = useApp();
  const [form, setForm] = useState({});
  const [symptoms, setSymptoms] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  if (submitted) {
    return (
      <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#E0F7F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 20 }}>✓</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0A8060', marginBottom: 8 }}>Health data submitted!</div>
        <div style={{ fontSize: 14, color: '#aaa', marginBottom: 24, textAlign: 'center' }}>Your doctor can now review your vitals before your appointment.</div>
        <button onClick={() => setSubmitted(false)} style={{ padding: '10px 24px', borderRadius: 20, border: 'none', background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Submit Again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 24px' }}>
      {currentRole === 'doctor' ? (
        // Doctor view: see patient's submitted data
        <div>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>Viewing pre-visit data submitted by <strong style={{ color: '#1a1a1a' }}>Sarah Mitchell</strong> · 08:45 AM</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 18 }}>
            {[
              { label: 'Blood Pressure', value: '130/85', status: 'High', color: '#E24B4A', bg: '#FCEBEB' },
              { label: 'Temperature', value: '37.2°C', status: 'Normal', color: '#0A8060', bg: '#E0F7F0' },
              { label: 'Heart Rate', value: '78 bpm', status: 'Normal', color: '#0A8060', bg: '#E0F7F0' },
              { label: 'Weight', value: '72 kg', status: 'Normal', color: '#0A8060', bg: '#E0F7F0' },
              { label: 'Blood Sugar', value: '95 mg/dL', status: 'Normal', color: '#0A8060', bg: '#E0F7F0' },
              { label: 'Oxygen Sat.', value: '98%', status: 'Normal', color: '#0A8060', bg: '#E0F7F0' },
            ].map((m, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8f5f0', padding: '16px 18px' }}>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{m.value}</div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: m.bg, color: m.color, fontWeight: 600 }}>{m.status}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#FFF8E6', borderRadius: 14, padding: '14px 18px', border: '1px solid #FAEEDA' }}>
            <div style={{ fontSize: 12, color: '#8A6000', marginBottom: 4, fontWeight: 600 }}>⚠ Reported Symptoms</div>
            <div style={{ fontSize: 14, color: '#555' }}>Mild headache, slight dizziness in the morning. No chest pain.</div>
          </div>
        </div>
      ) : (
        // Patient view: fill in form
        <div style={{ maxWidth: 560 }}>
          <div style={{ background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', borderRadius: 16, padding: '18px 22px', marginBottom: 22, color: '#fff' }}>
            <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 4 }}>♡ Health Pulse</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Enter your vitals before your visit</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>Your doctor will review this data before your appointment</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {metrics.map(m => (
              <div key={m.key} style={{ background: '#fff', border: '1px solid #e8f5f0', borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: '#bbb' }}>Normal: {m.normal}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="text"
                    placeholder={m.placeholder}
                    value={form[m.key] || ''}
                    onChange={e => handleChange(m.key, e.target.value)}
                    style={{
                      flex: 1, padding: '8px 10px', border: '1px solid #e8f5f0', borderRadius: 8,
                      fontSize: 14, outline: 'none', fontWeight: 500,
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>{m.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e8f5f0', borderRadius: 14, padding: '14px 16px', marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 8 }}>Current symptoms or concerns</label>
            <textarea
              placeholder="Describe any pain, discomfort, or symptoms you're experiencing..."
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              rows={3}
              style={{ width: '100%', border: '1px solid #e8f5f0', borderRadius: 8, padding: '8px 10px', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <button onClick={() => setSubmitted(true)} style={{
            width: '100%', padding: 14, borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>Send to Doctor ♡</button>
        </div>
      )}
    </div>
  );
}
