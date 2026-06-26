import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("food_language") || "en",
  );

  const direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem("food_language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const value = useMemo(() => {
    const t = (key) => translations[language][key] || translations.en[key] || key;

    return {
      language,
      direction,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === "en" ? "ar" : "en")),
      t,
    };
  }, [language, direction]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
