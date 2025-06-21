import React from 'react';
import './PrivacyPolicyPage.css'; // Import the CSS for the privacy policy page
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-header">
        <h1>{t('privacy_policy_title')}</h1>
        <p>{t('privacy_policy_last_updated')}</p>
      </div>

      <div className="privacy-policy-content">
        <section>
          <h2>{t('privacy_policy_section_introduction_heading')}</h2>
          <p>{t('privacy_policy_section_introduction_paragraph1')}</p>
          <p>{t('privacy_policy_section_introduction_paragraph2')}</p>
        </section>

        <section>
          <h2>{t('privacy_policy_section_information_collected_heading')}</h2>
          <h3>{t('privacy_policy_subsection_personal_data_heading')}</h3>
          <p>{t('privacy_policy_subsection_personal_data_paragraph')}</p>
          <ul>
            <li>{t('privacy_policy_personal_data_item1')}</li>
            <li>{t('privacy_policy_personal_data_item2')}</li>
            <li>{t('privacy_policy_personal_data_item3')}</li>
            <li>{t('privacy_policy_personal_data_item4')}</li>
            <li>{t('privacy_policy_personal_data_item5')}</li>
          </ul>
          <h3>{t('privacy_policy_subsection_non_personal_data_heading')}</h3>
          <p>{t('privacy_policy_subsection_non_personal_data_paragraph')}</p>
        </section>

        <section>
          <h2>{t('privacy_policy_section_how_we_use_heading')}</h2>
          <ul>
            <li>{t('privacy_policy_how_we_use_item1')}</li>
            <li>{t('privacy_policy_how_we_use_item2')}</li>
            <li>{t('privacy_policy_how_we_use_item3')}</li>
            <li>{t('privacy_policy_how_we_use_item4')}</li>
            <li>{t('privacy_policy_how_we_use_item5')}</li>
            <li>{t('privacy_policy_how_we_use_item6')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('privacy_policy_section_how_we_share_heading')}</h2>
          <p>{t('privacy_policy_section_how_we_share_paragraph1')}</p>
          <ul>
            <li>{t('privacy_policy_how_we_share_item1_heading')}</li>
            <p>{t('privacy_policy_how_we_share_item1_paragraph')}</p>
            <li>{t('privacy_policy_how_we_share_item2_heading')}</li>
            <p>{t('privacy_policy_how_we_share_item2_paragraph')}</p>
            <li>{t('privacy_policy_how_we_share_item3_heading')}</li>
            <p>{t('privacy_policy_how_we_share_item3_paragraph')}</p>
          </ul>
        </section>

        <section>
          <h2>{t('privacy_policy_section_data_security_heading')}</h2>
          <p>{t('privacy_policy_section_data_security_paragraph')}</p>
        </section>

        <section>
          <h2>{t('privacy_policy_section_your_choices_heading')}</h2>
          <p>{t('privacy_policy_section_your_choices_paragraph1')}</p>
          <p>{t('privacy_policy_section_your_choices_paragraph2')}</p>
        </section>

        <section>
          <h2>{t('privacy_policy_section_third_party_links_heading')}</h2>
          <p>{t('privacy_policy_section_third_party_links_paragraph')}</p>
        </section>

        <section>
          <h2>{t('privacy_policy_section_children_privacy_heading')}</h2>
          <p>{t('privacy_policy_section_children_privacy_paragraph')}</p>
        </section>

        <section>
          <h2>{t('privacy_policy_section_changes_heading')}</h2>
          <p>{t('privacy_policy_section_changes_paragraph')}</p>
        </section>

        <section>
          <h2>{t('privacy_policy_section_contact_heading')}</h2>
          <p>{t('privacy_policy_section_contact_paragraph')}</p>
          <p>{t('contact_email')}</p> {/* Reusing the contact email key */}
        </section>
      </div>
    </div>
  );
}
