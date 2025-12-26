import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import itTranslations from './locales/it.json';
import ptTranslations from './locales/pt.json';
import ruTranslations from './locales/ru.json';
import zhTranslations from './locales/zh.json';
import jaTranslations from './locales/ja.json';
import koTranslations from './locales/ko.json';
import hiTranslations from './locales/hi.json';
import trTranslations from './locales/tr.json';
import nlTranslations from './locales/nl.json';
import plTranslations from './locales/pl.json';
import svTranslations from './locales/sv.json';
import idTranslations from './locales/id.json';
import thTranslations from './locales/th.json';
import viTranslations from './locales/vi.json';
import heTranslations from './locales/he.json';

const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  it: { translation: itTranslations },
  pt: { translation: ptTranslations },
  ru: { translation: ruTranslations },
  zh: { translation: zhTranslations },
  ja: { translation: jaTranslations },
  ko: { translation: koTranslations },
  hi: { translation: hiTranslations },
  tr: { translation: trTranslations },
  nl: { translation: nlTranslations },
  pl: { translation: plTranslations },
  sv: { translation: svTranslations },
  id: { translation: idTranslations },
  th: { translation: thTranslations },
  vi: { translation: viTranslations },
  he: { translation: heTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;