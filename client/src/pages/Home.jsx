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
            <div className="pre-title">FLEET MANAGEMENT SIMPLIFIED</div>
            <h1>
              <span className="title-br">Maintenance Tracking</span>
            </h1>
          </div>
          <p className="subtitle">
            Never miss a service deadline again. Fleetly helps you stay on top of registrations, 
            inspections, and maintenance with automated reminders.
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