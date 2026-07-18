import React, { useContext, useState } from "react";

// Create the language context
const LanguageContext = React.createContext();

import * as baseService from "../services/baseService";
export const LanguageProvider = ({ children }) => {
    let savedLanguage = localStorage.getItem("language");
    const [language, setLanguage] = useState(savedLanguage || "bg");

    const handleLanguageChange = (lang) => {
        baseService
            .setLocale({ language: lang })
            .then((result) => {
                setLanguage((state) => lang);
                localStorage.setItem("language", lang);
            })
            .catch((err) => {
            });
    };
    return (
        <LanguageContext.Provider value={{ language, handleLanguageChange }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
