import React from 'react';
import { Link } from 'react-router-dom';
import Features from '../features/Features/Features'; // Assuming this component is robust
import Testimonials from '../features/Testimonials/Testimonials'; // Assuming this component is robust
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-gradient"></div> {/* For a subtle background effect */}
        <div className="hero-content container">
          <div className="pre-title animate-fade-in-up-delay-1">Smart. Seamless. Powerful.</div>
          <h1 className="hero-title animate-fade-in-up-delay-2">
            Master Your Fleet with <span className="highlight">Effortless</span> Management
          </h1>
          <p className="subtitle animate-fade-in-up-delay-3">
            Streamline vehicle tracking, maintenance schedules, and critical date reminders. Fleetly is your all-in-one solution for optimal fleet performance.
          </p>
          <div className="cta-buttons animate-fade-in-up-delay-4">
            <Link to="/register" className="btn primary-cta">Get Started Free</Link>
            <Link to="/login" className="btn secondary-cta">Login to Dashboard</Link>
          </div>
          <div className="stats-grid animate-fade-in-up-delay-5">
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Compliance Success</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">40%</span>
              <span className="stat-label">Maintenance Savings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Accessible Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Fleetly? (Features) */}
      <section className="features-preview section-padding bg-light">
        <div className="container">
          <h2 className="section-title">Unlock Efficiency with Fleetly's Core Features</h2>
          <p className="section-subtitle">
            From comprehensive vehicle profiles to smart reminders, Fleetly keeps you ahead.
          </p>
          <Features /> {/* Your existing Features component */}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section section-padding">
        <div className="container">
          <h2 className="section-title">Simple Steps to Smarter Fleet Management</h2>
          <p className="section-subtitle">
            Getting started with Fleetly is quick and easy.
          </p>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-icon">🚗</div>
              <h3>1. Register Your Account</h3>
              <p>Sign up in minutes and set up your personalized fleet dashboard.</p>
            </div>
            <div className="step-item">
              <div className="step-icon">⚙️</div>
              <h3>2. Add Your Vehicles</h3>
              <p>Easily input vehicle details, including type, make, model, and key dates.</p>
            </div>
            <div className="step-item">
              <div className="step-icon">📅</div>
              <h3>3. Track & Optimize</h3>
              <p>Receive smart reminders for services and inspections. Stay compliant, save costs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section section-padding bg-light">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <Testimonials /> {/* Your existing Testimonials component */}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section section-padding bg-dark">
        <div className="container text-center">
          <h2 className="section-title text-white">Ready to elevate your fleet's performance?</h2>
          <p className="section-subtitle text-white">Join countless fleet managers simplifying their operations with Fleetly.</p>
          <Link to="/register" className="btn primary-cta large-btn">
            Start Your Free Trial Today
          </Link>
        </div>
      </section>
    </div>
  );
}
