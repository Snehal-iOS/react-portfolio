import { createContext } from "react";

const LocalizationContext = createContext({
  locale: "en",
  t: (key) => key,
  isRTL: false,
  toggleLocale: () => {},
});

export default LocalizationContext;
