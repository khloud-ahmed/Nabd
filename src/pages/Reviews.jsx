import React, { useState } from 'react';
import { reviews } from '../data/mockData';

function Stars({ count, size = 14 }) {
  return (
    <span style={{ color: '#EF9F27', fontSize: size }}>
      {[1,2,3,4,5].map(i => i <= count ? '★' : '☆').join('')}
    </span>
  );
}

export default function Reviews() {
  const [selected, setSelected] = useState(null);
  const avgOverall = (reviews.reduce((sum, r) => sum + r.overall, 0) / reviews.length).toFixed(1);

  const distribution = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.overall) === star).length,
  }));

  return (
    <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 18 }}>
      {/* Left: summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '22px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: '#1DB68A', lineHeight: 1 }}>{avgOverall}</div>
          <Stars count={Math.round(avgOverall)} size={20} />
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>Based on {reviews.length} reviews</div>

          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {distribution.map(d => (
              <div key={d.star} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ color: '#aaa', width: 12, textAlign: 'right' }}>{d.star}</span>
                <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(d.count / reviews.length) * 100}%`, height: '100%', background: '#1DB68A', borderRadius: 4 }} />
                </div>
                <span style={{ color: '#aaa', width: 12 }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Category Scores</div>
          {[
            { label: 'Communication', score: 4.9 },
            { label: 'Attentiveness', score: 4.8 },
            { label: 'Prescription Quality', score: 4.6 },
            { label: 'Would Recommend', score: 5.0 },
          ].map(c => (
            <div key={c.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#888' }}>{c.label}</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{c.score}</span>
              </div>
              <div style={{ height: 4, background: '#f0f0f0', borderRadius: 4, marginTop: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(c.score / 5) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #1DB68A, #0D9E75)', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: reviews list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {reviews.map(r => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8f5f0', padding: '18px 22px', cursor: 'pointer' }} onClick={() => setSelected(selected === r.id ? null : r.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E0F7F0', color: '#0A8060', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{r.patient.split(' ').map(x=>x[0]).join('')}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.patient}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{r.date}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Stars count={Math.round(r.overall)} size={15} />
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{r.overall.toFixed(1)} / 5</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: '#555', fontStyle: 'italic', borderLeft: '3px solid #E0F7F0', paddingLeft: 12 }}>"{r.comment}"</div>

            {selected === r.id && (
              <div style={{ marginTop: 14, borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
                {r.ratings.map((q, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < r.ratings.length - 1 ? '1px solid #f8f8f8' : 'none' }}>
                    <span style={{ fontSize: 12, color: '#888', flex: 1 }}>{q.question}</span>
                    <Stars count={q.stars} size={13} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
