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
  addItem: (item: Omit<PortfolioItem, 'id' | 'order'>) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, item: Partial<PortfolioItem>) => void;
  reorderPortfolio: (items: PortfolioItem[]) => Promise<void>;
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'order'>) => void;
  removeService: (id: string) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  reorderServices: (items: Service[]) => Promise<void>;
  news: Post[];
  addNews: (news: Omit<Post, 'id' | 'createdAt' | 'order'>) => void;
  removeNews: (id: string) => void;
  updateNews: (id: string, news: Partial<Post>) => void;
  reorderNews: (items: Post[]) => Promise<void>;
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
        console.log('Site settings not found in Firestore, using defaults.');
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
      // Sort by order if available, else by id
      const sortedItems = items.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return b.id - a.id;
      });
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
      // Sort by order 
      const sortedItems = items.sort((a, b) => (a.order || 0) - (b.order || 0));
      setServices(sortedItems.length > 0 ? sortedItems : INITIAL_SERVICES);
      localforage.setItem('union_services', sortedItems);
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
      // Sort by order, then by createdAt
      const sortedItems = items.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return b.createdAt - a.createdAt;
      });
      setNews(sortedItems.length > 0 ? sortedItems : INITIAL_NEWS);
      localforage.setItem('union_news', sortedItems);
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

  const addItem = async (item: Omit<PortfolioItem, 'id' | 'order'>) => {
    try {
      const id = Date.now();
      const maxOrder = portfolio.reduce((max, i) => Math.max(max, i.order || 0), -1);
      const newItem: PortfolioItem = { ...item, id, order: maxOrder + 1 };
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
      const existing = portfolio.find(item => item.id === id) || INITIAL_PORTFOLIO.find(item => item.id === id);
      if (!existing) throw new Error('Existing portfolio item not found for update');
      const fullItem = { ...existing, ...updatedItem };
      fullItem.id = id;
      await setDoc(doc(db, 'portfolio', id.toString()), fullItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `portfolio/${id}`);
    }
  };

  const reorderPortfolio = async (items: PortfolioItem[]) => {
    try {
      await Promise.all(items.map((item, idx) => {
        const fullItem = { ...item, order: idx };
        return setDoc(doc(db, 'portfolio', item.id.toString()), fullItem);
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'portfolio/reorder');
    }
  };

  const addService = async (service: Omit<Service, 'id' | 'order'>) => {
    try {
      const id = `service-${Date.now()}`;
      const maxOrder = services.reduce((max, s) => Math.max(max, s.order || 0), -1);
      const newService: Service = { 
        id,
        title: service.title || '새 서비스',
        description: service.description || '',
        icon: service.icon || 'Star',
        imageUrl: service.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80',
        features: service.features || [],
        order: maxOrder + 1
      };
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
      const existing = services.find(s => s.id === id) || INITIAL_SERVICES.find(s => s.id === id);
      if (!existing) throw new Error('Existing service not found for update');
      const fullService = { ...existing, ...updatedService };
      fullService.id = id;
      await setDoc(doc(db, 'services', id), fullService);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `services/${id}`);
    }
  };

  const reorderServices = async (items: Service[]) => {
    try {
      await Promise.all(items.map((item, idx) => {
        const fullItem = { ...item, order: idx };
        return setDoc(doc(db, 'services', item.id), fullItem);
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'services/reorder');
    }
  };

  const addNews = async (newsData: Omit<Post, 'id' | 'createdAt' | 'order'>) => {
    try {
      const id = `post-${Date.now()}`;
      const maxOrder = news.reduce((max, n) => Math.max(max, n.order || 0), -1);
      const newPost: Post = {
        title: newsData.title || '새 글',
        content: newsData.content || '',
        category: newsData.category || '공지사항',
        imageUrl: newsData.imageUrl || '',
        id,
        createdAt: Date.now(),
        order: maxOrder + 1
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
      const existing = news.find(n => n.id === id) || INITIAL_NEWS.find(n => n.id === id);
      if (!existing) throw new Error('Existing post not found for update');
      const fullPost = { ...existing, ...updatedNews };
      fullPost.id = id;
      await setDoc(doc(db, 'news', id), fullPost);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `news/${id}`);
    }
  };

  const reorderNews = async (items: Post[]) => {
    try {
      await Promise.all(items.map((item, idx) => {
        const fullItem = { ...item, order: idx };
        return setDoc(doc(db, 'news', item.id), fullItem);
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'news/reorder');
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
      reorderPortfolio,
      services,
      addService,
      removeService,
      updateService,
      reorderServices,
      news,
      addNews,
      removeNews,
      updateNews,
      reorderNews,
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
