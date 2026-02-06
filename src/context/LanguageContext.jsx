import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "en";
  });

  useEffect(() => {
    localStorage.setItem("selectedLanguage", language);
    window.dispatchEvent(new Event("storage"));
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
