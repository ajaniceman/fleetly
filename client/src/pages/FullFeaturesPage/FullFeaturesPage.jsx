import React from 'react';
import Features from '../../features/Features/Features'; // Import the reusable Features component
import './FullFeaturesPage.css'; // Import the CSS for this new page
import { useTranslation } from 'react-i18next';

export default function FullFeaturesPage() {
  const { t } = useTranslation();

  return (
    <div className="full-features-page-container">
      <div className="full-features-header">
        <h1>{t('full_features_page_title')}</h1>
        <p>{t('full_features_page_subtitle')}</p>
      </div>
      <Features /> {/* Reuse your existing Features component here */}
    </div>
  );
}
