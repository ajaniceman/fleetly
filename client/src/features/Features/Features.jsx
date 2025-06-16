import React from 'react';
import './Features.css'; // Make sure this CSS file exists and is linked

// Example Feature Data (Replace with your actual features if you have them)
const featureData = [
  {
    id: 1,
    icon: '📊', // Emoji for icon
    title: 'Intuitive Dashboard',
    description: 'Get a real-time overview of your entire fleet at a glance, with key metrics and insights.',
  },
  {
    id: 2,
    icon: '🗺️', // Emoji for icon
    title: 'Advanced Tracking',
    description: 'Monitor vehicle locations and routes to optimize dispatch and enhance efficiency.',
  },
  {
    id: 3,
    icon: '🛠️', // Emoji for icon
    title: 'Proactive Maintenance',
    description: 'Never miss a service with automated reminders and detailed service history logs.',
  },
  {
    id: 4,
    icon: '🗓️', // Emoji for icon
    title: 'Critical Date Reminders',
    description: 'Stay compliant with timely alerts for registrations, inspections, and license renewals.',
  },
  {
    id: 5,
    icon: '📉', // Emoji for icon
    title: 'Cost Optimization',
    description: 'Track expenses and identify areas for savings to improve your fleet’s profitability.',
  },
  {
    id: 6,
    icon: '📱', // Emoji for icon
    title: 'Mobile Accessibility',
    description: 'Manage your fleet on the go with a fully responsive and optimized mobile experience.',
  },
];

export default function Features() {
  return (
    // This div applies the grid layout defined in Features.css
    <div className="features-grid">
      {featureData.map(feature => (
        <div key={feature.id} className="feature-card">
          <div className="feature-icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
