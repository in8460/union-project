import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, INITIAL_SETTINGS, PortfolioItem, INITIAL_PORTFOLIO, Service, INITIAL_SERVICES } from '../types';

interface ThemeContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  portfolio: PortfolioItem[];
  addItem: (item: Omit<PortfolioItem, 'id'>) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, item: Partial<PortfolioItem>) => void;
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  removeService: (id: string) => void;
  updateService: (id: string, service: Partial<Service>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);

  // Future: Firebase initialization here
  
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Update CSS variable for real-time theme changes
    if (newSettings.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor);
    }
  };

  const addItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem = { ...item, id: Date.now() };
    setPortfolio(prev => [...prev, newItem]);
  };

  const removeItem = (id: number) => {
    setPortfolio(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: number, updatedItem: Partial<PortfolioItem>) => {
    setPortfolio(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: `service-${Date.now()}` };
    setServices(prev => [...prev, newService]);
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateService = (id: string, updatedService: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedService } : s));
  };

  useEffect(() => {
    // Initialize CSS variable on load
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      settings, 
      updateSettings, 
      portfolio, 
      addItem, 
      removeItem, 
      updateItem,
      services,
      addService,
      removeService,
      updateService
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
