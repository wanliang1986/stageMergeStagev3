import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import Cache from 'i18next-localstorage-cache';
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
    .use(XHR)
    .use(Cache)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // lng: "en",

        fallbackLng: 'en',

        keySeparator: false, // we do not use keys in form messages.welcome

        react: {
            useSuspense: true,
        },

        // have a common namespace used around the full app
        ns: ['common'],
        defaultNS: 'common',

        // debug: false,

        interpolation: {
            escapeValue: false, // not needed for react!!
        }
    });


export default i18n;