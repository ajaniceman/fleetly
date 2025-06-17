import React from 'react';
import './Features.css'; // Make sure this CSS file exists and is linked
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Example Feature Data (Using translation keys now)
const featureData = [
  {
    id: 1,
    icon: '📊',
    titleKey: 'feature_dashboard_title',
    descriptionKey: 'feature_dashboard_description',
  },
  {
    id: 2,
    icon: '🗺️',
    titleKey: 'feature_tracking_title',
    descriptionKey: 'feature_tracking_description',
  },
  {
    id: 3,
    icon: '🛠️',
    titleKey: 'feature_maintenance_title',
    descriptionKey: 'feature_maintenance_description',
  },
  {
    id: 4,
    icon: '🗓️',
    titleKey: 'feature_date_reminders_title',
    descriptionKey: 'feature_date_reminders_description',
  },
  {
    id: 5,
    icon: '📉',
    titleKey: 'feature_cost_optimization_title',
    descriptionKey: 'feature_cost_optimization_description',
  },
  {
    id: 6,
    icon: '📱',
    titleKey: 'feature_mobile_accessibility_title',
    descriptionKey: 'feature_mobile_accessibility_description',
  },
];

export default function Features() {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <div className="features-grid">
      {featureData.map(feature => (
        <div key={feature.id} className="feature-card">
          <div className="feature-icon">{feature.icon}</div>
          <h3>{t(feature.titleKey)}</h3> {/* Use translation for title */}
          <p>{t(feature.descriptionKey)}</p> {/* Use translation for description */}
        </div>
      ))}
    </div>
  );
}
