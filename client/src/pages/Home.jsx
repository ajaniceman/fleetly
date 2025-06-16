import React from 'react';
import { Link } from 'react-router-dom';
import Features from '../features/Features/Features';
import Testimonials from '../features/Testimonials/Testimonials';
import './Home.css';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function Home() {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-gradient"></div> {/* For a subtle background effect */}
        <div className="hero-content container">
          <div className="pre-title animate-fade-in-up-delay-1">{t('fleetly_slogan_pre_title')}</div>
          <h1 className="hero-title animate-fade-in-up-delay-2">
            {t('fleetly_title_part1')} <span className="highlight">{t('fleetly_title_highlight')}</span> {t('fleetly_title_part2')}
          </h1>
          <p className="subtitle animate-fade-in-up-delay-3">
            {t('fleetly_subtitle')}
          </p>
          <div className="cta-buttons animate-fade-in-up-delay-4">
            <Link to="/register" className="btn primary-cta">{t('get_started_free_btn')}</Link>
            <Link to="/login" className="btn secondary-cta">{t('login_to_dashboard_btn')}</Link>
          </div>
          <div className="stats-grid animate-fade-in-up-delay-5">
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">{t('compliance_success_stat')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">40%</span>
              <span className="stat-label">{t('maintenance_savings_stat')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">{t('accessible_anytime_stat')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Fleetly? (Features) */}
      <section className="features-preview section-padding bg-light">
        <div className="container">
          <h2 className="section-title">{t('unlock_efficiency_title')}</h2>
          <p className="section-subtitle">
            {t('unlock_efficiency_subtitle')}
          </p>
          <Features /> {/* Your existing Features component */}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section section-padding">
        <div className="container">
          <h2 className="section-title">{t('simple_steps_title')}</h2>
          <p className="section-subtitle">
            {t('simple_steps_subtitle')}
          </p>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-icon">🚗</div>
              <h3>{t('register_account_step_title')}</h3>
              <p>{t('register_account_step_description')}</p>
            </div>
            <div className="step-item">
              <div className="step-icon">⚙️</div>
              <h3>{t('add_vehicles_step_title')}</h3>
              <p>{t('add_vehicles_step_description')}</p>
            </div>
            <div className="step-item">
              <div className="step-icon">📅</div>
              <h3>{t('track_optimize_step_title')}</h3>
              <p>{t('track_optimize_step_description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section section-padding bg-light">
        <div className="container">
          <h2 className="section-title">{t('what_our_users_say_title')}</h2>
          <Testimonials /> {/* Your existing Testimonials component */}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section section-padding bg-dark">
        <div className="container text-center">
          <h2 className="section-title text-white">{t('final_cta_title')}</h2>
          <p className="section-subtitle text-white">{t('final_cta_subtitle')}</p>
          <Link to="/register" className="btn primary-cta large-btn">
            {t('start_free_trial_btn')}
          </Link>
        </div>
      </section>
    </div>
  );
}
