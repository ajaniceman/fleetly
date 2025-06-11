// src/components/Footer/Footer.jsx
import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-col">
            <h3 className="footer-title">Fleetly</h3>
            <p className="footer-text">
              Simplifying vehicle maintenance and registration tracking for businesses and individuals.
            </p>
            <div className="footer-copyright">© {new Date().getFullYear()} Fleetly</div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/features">Features</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-contact">
              <li>
                <FaEnvelope className="footer-icon" />
                <a href="mailto:support@fleetly.com">support@fleetly.com</a>
              </li>
              <li>
                <span className="footer-icon">📍</span>
                <span>Bosnia & Herzegovina</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-col">
            <h3 className="footer-title">Follow Us</h3>
            <div className="footer-social">
              <a href="https://twitter.com" aria-label="Twitter">
                <FaTwitter className="social-icon" />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn">
                <FaLinkedin className="social-icon" />
              </a>
              <a href="https://github.com" aria-label="GitHub">
                <FaGithub className="social-icon" />
              </a>
            </div>
            <div className="footer-credit">
              Powered by <strong>Eman</strong>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}