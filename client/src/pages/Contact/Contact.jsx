import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Contact.css'; // Import the CSS for the contact page
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1>{t('contact_page_title')}</h1>
        <p>{t('contact_page_subtitle')}</p>
      </div>

      <div className="contact-content-grid">
        <div className="contact-info-card">
          <h2>{t('contact_info_heading')}</h2>
          <ul className="contact-details-list">
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>{t('contact_address')}</span>
            </li>
            <li>
              <FaPhone className="contact-icon" />
              <span>{t('contact_phone')}</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>{t('contact_email')}</span>
            </li>
          </ul>
        </div>

        <div className="contact-social-card">
          <h2>{t('contact_social_heading')}</h2>
          <p>{t('contact_social_text')}</p>
          <div className="contact-social-links">
            <a href="https://facebook.com/fleetly" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://twitter.com/fleetly" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="social-icon" />
            </a>
            <a href="https://linkedin.com/company/fleetly" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="social-icon" />
            </a>
            <a href="https://instagram.com/fleetly" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="social-icon" />
            </a>
          </div>
        </div>

        <div className="contact-form-card">
          <h2>{t('contact_form_heading')}</h2>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">{t('contact_form_label_name')}</label>
              <input type="text" id="name" name="name" required placeholder={t('contact_form_placeholder_name')} />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('contact_form_label_email')}</label>
              <input type="email" id="email" name="email" required placeholder={t('contact_form_placeholder_email')} />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact_form_label_message')}</label>
              <textarea id="message" name="message" rows="5" required placeholder={t('contact_form_placeholder_message')}></textarea>
            </div>
            <button type="submit" className="submit-contact-btn">{t('contact_form_send_btn')}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
