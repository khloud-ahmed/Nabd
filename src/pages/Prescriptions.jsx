import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { prescriptions } from '../data/mockData';

export default function Prescriptions() {
  const { currentRole } = useApp();
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [drugs, setDrugs] = useState([{ name: '', dosage: '', duration: '', reminder: '' }]);

  const filtered = filter === 'all' ? prescriptions : prescriptions.filter(p => p.status === filter);

  const addDrug = () => setDrugs(d => [...d, { name: '', dosage: '', duration: '', reminder: '' }]);

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'active', 'expired'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 20, border: '1px solid',
              borderColor: filter === f ? '#1DB68A' : '#e8f5f0',
              background: filter === f ? '#1DB68A' : '#fff',
              color: filter === f ? '#fff' : '#888', fontSize: 13, cursor: 'pointer',
              fontWeight: filter === f ? 600 : 400, textTransform: 'capitalize',
            }}>{f}</button>
          ))}
        </div>
        {currentRole === 'doctor' && (
          <button onClick={() => setShowNew(true)} style={{
            padding: '8px 18px', borderRadius: 20, border: 'none',
            background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>+ Write Prescription</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(rx => (
          <div key={rx.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{rx.patient}</div>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{rx.date}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{
                  fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 600,
                  background: rx.status === 'active' ? '#E0F7F0' : '#F5F5F5',
                  color: rx.status === 'active' ? '#0A8060' : '#999',
                }}>{rx.status}</span>
                <button style={{ fontSize: 12, color: '#1DB68A', background: 'none', border: '1px solid #e8f5f0', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>Print</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rx.drugs.map((drug, i) => (
                <div key={i} style={{ background: '#f8fdfa', borderRadius: 12, padding: '12px 16px', border: '1px solid #e8f5f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>💊 {drug.name}</div>
                    {rx.status === 'active' && drug.reminder && (
                      <span style={{ fontSize: 11, background: '#E6F1FB', color: '#185FA5', padding: '3px 10px', borderRadius: 20 }}>🔔 {drug.reminder}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#777', marginTop: 5 }}>{drug.dosage}</div>
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>Duration: {drug.duration}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* New prescription modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowNew(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 500, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 18 }}>New Prescription</div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 5 }}>Patient</label>
              <input placeholder="Patient name" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8f5f0', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {drugs.map((d, i) => (
              <div key={i} style={{ background: '#f8fdfa', borderRadius: 12, padding: 14, marginBottom: 12, border: '1px solid #e8f5f0' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0A8060', marginBottom: 10 }}>Drug #{i + 1}</div>
                {[
                  { label: 'Drug name & dosage', placeholder: 'e.g. Amlodipine 5mg' },
                  { label: 'Instructions', placeholder: 'e.g. 1 tablet daily after food' },
                  { label: 'Duration', placeholder: 'e.g. 30 days' },
                  { label: 'Reminder time', placeholder: 'e.g. 9:00 AM' },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4 }}>{f.label}</label>
                    <input placeholder={f.placeholder} style={{ width: '100%', padding: '7px 10px', border: '1px solid #e0ece8', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#fff' }} />
                  </div>
                ))}
              </div>
            ))}

            <button onClick={addDrug} style={{ width: '100%', padding: '9px', border: '1px dashed #1DB68A', borderRadius: 10, background: 'transparent', color: '#1DB68A', fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>+ Add Another Drug</button>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: 10, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Issue Prescription</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
