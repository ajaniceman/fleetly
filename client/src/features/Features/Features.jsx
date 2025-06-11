// src/components/Features.jsx
import React from 'react';
import './Features.css';

const features = [
  {
    icon: "🔧",  // Or use a wrench icon from React Icons
    title: "Service History",
    desc: "Log past services and view maintenance records."
  },
  {
    icon: "📅",
    title: "Registration Tracker",
    desc: "Get alerts for upcoming vehicle registration renewals."
  },
  {
    icon: "⏰",
    title: "Maintenance Reminders",
    desc: "Schedule oil changes, tire rotations, and more."
  },
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
