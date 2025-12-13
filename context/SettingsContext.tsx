import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  logoUrl: string | null;
  updateLogo: (url: string | null) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage on mount
    const savedLogo = localStorage.getItem('gmct_app_logo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
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

  return (
    <SettingsContext.Provider value={{ logoUrl, updateLogo }}>
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