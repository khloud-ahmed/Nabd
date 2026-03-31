import React, { useState } from 'react';

const followUps = [
  { id: 1, doctor: 'Dr. Ahmed Khalil', date: 'March 29, 2026', visit: 'Blood Pressure Check', question: 'How are you feeling after starting Amlodipine?', status: 'pending' },
  { id: 2, doctor: 'Dr. Ahmed Khalil', date: 'March 15, 2026', visit: 'Routine Checkup', question: 'Did the headaches improve after rest?', status: 'answered' },
];

export default function FollowUp() {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState({});

  return (
    <div style={{ padding: '20px 24px', maxWidth: 620 }}>
      <div style={{ background: 'linear-gradient(135deg, #E0F7F0, #c8f0e2)', borderRadius: 16, padding: '18px 22px', marginBottom: 22, border: '1px solid #a8e8cc' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0A8060', marginBottom: 4 }}>🔔 Smart Follow-up</div>
        <div style={{ fontSize: 13, color: '#1DB68A', lineHeight: 1.6 }}>Your doctor checks on you after your visit to ensure recovery. Please respond to these follow-up questions.</div>
      </div>

      {followUps.map(fu => (
        <div key={fu.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '20px 22px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{fu.doctor}</div>
              <div style={{ fontSize: 12, color: '#aaa' }}>{fu.date} · {fu.visit}</div>
            </div>
            <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: fu.status === 'pending' ? '#FFF8E6' : '#E0F7F0', color: fu.status === 'pending' ? '#8A6000' : '#0A8060', height: 'fit-content', fontWeight: 500 }}>
              {fu.status === 'pending' ? 'Awaiting response' : 'Responded'}
            </span>
          </div>

          <div style={{ fontSize: 14, color: '#333', fontWeight: 500, marginBottom: 14, padding: '12px 14px', background: '#f8fdfa', borderRadius: 10, borderLeft: '3px solid #1DB68A' }}>
            {fu.question}
          </div>

          {fu.status === 'pending' && !submitted[fu.id] ? (
            <div>
              <textarea
                placeholder="Type your response here..."
                value={responses[fu.id] || ''}
                onChange={e => setResponses(r => ({ ...r, [fu.id]: e.target.value }))}
                rows={3}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8f5f0', borderRadius: 10, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 10 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setSubmitted(s => ({ ...s, [fu.id]: true }))} style={{ padding: '9px 20px', border: 'none', borderRadius: 20, background: 'linear-gradient(135deg, #1DB68A, #0D9E75)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Send Response</button>
                <button style={{ padding: '9px 16px', border: '1px solid #e8f5f0', borderRadius: 20, background: '#fff', color: '#888', fontSize: 13, cursor: 'pointer' }}>Request Appointment</button>
              </div>
            </div>
          ) : fu.status === 'answered' ? (
            <div style={{ padding: '10px 14px', background: '#E0F7F0', borderRadius: 10, fontSize: 13, color: '#0A8060' }}>
              ✓ Feeling much better, headaches stopped after day 2.
            </div>
          ) : (
            <div style={{ padding: '10px 14px', background: '#E0F7F0', borderRadius: 10, fontSize: 13, color: '#0A8060' }}>
              ✓ Response sent! Your doctor will review it.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
