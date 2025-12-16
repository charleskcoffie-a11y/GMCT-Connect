
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

interface SettingsContextType {
  logoUrl: string | null;
  updateLogo: (url: string | null) => void;
  maxClasses: number;
  updateMaxClasses: (num: number) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [maxClasses, setMaxClasses] = useState<number>(14);
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(false);

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

    const savedNotif = localStorage.getItem('gmct_notifications_enabled');
    if (savedNotif) {
      setNotificationsEnabledState(savedNotif === 'true');
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

  const setNotificationsEnabled = (enabled: boolean) => {
    localStorage.setItem('gmct_notifications_enabled', enabled ? 'true' : 'false');
    setNotificationsEnabledState(enabled);
  };

  return (
    <SettingsContext.Provider value={{ logoUrl, updateLogo, maxClasses, updateMaxClasses, notificationsEnabled, setNotificationsEnabled }}>
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
