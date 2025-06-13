import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Using Link for internal routes where applicable
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-content container">
        <div className="footer-main-grid">
          {/* Company Info */}
          <div className="footer-col company-info">
            <h3 className="footer-logo">Fleetly</h3>
            <p className="footer-description">
              Revolutionizing fleet management with intuitive tracking, maintenance, and compliance tools. Drive efficiency, ensure safety.
            </p>
            <div className="footer-social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="social-icon" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin className="social-icon" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub className="social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links-list">
              <li><Link to="/features">Features</Link></li> {/* Using Link for internal routes */}
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li> {/* Added a common link */}
            </ul>
          </div>

          {/* Resources (New Column) */}
          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links-list">
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col contact-info">
            <h3 className="footer-heading">Get in Touch</h3>
            <ul className="footer-contact-list">
              <li>
                <FaEnvelope className="contact-icon" />
                <a href="mailto:support@fleetly.com">support@fleetly.com</a>
              </li>
              <li>
                <span className="contact-icon">📍</span> {/* Using an emoji for location */}
                <span>Bosnia & Herzegovina</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <span>+1 (555) 123-4567</span> {/* Example phone number */}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="copyright">© {new Date().getFullYear()} Fleetly. All rights reserved.</p>
          <p className="powered-by">Powered by <strong>Eman</strong></p>
        </div>
      </div>
    </footer>
  );
}
