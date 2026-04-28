import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { 
  onSnapshot, 
  doc, 
  setDoc, 
  collection, 
  deleteDoc, 
  getDocFromServer,
  arrayUnion,
  updateDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
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

  // Validate Connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'siteConfig', 'settings'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Sync Site Settings
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'siteConfig', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteSettings;
        setSettings(data);
        localforage.setItem('union_settings', data);
        document.documentElement.style.setProperty('--primary-color', data.primaryColor);
      } else {
        // First time initialization
        setDoc(doc(db, 'siteConfig', 'settings'), INITIAL_SETTINGS);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'siteConfig/settings');
    });

    return () => unsubscribe();
  }, []);

  // Sync Portfolio
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'portfolio'), (snapshot) => {
      const items: PortfolioItem[] = [];
      snapshot.forEach((doc) => {
        items.push(doc.data() as PortfolioItem);
      });
      // Sort by ID (timestamp) or some other logic if needed. 
      // Existing code uses Date.now() as ID.
      const sortedItems = items.sort((a, b) => b.id - a.id);
      setPortfolio(sortedItems.length > 0 ? sortedItems : INITIAL_PORTFOLIO);
      localforage.setItem('union_portfolio', sortedItems);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'portfolio');
    });

    return () => unsubscribe();
  }, []);

  // Sync Services
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const items: Service[] = [];
      snapshot.forEach((doc) => {
        items.push(doc.data() as Service);
      });
      setServices(items.length > 0 ? items : INITIAL_SERVICES);
      localforage.setItem('union_services', items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'services');
    });

    return () => unsubscribe();
  }, []);

  // Sync News
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'news'), (snapshot) => {
      const items: Post[] = [];
      snapshot.forEach((doc) => {
        items.push(doc.data() as Post);
      });
      const sortedItems = items.sort((a, b) => b.createdAt - a.createdAt);
      setNews(sortedItems.length > 0 ? sortedItems : INITIAL_NEWS);
      localforage.setItem('union_news', sortedItems);
      // Mark as loaded when news (usually last) is fetched
      setIsLoaded(true);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'news');
    });

    return () => unsubscribe();
  }, []);
  
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      await setDoc(doc(db, 'siteConfig', 'settings'), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'siteConfig/settings');
    }
  };

  const addItem = async (item: Omit<PortfolioItem, 'id'>) => {
    try {
      const id = Date.now();
      const newItem = { ...item, id };
      await setDoc(doc(db, 'portfolio', id.toString()), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'portfolio');
    }
  };

  const removeItem = async (id: number) => {
    try {
      await deleteDoc(doc(db, 'portfolio', id.toString()));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'portfolio');
    }
  };

  const updateItem = async (id: number, updatedItem: Partial<PortfolioItem>) => {
    try {
      await updateDoc(doc(db, 'portfolio', id.toString()), updatedItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'portfolio');
    }
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const id = `service-${Date.now()}`;
      const newService = { ...service, id };
      await setDoc(doc(db, 'services', id), newService);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'services');
    }
  };

  const removeService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'services');
    }
  };

  const updateService = async (id: string, updatedService: Partial<Service>) => {
    try {
      await updateDoc(doc(db, 'services', id), updatedService);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'services');
    }
  };

  const addNews = async (newsData: Omit<Post, 'id' | 'createdAt'>) => {
    try {
      const id = `post-${Date.now()}`;
      const newPost: Post = {
        ...newsData,
        id,
        createdAt: Date.now()
      };
      await setDoc(doc(db, 'news', id), newPost);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'news');
    }
  };

  const removeNews = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'news');
    }
  };

  const updateNews = async (id: string, updatedNews: Partial<Post>) => {
    try {
      await updateDoc(doc(db, 'news', id), updatedNews);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'news');
    }
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
