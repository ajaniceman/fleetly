import React from 'react';
import Features from '../features/Features/Features';
import Testimonials from '../features/Testimonials/Testimonials';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content container">
          <div className="title-wrapper">
            <div className="pre-title">Smart. Reliable. Effortless.</div>
          <h1>
            <span className="title-br">Fleet Maintenance Made Easy</span>
          </h1>
          </div>
          <p className="subtitle">
            Take control of your vehicles with automated tracking for maintenance, registrations, and inspections—all in one place.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn primary">
              Get Started
            </Link>
            <Link to="/login" className="btn secondary">
              Login
            </Link>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">On-time renewals</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">30%</span>
              <span className="stat-label">Cost reduction</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Access</span>
            </div>
          </div>
        </div>
        <div className="hero-image"></div>
      </section>

      {/* Features Preview */}
      <section className="features-preview">
        <div className="container">
          <h2 className="section-title">Why Choose Fleetly?</h2>
          <Features />
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <Testimonials />
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to optimize your fleet management?</h2>
          <Link to="/register" className="btn primary large">
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}