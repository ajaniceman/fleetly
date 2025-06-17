import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translation files
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import bsTranslation from './locales/bs/translation.json'; // New
import frTranslation from './locales/fr/translation.json'; // New
import deTranslation from './locales/de/translation.json'; // New
import itTranslation from './locales/it/translation.json'; // New

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
      bs: { // New language entry
        translation: bsTranslation,
      },
      fr: { // New language entry
        translation: frTranslation,
      },
      de: { // New language entry
        translation: deTranslation,
      },
      it: { // New language entry
        translation: itTranslation,
      },
    },
    fallbackLng: 'en', // Fallback to English if translation is missing
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;