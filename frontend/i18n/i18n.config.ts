import en from './locales/en.json'
import de from './locales/de.json'
import es from './locales/es.json'
import pt from './locales/pt.json'
import fr from './locales/fr.json'
import it from './locales/it.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en,
    de,
    es,
    pt,
    fr,
    it,
  },
}));
