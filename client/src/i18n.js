import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  }
};

i18n
  .use(LanguageDetector) // Detect user language (browser, localStorage, etc.)
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources, // Your loaded translation files
    fallbackLng: 'en', // Fallback language if user's language is not available
    debug: false, // Set to true for debugging in development
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    // Options for LanguageDetector
    detection: {
      order: ['localStorage', 'navigator'], // Order in which to check for language preference
      caches: ['localStorage'], // Where to store detected language
    }
  });

export default i18n;
