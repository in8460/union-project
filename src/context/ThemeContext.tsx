import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { SiteSettings, INITIAL_SETTINGS, PortfolioItem, INITIAL_PORTFOLIO, Service, INITIAL_SERVICES, Post, INITIAL_NEWS } from '../types';

// Configure localforage
localforage.config({
  name: 'union_agency_app',
  storeName: 'site_data'
});

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
  news: Post[];
  addNews: (news: Omit<Post, 'id' | 'createdAt'>) => void;
  removeNews: (id: string) => void;
  updateNews: (id: string, news: Partial<Post>) => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [news, setNews] = useState<Post[]>(INITIAL_NEWS);

  // Initial load from localforage (with localStorage migration)
  useEffect(() => {
    const initData = async () => {
      // Safety timeout: 2 seconds max for storage access
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const loadPromise = (async () => {
          // Attempt to load from IndexedDB
          const savedSettings = await localforage.getItem<SiteSettings>('union_settings');
          const savedPortfolio = await localforage.getItem<PortfolioItem[]>('union_portfolio');
          const savedServices = await localforage.getItem<Service[]>('union_services');
          const savedNews = await localforage.getItem<Post[]>('union_news');

          // Migration logic: If nothing in IndexedDB, try localStorage
          if (!savedSettings && typeof window !== 'undefined') {
            const lsSettings = localStorage.getItem('union_settings');
            if (lsSettings) {
              const data = JSON.parse(lsSettings);
              setSettings(data);
              await localforage.setItem('union_settings', data);
            }
          } else if (savedSettings) {
            setSettings(savedSettings);
          }

          if (!savedPortfolio && typeof window !== 'undefined') {
            const lsPortfolio = localStorage.getItem('union_portfolio');
            if (lsPortfolio) {
              const data = JSON.parse(lsPortfolio);
              setPortfolio(data);
              await localforage.setItem('union_portfolio', data);
            }
          } else if (savedPortfolio) {
            setPortfolio(savedPortfolio);
          }

          if (!savedServices && typeof window !== 'undefined') {
            const lsServices = localStorage.getItem('union_services');
            if (lsServices) {
              const data = JSON.parse(lsServices) as Service[];
              const migrated = data.map(s => ({ ...s, features: s.features || [] }));
              setServices(migrated);
              await localforage.setItem('union_services', migrated);
            }
          } else if (savedServices) {
            setServices(savedServices.map(s => ({ ...s, features: s.features || [] })));
          }

          if (!savedNews && typeof window !== 'undefined') {
            const lsNews = localStorage.getItem('union_news');
            if (lsNews) {
              const data = JSON.parse(lsNews);
              setNews(data);
              await localforage.setItem('union_news', data);
            }
          } else if (savedNews) {
            setNews(savedNews);
          }
        })();

        // Race between loading and timeout
        await Promise.race([loadPromise, timeoutPromise]);
      } catch (err) {
        console.error('Failed to load data from storage:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    initData();
  }, []);

  // Sync to Shared Storage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('union_settings', settings);
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    }
  }, [settings, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('union_portfolio', portfolio);
    }
  }, [portfolio, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('union_services', services);
    }
  }, [services, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('union_news', news);
    }
  }, [news, isLoaded]);
  
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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

  const addNews = (newsData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...newsData,
      id: `post-${Date.now()}`,
      createdAt: Date.now()
    };
    setNews(prev => [newPost, ...prev]);
  };

  const removeNews = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  const updateNews = (id: string, updatedNews: Partial<Post>) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...updatedNews } : n));
  };

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
      updateService,
      news,
      addNews,
      removeNews,
      updateNews,
      isLoaded
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
