import React, { useState } from 'react';
import { appointments } from '../data/mockData';

const statusColor = {
  'in-progress': { bg: '#E0F7F0', text: '#0A8060', label: 'In Room' },
  upcoming: { bg: '#FFF8E6', text: '#8A6000', label: 'Upcoming' },
  waiting: { bg: '#E6F1FB', text: '#185FA5', label: 'Waiting' },
  scheduled: { bg: '#F5F5F5', text: '#666', label: 'Scheduled' },
  completed: { bg: '#F0F0F0', text: '#888', label: 'Completed' },
};

export default function Appointments() {
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'in-progress', 'upcoming', 'waiting'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 20, border: '1px solid',
              borderColor: filter === f ? '#1DB68A' : '#e8f5f0',
              background: filter === f ? '#1DB68A' : '#fff',
              color: filter === f ? '#fff' : '#888',
              fontSize: 13, cursor: 'pointer', fontWeight: filter === f ? 600 : 400,
              textTransform: 'capitalize',
            }}>{f === 'all' ? 'All' : f.replace('-', ' ')}</button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} style={{
          padding: '8px 18px', borderRadius: 20, border: 'none',
          background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>+ New Appointment</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 120px 160px 120px 120px', gap: 16, padding: '12px 20px', borderBottom: '1px solid #f5f5f5', background: '#fafdfb' }}>
          {['', 'Patient', 'Time', 'Reason', 'Status', 'Action'].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</div>
          ))}
        </div>
        {filtered.map(apt => {
          const sc = statusColor[apt.status] || statusColor.scheduled;
          return (
            <div key={apt.id} style={{
              display: 'grid', gridTemplateColumns: '36px 1fr 120px 160px 120px 120px',
              gap: 16, padding: '14px 20px', borderBottom: '1px solid #f5f5f5',
              alignItems: 'center', transition: 'background 0.1s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafdfb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: apt.color, color: apt.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{apt.initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{apt.patient}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>Patient ID: #APT{apt.id.toString().padStart(4, '0')}</div>
              </div>
              <div style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{apt.time}</div>
              <div style={{ fontSize: 13, color: '#777' }}>{apt.type}</div>
              <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: sc.bg, color: sc.text, fontWeight: 500, display: 'inline-block' }}>{sc.label}</span>
              <button style={{ fontSize: 12, color: '#1DB68A', background: '#E0F7F0', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontWeight: 500 }}>View</button>
            </div>
          );
        })}
      </div>

      {/* Simple modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>New Appointment</div>
            {[{ label: 'Patient Name', placeholder: 'Enter full name' }, { label: 'Date', placeholder: 'YYYY-MM-DD' }, { label: 'Time', placeholder: 'e.g. 10:00 AM' }, { label: 'Reason', placeholder: 'Visit type or complaint' }].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input placeholder={f.placeholder} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e8f5f0', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 10, border: 'none', borderRadius: 10, background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
