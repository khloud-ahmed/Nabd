import React from 'react';
import { useApp } from '../context/AppContext';

const navItems = {
  doctor: [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'health-pulse', label: 'Health Pulse', icon: '♡' },
    { id: 'queue', label: 'Waiting Room', icon: '⏱' },
    { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
    { id: 'reviews', label: 'Reviews', icon: '★' },
  ],
  patient: [
    { id: 'dashboard', label: 'My Dashboard', icon: '◈' },
    { id: 'book', label: 'Book Appointment', icon: '📅' },
    { id: 'health-pulse', label: 'Health Pulse', icon: '♡' },
    { id: 'queue', label: 'My Queue', icon: '⏱' },
    { id: 'prescriptions', label: 'My Prescriptions', icon: '💊' },
    { id: 'follow-up', label: 'Follow-up', icon: '🔔' },
  ],
  admin: [
    { id: 'dashboard', label: 'Overview', icon: '◈' },
    { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'reports', label: 'Reports', icon: '📊' },
  ],
};

const roleInfo = {
  doctor: { name: 'Dr. Ahmed Khalil', subtitle: 'Cardiologist', initials: 'AK' },
  patient: { name: 'Sarah Mitchell', subtitle: 'Patient', initials: 'SM' },
  admin: { name: 'Admin Panel', subtitle: 'System Manager', initials: 'AD' },
};

export default function Sidebar() {
  const { currentRole, setCurrentRole, currentPage, navigate } = useApp();
  const items = navItems[currentRole];
  const info = roleInfo[currentRole];

  return (
    <aside style={{
      width: 220,
      background: '#fff',
      borderRight: '1px solid #e8f5f0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid #e8f5f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1DB68A, #0D9E75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#fff', fontWeight: 700, fontFamily: 'Georgia, serif',
          }}>N</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0D9E75', letterSpacing: -0.5, fontFamily: "'DM Serif Display', Georgia, serif" }}>Nabd</div>
            <div style={{ fontSize: 10, color: '#9FD5C0', letterSpacing: 1.5, textTransform: 'uppercase' }}>Clinic</div>
          </div>
        </div>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '12px 12px 0' }}>
        <div style={{ fontSize: 10, color: '#aaa', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 4 }}>View as</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['doctor', 'patient', 'admin'].map(role => (
            <button key={role} onClick={() => { setCurrentRole(role); navigate('dashboard'); }} style={{
              flex: 1, padding: '5px 2px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 10,
              fontWeight: currentRole === role ? 600 : 400,
              background: currentRole === role ? '#E0F7F0' : 'transparent',
              color: currentRole === role ? '#0D9E75' : '#888',
              textTransform: 'capitalize',
            }}>{role}</button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
        {items.map(item => (
          <button key={item.id} onClick={() => navigate(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '9px 12px', borderRadius: 10, border: 'none',
            cursor: 'pointer', fontSize: 13, textAlign: 'left', marginBottom: 2,
            background: currentPage === item.id ? '#E0F7F0' : 'transparent',
            color: currentPage === item.id ? '#0A8060' : '#666',
            fontWeight: currentPage === item.id ? 600 : 400,
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User info */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid #e8f5f0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1DB68A, #0D9E75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>{info.initials}</div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info.name}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>{info.subtitle}</div>
        </div>
      </div>
    </aside>
  );
}
