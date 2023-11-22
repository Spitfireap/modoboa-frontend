import { createGettext } from 'vue3-gettext'
import translations from '@/language/translations.json'

export default createGettext({
  availableLanguages: {
    en: 'English',
  },
  defaultLanguage: 'en',
  translations: translations,
  silent: true, // stop warnings
})
