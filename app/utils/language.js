/**
 * Three languages: English, Marathi and Hindi.
 *
 * Chandgaon is in Maharashtra, so Marathi is the language most residents read
 * first — it sits in the middle of the switcher, between English and Hindi.
 *
 * A note on history: the toggle used to store "marathi" while the text it
 * showed was actually Hindi. Nothing persisted that choice, so no stored
 * preference had to be migrated — "marathi" now genuinely means Marathi.
 */

export const LANGUAGE_STORAGE_KEY = "px_language";

export const LANGUAGES = [
  { value: "english", short: "EN", label: "English" },
  { value: "marathi", short: "मराठी", label: "मराठी" },
  { value: "hindi", short: "हिंदी", label: "हिंदी" },
];

export const LANGUAGE_VALUES = LANGUAGES.map((l) => l.value);

export const isEnglish = (language) => language === "english";

/**
 * Choose the right string for the current language.
 *
 *   pick(language, { en: "Funds", mr: "निधी", hi: "निधि" })
 *
 * Marathi falls back to Hindi where a Marathi string has not been written yet,
 * and Hindi falls back to English — both are Devanagari, so the page stays
 * readable rather than showing a blank or an English word mid-sentence.
 * Passing only `en` and `hi` therefore keeps working while translation
 * continues, which is why the older two-language screens are untouched.
 */
export const pick = (language, strings = {}) => {
  if (language === "marathi") return strings.mr ?? strings.hi ?? strings.en ?? "";
  if (language === "hindi") return strings.hi ?? strings.mr ?? strings.en ?? "";
  return strings.en ?? "";
};

/** True where a screen still has no Marathi of its own. Used by the audit script. */
export const usesFallback = (language, strings = {}) =>
  language === "marathi" && strings.mr == null;
