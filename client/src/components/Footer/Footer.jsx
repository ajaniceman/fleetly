import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Using Link for internal routes where applicable
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <footer className="footer-section">
      <div className="footer-content container">
        <div className="footer-main-grid">
          {/* Company Info */}
          <div className="footer-col company-info">
            <h3 className="footer-logo">Fleetly</h3>
            <p className="footer-description">
              {t('footer_brand_description_long')}
            </p>
            <div className="footer-social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="social-icon" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin className="social-icon" />
              </a>
              <a href="https://github.com/ajaniceman/fleetly" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub className="social-icon" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">{t('footer_quick_links_heading')}</h3>
            <ul className="footer-links-list">
              <li><Link to="/features">{t('footer_link_features')}</Link></li>
              <li><Link to="/blog">{t('footer_link_blog')}</Link></li>
              <li><Link to="/contact">{t('footer_link_contact')}</Link></li>
              <li><Link to="/privacy">{t('footer_link_privacy_policy')}</Link></li>
            </ul>
          </div>

          {/* Resources (New Column) */}
          <div className="footer-col">
            <h3 className="footer-heading">{t('footer_resources_heading')}</h3>
            <ul className="footer-links-list">
              <li><Link to="/support">{t('footer_link_support_res')}</Link></li>
              <li><Link to="/faqs">{t('footer_link_faqs_res')}</Link></li>
              <li><Link to="/careers">{t('footer_link_careers')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col contact-info">
            <h3 className="footer-heading">{t('footer_get_in_touch_heading')}</h3>
            <ul className="footer-contact-list">
              <li>
                <FaEnvelope className="contact-icon" />
                <a href="mailto:support@fleetly.com">{t('footer_contact_email')}</a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>{t('footer_contact_address_text')}</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <span>{t('footer_contact_phone_text')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="copyright">{t('footer_copyright_text', { year: new Date().getFullYear() })}</p>
          <p className="powered-by">{t('footer_powered_by_text', { developer: 'Eman' })}</p>
        </div>
      </div>
    </footer>
  );
}
