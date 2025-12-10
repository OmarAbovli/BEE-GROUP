import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../data/translations';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
    language: Language;
    direction: Direction;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved === 'en' || saved === 'ar') ? saved : 'ar';
    });

    const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        document.documentElement.dir = direction;
        document.documentElement.lang = language;
        localStorage.setItem('language', language);
    }, [language, direction]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Fallback to key if missing
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
