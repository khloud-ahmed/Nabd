import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const pageTitles = {
  dashboard: 'Dashboard',
  appointments: 'Appointments',
  'health-pulse': 'Health Pulse',
  queue: 'Virtual Waiting Room',
  prescriptions: 'Prescriptions',
  reviews: 'Reviews',
  book: 'Book Appointment',
  'follow-up': 'Follow-up',
  doctors: 'Manage Doctors',
  reports: 'Reports',
};

export default function TopBar() {
  const { currentPage, notifications, setNotifications } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header style={{
      height: 62,
      background: '#fff',
      borderBottom: '1px solid #e8f5f0',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div>
        <h1 style={{ fontSize: 17, fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
          {pageTitles[currentPage] || 'Dashboard'}
        </h1>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>
          Sunday, March 29, 2026
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#f6fdf9', border: '1px solid #e0f5ec',
          borderRadius: 20, padding: '6px 14px', width: 200,
        }}>
          <span style={{ color: '#aaa', fontSize: 13 }}>🔍</span>
          <input placeholder="Search..." style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: 13, color: '#333', width: '100%',
          }} />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowNotifs(!showNotifs); setNotifications(0); }} style={{
            width: 36, height: 36, borderRadius: 10, border: '1px solid #e0f5ec',
            background: '#f6fdf9', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 16, position: 'relative',
          }}>
            🔔
            {notifications > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4, width: 16, height: 16,
                background: '#E24B4A', borderRadius: '50%', color: '#fff',
                fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
              }}>{notifications}</span>
            )}
          </button>
          {showNotifs && (
            <div style={{
              position: 'absolute', right: 0, top: 44, width: 280,
              background: '#fff', border: '1px solid #e0f5ec', borderRadius: 14,
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)', zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 13, fontWeight: 600 }}>Notifications</div>
              {[
                { msg: "Sarah Mitchell submitted Health Pulse", time: "8 min ago", icon: '♡' },
                { msg: "James Thornton booked for 9:30 AM", time: "22 min ago", icon: '📅' },
                { msg: "New review received — 5 stars ★", time: "1 hr ago", icon: '★' },
              ].map((n, i) => (
                <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid #f8f8f8', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16 }}>{n.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, color: '#333' }}>{n.msg}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
