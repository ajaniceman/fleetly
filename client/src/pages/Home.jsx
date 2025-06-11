import React from 'react';
import Features from '../features/Features/Features';
import Testimonials from '../features/Testimonials/Testimonials';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Fleetly</h1>
          <p>Advanced fleet management solutions</p>
          <div className="auth-buttons">
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </div>
        </div>
      </header>
      
      <Features />
      <Testimonials />
    </div>
  );
}