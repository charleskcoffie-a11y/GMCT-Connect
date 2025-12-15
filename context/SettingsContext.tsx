
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

interface SettingsContextType {
  logoUrl: string | null;
  updateLogo: (url: string | null) => void;
  maxClasses: number;
  updateMaxClasses: (num: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [maxClasses, setMaxClasses] = useState<number>(14);

  useEffect(() => {
    // Load from local storage on mount
    const savedLogo = localStorage.getItem('gmct_app_logo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
    
    const savedMaxClasses = localStorage.getItem('gmct_max_classes');
    if (savedMaxClasses) {
        setMaxClasses(parseInt(savedMaxClasses, 10));
    }
  }, []);

  const updateLogo = (url: string | null) => {
    if (url) {
      localStorage.setItem('gmct_app_logo', url);
    } else {
      localStorage.removeItem('gmct_app_logo');
    }
    setLogoUrl(url);
  };

  const updateMaxClasses = (num: number) => {
      localStorage.setItem('gmct_max_classes', num.toString());
      setMaxClasses(num);
  };

  return (
    <SettingsContext.Provider value={{ logoUrl, updateLogo, maxClasses, updateMaxClasses }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
