import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import translationEN from './locales/en/translation.json';
import translationHE from './locales/he/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  he: {
    translation: translationHE
  }
};

i18n
  // load translation using http -> see /public/locales
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // language detection options
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
