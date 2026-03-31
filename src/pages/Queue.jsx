import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { queue } from '../data/mockData';

export default function Queue() {
  const { currentRole } = useApp();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Queue list */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '20px 22px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            {currentRole === 'doctor' ? 'Patient Queue' : 'Virtual Waiting Room'}
          </div>

          {queue.map((q, i) => {
            const isFirst = q.position === 1;
            const isNext = q.position === 2;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 14px', borderRadius: 12, marginBottom: 8,
                background: isFirst ? '#E0F7F0' : isNext ? '#f6fdf9' : '#fafafa',
                border: isFirst ? '1.5px solid #5DCAA5' : '1px solid #f0f0f0',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: isFirst ? '#0D9E75' : '#e0e0e0',
                  color: isFirst ? '#fff' : '#888',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                }}>{q.position}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isFirst ? '#0A8060' : '#1a1a1a' }}>{q.patient}</div>
                  <div style={{ fontSize: 12, color: isFirst ? '#1DB68A' : '#aaa', marginTop: 2 }}>
                    {q.status === 'in-room' ? 'Currently with doctor' : q.wait}
                  </div>
                </div>

                <span style={{
                  fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 500,
                  background: q.status === 'in-room' ? '#1DB68A' : q.status === 'next' ? '#FFF8E6' : '#E6F1FB',
                  color: q.status === 'in-room' ? '#fff' : q.status === 'next' ? '#8A6000' : '#185FA5',
                }}>
                  {q.status === 'in-room' ? 'In Room' : q.status === 'next' ? 'Next' : 'Waiting'}
                </span>

                {currentRole === 'doctor' && (
                  <button style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: 'none', background: '#E0F7F0', color: '#0A8060', cursor: 'pointer', fontWeight: 500 }}>Call In</button>
                )}
              </div>
            );
          })}
        </div>

        {/* My status (patient) or Stats (doctor) */}
        {currentRole === 'patient' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', borderRadius: 16, padding: '28px 24px', color: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>Your queue position</div>
              <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>2</div>
              <div style={{ fontSize: 14, opacity: 0.85, marginTop: 8 }}>1 patient ahead of you</div>
              <div style={{ marginTop: 16, padding: '10px 20px', background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'inline-block' }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Estimated wait</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>~15 min</div>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '18px 22px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#aaa', marginBottom: 6 }}>You'll be notified when it's your turn</div>
              <div style={{ fontSize: 12, color: '#bbb', lineHeight: 1.6 }}>Feel free to wait outside. We'll send you a notification 5 minutes before you're called in.</div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button style={{ padding: '8px 18px', borderRadius: 20, border: '1px solid #e8f5f0', background: '#fff', fontSize: 13, cursor: 'pointer' }}>Leave & Get Notified</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '20px 22px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Queue Stats</div>
              {[
                { label: 'Currently in room', value: 'Sarah Mitchell', sub: 'since 9:00 AM' },
                { label: 'Avg. consultation time', value: '14 min', sub: 'today\'s average' },
                { label: 'Remaining patients', value: '4', sub: 'until 12:00 PM' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none' }}>
                  <div style={{ fontSize: 12, color: '#aaa' }}>{s.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#bbb' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <button style={{
              padding: '14px', borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Call Next Patient ›</button>
          </div>
        )}
      </div>
    </div>
  );
}
