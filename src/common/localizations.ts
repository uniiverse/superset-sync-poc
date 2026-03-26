import da_translations from "../translations/locales/da.json";
import de_translations from "../translations/locales/de.json";
import el_translations from "../translations/locales/el.json";
import en_translations from "../translations/locales/en.json";
import es_translations from "../translations/locales/es.json";
import fi_translations from "../translations/locales/fi.json";
import fr_translations from "../translations/locales/fr.json";
import nb_translations from "../translations/locales/nb.json";
import nl_BE_translations from "../translations/locales/nl_BE.json";
import nl_NL_translations from "../translations/locales/nl_NL.json";
import sv_translations from "../translations/locales/sv.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTranslations(locale: string): any {
  switch (locale) {
    case "da":
      return da_translations;
    case "de":
      return de_translations;
    case "el":
      return el_translations;
    case "en":
      return en_translations;
    case "es":
      return es_translations;
    case "fi":
      return fi_translations;
    case "fr":
      return fr_translations;
    case "nb":
      return nb_translations;
    case "nl_BE":
      return nl_BE_translations;
    case "nl_NL":
      return nl_NL_translations;
    case "sv":
      return sv_translations;
    default:
      return en_translations;
  }
}
