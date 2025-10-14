import { useCallback, useMemo, useState } from "react";
import LocalizationContext from "./LocalizationContext";
import translations from "./translations";

function resolveTranslation(locale, key) {
  const segments = key.split(".");
  let node = translations[locale] ?? translations.en;

  for (let i = 0; i < segments.length; i += 1) {
    node = node?.[segments[i]];
    if (node == null) {
      break;
    }
  }

  if (typeof node === "string") {
    return node;
  }

  return key;
}

const availableLocales = Object.keys(translations);

const LocalizationProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const currentIndex = availableLocales.indexOf(prev);
      const nextIndex = (currentIndex + 1) % availableLocales.length;
      return availableLocales[nextIndex];
    });
  }, []);

  const value = useMemo(() => {
    const isRTL = locale === "ar";

    return {
      locale,
      isRTL,
      toggleLocale,
      t: (key) => resolveTranslation(locale, key),
    };
  }, [locale, toggleLocale]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocalizationProvider;
