// src/components/Features.jsx
import React from 'react';
import './Features.css';

const features = [
  { icon: '🚚', title: 'Real-time Tracking', desc: 'Monitor your fleet in real time.' },
  { icon: '📊', title: 'Analytics', desc: 'Track performance with dashboards.' },
  { icon: '🗓️', title: 'Driver Logs', desc: 'Manage hours and routes.' }
];

export default function Features() {
  return (
    <section className="features">
      {features.map((f, i) => (
        <div className="feature-card" key={i}>
          <div className="icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
