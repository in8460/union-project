import { useState, ChangeEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Layout, 
  FileText, 
  Image as ImageIcon, 
  LogOut, 
  Save, 
  Plus, 
  Edit3, 
  Trash2,
  Palette,
  ExternalLink,
  Database,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../lib/firebase';
import { compressImage } from '../../lib/imageUtils';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'settings' | 'news' | 'portfolio' | 'services' | 'home'>('settings');
  const { 
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
  } = useTheme();
  
  // Local draft states for smooth typing
  const [localSettings, setLocalSettings] = useState(settings);
  const [localServices, setLocalServices] = useState(services);
  const [localNews, setLocalNews] = useState(news);
  const [localPortfolio, setLocalPortfolio] = useState(portfolio);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());

  // Initialize local states when global data loads
  useEffect(() => {
    if (isLoaded) {
      setLocalSettings(settings);
      setLocalServices(services);
      setLocalNews(news);
      setLocalPortfolio(portfolio);
    }
  }, [isLoaded, settings, services, news, portfolio]);

  const [saveMessage, setSaveMessage] = useState('');
  const navigate = useNavigate();

  // Manual save all
  const handleSaveAll = async () => {
    if (!isDirty) return;
    
    setSaveMessage('저장 중...');
    try {
      // Sync all local changes
      await updateSettings(localSettings);
      
      // Sync services (only updated ones)
      for (const service of localServices) {
        await updateService(service.id, service);
      }
      
      // Sync news
      for (const post of localNews) {
        await updateNews(post.id, post);
      }
      
      // Sync portfolio
      for (const item of localPortfolio) {
        await updateItem(item.id, item);
      }
      
      setIsDirty(false);
      setLastSaved(Date.now());
      setSaveMessage('모든 변경사항이 안전하게 저장되었습니다.');
    } catch (error) {
      console.error('Save all failed:', error);
      setSaveMessage('저장 중 오류가 발생했습니다.');
    }
  };

  // Auto-save logic (debounced)
  useEffect(() => {
    if (!isDirty) return;
    
    const timer = setTimeout(() => {
      handleSaveAll();
    }, 5000); // Auto-save after 5 seconds of inactivity
    
    return () => clearTimeout(timer);
  }, [isDirty, localSettings, localServices, localNews, localPortfolio]);

  // Auth check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const [isUploading, setIsUploading] = useState(false);
  const [storageUsage, setStorageUsage] = useState<{ used: number, total: number }>({ used: 0, total: 1024 * 1024 }); // 1GB limit for display

  useEffect(() => {
    const updateEstimate = async () => {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        setStorageUsage({
          used: (estimate.usage || 0) / 1024, // KB
          total: (estimate.quota || 1024 * 1024 * 1024) / 1024 // KB
        });
      }
    };
    updateEstimate();
  }, [portfolio, services, settings, news]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for raw upload
        alert('파일이 너무 큽니다. 10MB 이하의 이미지를 선택해주세요.');
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        if (reader.result) {
          try {
            // Compress image to ensure it fits in Firestore (1MB limit)
            const compressed = await compressImage(reader.result as string, 1000, 1000, 0.6);
            
            // Final check
            const sizeKB = Math.round((compressed.length * 3) / 4 / 1024);
            if (sizeKB > 650) {
              alert(`압축 후에도 이미지 크기가 너무 큽니다 (${sizeKB}KB). 다른 이미지를 선택하거나 크기를 더 줄여주세요.`);
              setIsUploading(false);
              return;
            }

            callback(compressed);
            setSaveMessage('이미지가 최적화되어 성공적으로 적용되었습니다.');
          } catch (error) {
            console.error('이미지 처리 실패:', error);
            alert('이미지 최적화 중 오류가 발생했습니다.');
          } finally {
            setIsUploading(false);
          }
        }
      };
      
      reader.onerror = () => {
        alert('이미지를 읽는 중 오류가 발생했습니다.');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('행사기획');

  const [isAddingService, setIsAddingService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'공지사항' | '뉴스' | '포트폴리오'>('공지사항');

  const handleAddProject = () => {
    if (!newProjectTitle.trim()) {
      alert('프로젝트 제목을 입력해주세요.');
      return;
    }
    addItem({
      title: newProjectTitle,
      category: newProjectCategory,
      image: 'https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&q=80'
    });
    setNewProjectTitle('');
    setIsAddingProject(false);
    setSaveMessage('새 프로젝트가 추가되었습니다.');
  };

  const handleAddService = () => {
    if (!newServiceTitle.trim()) {
      alert('서비스 제목을 입력해주세요.');
      return;
    }
    addService({
      title: newServiceTitle,
      description: newServiceDesc || '서비스 설명을 입력해주세요.',
      icon: 'Star',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80',
      features: ['상세 항목을 추가하세요']
    });
    setNewServiceTitle('');
    setNewServiceDesc('');
    setIsAddingService(false);
    setSaveMessage('새 서비스가 추가되었습니다.');
  };

  const handleAddNews = () => {
    if (!newNewsTitle.trim()) {
      alert('공지사항 제목을 입력해주세요.');
      return;
    }
    addNews({
      title: newNewsTitle,
      content: '내용을 입력하세요.',
      category: newNewsCategory
    });
    setNewNewsTitle('');
    setIsAddingNews(false);
    setSaveMessage('새 공지사항이 추가되었습니다.');
  };

  const handleMoveService = async (index: number, direction: 'up' | 'down') => {
    const newServices = [...services];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newServices.length) return;
    
    [newServices[index], newServices[newIndex]] = [newServices[newIndex], newServices[index]];
    await reorderServices(newServices);
    setSaveMessage('순서가 변경되었습니다.');
  };

  const handleMoveNews = async (index: number, direction: 'up' | 'down') => {
    const newNews = [...news];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newNews.length) return;
    
    [newNews[index], newNews[newIndex]] = [newNews[newIndex], newNews[index]];
    await reorderNews(newNews);
    setSaveMessage('순서가 변경되었습니다.');
  };

  const handleMovePortfolio = async (index: number, direction: 'up' | 'down') => {
    const newPortfolio = [...portfolio];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newPortfolio.length) return;
    
    [newPortfolio[index], newPortfolio[newIndex]] = [newPortfolio[newIndex], newPortfolio[index]];
    await reorderPortfolio(newPortfolio);
    setSaveMessage('순서가 변경되었습니다.');
  };

  return (
    <div className="min-h-screen bg-navy-dark/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-navy-primary rounded flex items-center justify-center text-white font-bold">U</div>
          <span className="font-bold text-sm">ADMIN PANEL</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'settings', label: '사이트 설정', icon: Settings },
            { id: 'home', label: '메인 화면 관리', icon: Layout },
            { id: 'services', label: '서비스 관리', icon: Layout },
            { id: 'news', label: '공지사항 관리', icon: FileText },
            { id: 'portfolio', label: '포트폴리오 관리', icon: Layout },
          ].map((item, index) => (
            <button
              key={`nav-${item.id}-${index}`}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id ? 'bg-navy-primary text-white shadow-lg' : 'text-white/40 hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
               <img src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser?.email || 'A'}&background=random`} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="text-[10px] font-bold text-white truncate">{auth.currentUser?.email}</p>
              <p className="text-[8px] text-white/40 uppercase tracking-widest">Administrator</p>
            </div>
          </div>
          <div className="px-4 py-3 mb-2">
            <div className="flex justify-between items-center text-[10px] text-white/40 mb-1">
              <span className="flex items-center gap-1"><Database size={10} /> 저장소 사용량 (Firebase)</span>
              <span>{(storageUsage.used / 1024).toFixed(1)}MB / {(storageUsage.total / 1024).toFixed(0)}MB</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${(storageUsage.used / storageUsage.total) > 0.8 ? 'bg-red-500' : 'bg-navy-light'}`}
                style={{ width: `${Math.min((storageUsage.used / storageUsage.total) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all"
          >
            <ExternalLink size={18} />
            사이트 바로가기
          </button>
          <button 
            onClick={() => {
              auth.signOut();
              navigate('/admin');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all mt-2"
          >
            <LogOut size={18} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-grow p-10 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {activeTab === 'settings' && '사이트 환경 설정'}
              {activeTab === 'home' && '메인 화면 관리'}
              {activeTab === 'services' && '핵심 서비스 관리'}
              {activeTab === 'news' && '공지사항 관리'}
              {activeTab === 'portfolio' && '포트폴리오 관리'}
            </h1>
            <p className="text-white/40 text-sm">웹사이트의 전반적인 콘텐츠와 디자인을 관리합니다.</p>
          </div>
          {saveMessage ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-6 py-3 bg-navy-light text-white font-bold rounded-xl flex items-center gap-2"
            >
              <Save size={18} /> {saveMessage}
            </motion.div>
          ) : (
            <button 
              onClick={handleSaveAll}
              disabled={!isDirty}
              className={`px-6 py-3 font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-black/20 ${
                isDirty 
                  ? 'bg-navy-primary text-white hover:bg-navy-light' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
              }`}
            >
              <Save size={18} /> {isDirty ? '변경사항 저장하기' : '변경사항 없음'}
            </button>
          )}
        </header>

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="glass-card p-8 space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Layout size={20} className="text-navy-light" /> 기본 정보 설정
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">웹사이트 명칭</label>
                  <input 
                    type="text" 
                    value={localSettings.siteName}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, siteName: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">사이트 설명 (SEO)</label>
                  <input 
                    type="text" 
                    value={localSettings.description}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, description: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-8 space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Palette size={20} className="text-navy-light" /> 디자인 및 색상 가이드
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">포인트 컬러 (Primary)</label>
                  <div className="flex gap-4">
                    <input 
                      type="color" 
                      value={localSettings.primaryColor}
                      onChange={(e) => {
                        setLocalSettings({ ...localSettings, primaryColor: e.target.value });
                        setIsDirty(true);
                      }}
                      className="h-11 w-20 bg-transparent border-none rounded cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={localSettings.primaryColor}
                      readOnly
                      className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'home' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="glass-card p-8 space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Layout size={20} className="text-navy-light" /> 히어로 섹션 설정
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">배지 텍스트</label>
                  <input 
                    type="text" 
                    value={localSettings.heroBadge}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, heroBadge: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">배경 이미지 (파일 첨부)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded bg-white/5 overflow-hidden border border-white/10">
                      <img src={localSettings.heroImageUrl} className="w-full h-full object-cover" />
                    </div>
                    <label className={`flex-grow cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <div className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white/40 group-hover:border-navy-light group-hover:text-white transition-all flex items-center gap-2">
                        <ImageIcon size={14} className={isUploading ? 'animate-pulse' : ''} /> 
                        {isUploading ? '이미지 처리 중...' : '이미지 선택...'}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => handleImageUpload(e, (url) => {
                          setLocalSettings({ ...localSettings, heroImageUrl: url });
                          setIsDirty(true);
                        })}
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">메인 타이틀 1</label>
                  <input 
                    type="text" 
                    value={localSettings.heroTitle1}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, heroTitle1: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">메인 타이틀 2 (강조)</label>
                  <input 
                    type="text" 
                    value={localSettings.heroTitle2}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, heroTitle2: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                    placeholder="하이라이트 텍스트"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">히어로 설명문</label>
                  <textarea 
                    value={localSettings.heroDescription}
                    onChange={(e) => {
                      setLocalSettings({ ...localSettings, heroDescription: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none h-32 resize-none" 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'services' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layout size={24} className="text-navy-light" /> 서비스 목록
              </h2>
              <button 
                onClick={() => setIsAddingService(!isAddingService)}
                className={`px-5 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${
                  isAddingService 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'bg-navy-primary text-white hover:bg-navy-light shadow-lg'
                }`}
              >
                {isAddingService ? '취소하기' : <><Plus size={18} /> 새 서비스 추가</>}
              </button>
            </div>

            {isAddingService && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="glass-card p-8 border-navy-light/30 border-2"
              >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-navy-light" /> 새 서비스 정보 입력
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 tracking-wider">서비스 명칭</label>
                    <input 
                      type="text" 
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      placeholder="서비스 제목을 입력하세요"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 tracking-wider">서비스 설명</label>
                    <textarea 
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      placeholder="서비스에 대한 간략한 설명을 입력하세요"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none h-24 resize-none" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setIsAddingService(false)}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white/40 hover:text-white transition-all"
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleAddService}
                    className="px-8 py-2 bg-navy-primary text-white rounded-xl text-sm font-bold hover:bg-navy-light transition-all shadow-lg"
                  >
                    추가 완료
                  </button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {localServices.map((service, index) => (
                <div key={`service-${service.id}-${index}`} className="glass-card p-8 flex flex-col lg:flex-row gap-8 relative">
                  {/* Reorder Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={() => handleMoveService(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button 
                      onClick={() => handleMoveService(index, 'down')}
                      disabled={index === services.length - 1}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                    <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">서비스 제목</label>
                        <input 
                          type="text" 
                          value={service.title}
                          onChange={(e) => {
                            const newServices = [...localServices];
                            newServices[index] = { ...service, title: e.target.value };
                            setLocalServices(newServices);
                            setIsDirty(true);
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-navy-light focus:outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">아이콘 (Lucide 코네임)</label>
                        <input 
                          type="text" 
                          value={service.icon}
                          onChange={(e) => {
                            const newServices = [...localServices];
                            newServices[index] = { ...service, icon: e.target.value };
                            setLocalServices(newServices);
                            setIsDirty(true);
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-navy-light focus:outline-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">설명</label>
                      <textarea 
                        value={service.description}
                        onChange={(e) => {
                          const newServices = [...localServices];
                          newServices[index] = { ...service, description: e.target.value };
                          setLocalServices(newServices);
                          setIsDirty(true);
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-navy-light focus:outline-none h-20 resize-none" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">상세 항목 (Features)</label>
                      <div className="space-y-2">
                        {service.features?.map((feature, fIndex) => (
                          <div key={`${service.id}-feature-${fIndex}`} className="flex gap-2">
                            <input 
                              type="text" 
                              value={feature}
                              onChange={(e) => {
                                const newServices = [...localServices];
                                const newFeatures = [...(service.features || [])];
                                newFeatures[fIndex] = e.target.value;
                                newServices[index] = { ...service, features: newFeatures };
                                setLocalServices(newServices);
                                setIsDirty(true);
                              }}
                              className="flex-grow bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-navy-light focus:outline-none" 
                            />
                            <button 
                              onClick={() => {
                                const newServices = [...localServices];
                                const newFeatures = (service.features || []).filter((_, i) => i !== fIndex);
                                newServices[index] = { ...service, features: newFeatures };
                                setLocalServices(newServices);
                                setIsDirty(true);
                              }}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-white/5"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            const newServices = [...localServices];
                            const newFeatures = [...(service.features || []), '새로운 항목'];
                            newServices[index] = { ...service, features: newFeatures };
                            setLocalServices(newServices);
                            setIsDirty(true);
                          }}
                          className="w-full py-2 bg-white/5 border border-dashed border-white/20 rounded-lg text-xs text-white/40 hover:text-white hover:border-navy-light transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={14} /> 항목 추가
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">서비스 이미지 (파일 첨부)</label>
                      <label className={`block cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white/40 group-hover:border-navy-light group-hover:text-white transition-all flex items-center gap-2">
                          <ImageIcon size={14} className={isUploading ? 'animate-pulse' : ''} /> 
                          {isUploading ? '이미지 처리 중...' : '이미지 교체하기...'}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => handleImageUpload(e, (url) => {
                            const newServices = [...localServices];
                            newServices[index] = { ...service, imageUrl: url };
                            setLocalServices(newServices);
                            setIsDirty(true);
                          })}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex lg:flex-col justify-end gap-2">
                    <button 
                      onClick={() => {
                        if (confirm('이 서비스를 삭제하시겠습니까?')) removeService(service.id);
                      }}
                      className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all hover:text-white"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'news' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText size={24} className="text-navy-light" /> 공지사항 목록
              </h2>
              <button 
                onClick={() => setIsAddingNews(!isAddingNews)}
                className={`px-5 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${
                  isAddingNews 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'bg-navy-primary text-white hover:bg-navy-light shadow-lg'
                }`}
              >
                {isAddingNews ? '취소하기' : <><Plus size={18} /> 새 글 작성하기</>}
              </button>
            </div>

            {isAddingNews && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="glass-card p-8 border-navy-light/30 border-2 mb-8"
              >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-navy-light" /> 새 공지사항 정보 입력
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 tracking-wider">제목</label>
                    <input 
                      type="text" 
                      value={newNewsTitle}
                      onChange={(e) => setNewNewsTitle(e.target.value)}
                      placeholder="공지사항 제목을 입력하세요"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 tracking-wider">카테고리</label>
                    <select 
                      value={newNewsCategory}
                      onChange={(e) => setNewNewsCategory(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none"
                    >
                      <option value="공지사항">공지사항</option>
                      <option value="뉴스">뉴스</option>
                      <option value="포트폴리오">포트폴리오</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setIsAddingNews(false)}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white/40 hover:text-white transition-all"
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleAddNews}
                    className="px-8 py-2 bg-navy-primary text-white rounded-xl text-sm font-bold hover:bg-navy-light transition-all shadow-lg"
                  >
                    작성 완료
                  </button>
                </div>
              </motion.div>
            )}

            <div className="glass-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">순서</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">카테고리</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">제목</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">작성일</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {localNews.map((post, index) => (
                    <tr key={`news-${post.id}-${index}`} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => handleMoveNews(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button 
                            onClick={() => handleMoveNews(index, 'down')}
                            disabled={index === news.length - 1}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={post.category}
                          onChange={(e) => {
                            const newNews = [...localNews];
                            newNews[index] = { ...post, category: e.target.value as any };
                            setLocalNews(newNews);
                            setIsDirty(true);
                          }}
                          className="text-xs px-2 py-1 bg-navy-primary/20 text-navy-light rounded font-bold border-none focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="공지사항">공지사항</option>
                          <option value="뉴스">뉴스</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <input 
                          type="text"
                          value={post.title}
                          onChange={(e) => {
                            const newNews = [...localNews];
                            newNews[index] = { ...post, title: e.target.value };
                            setLocalNews(newNews);
                            setIsDirty(true);
                          }}
                          className="bg-transparent border-none focus:outline-none w-full"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-white/40">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button 
                            onClick={() => {
                               if (confirm('정말로 삭제하시겠습니까?')) removeNews(post.id);
                            }}
                            className="p-2 hover:bg-red-500 rounded-lg transition-colors text-red-500 hover:text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {localNews.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-white/20 italic">
                        작성된 공지사항이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'portfolio' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layout size={24} className="text-navy-light" /> 프로젝트 목록
              </h2>
              <button 
                onClick={() => setIsAddingProject(!isAddingProject)}
                className={`px-5 py-3 rounded-xl flex items-center gap-2 font-bold transition-all ${
                  isAddingProject 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'bg-navy-primary text-white hover:bg-navy-light shadow-lg'
                }`}
              >
                {isAddingProject ? '취소하기' : <><Plus size={18} /> 프로젝트 추가하기</>}
              </button>
            </div>

            {isAddingProject && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="glass-card p-8 border-navy-light/30 border-2"
              >
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-navy-light" /> 새 프로젝트 정보 입력
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 tracking-wider">프로젝트 제목</label>
                    <input 
                      type="text" 
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="프로젝트 명칭을 입력하세요"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 tracking-wider">카테고리</label>
                    <select 
                      value={newProjectCategory}
                      onChange={(e) => setNewProjectCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none"
                    >
                      <option value="행사기획">행사기획</option>
                      <option value="방송기획">방송기획</option>
                      <option value="마케팅">마케팅</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setIsAddingProject(false)}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-white/40 hover:text-white transition-all"
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleAddProject}
                    className="px-8 py-2 bg-navy-primary text-white rounded-xl text-sm font-bold hover:bg-navy-light transition-all shadow-lg"
                  >
                    추가 완료
                  </button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item, index) => (
                <div key={`portfolio-${item.id}-${index}`} className="glass-card overflow-hidden flex flex-col relative group/card">
                  {/* Reorder Buttons */}
                  <div className="absolute top-2 left-2 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col gap-1">
                    <button 
                      onClick={() => handleMovePortfolio(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white disabled:opacity-20"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button 
                      onClick={() => handleMovePortfolio(index, 'down')}
                      disabled={index === portfolio.length - 1}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white disabled:opacity-20"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <div className="aspect-video relative overflow-hidden group">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon size={32} className="text-white/20" />
                    </div>
                  </div>
                  <div className="p-6 space-y-4 flex-grow">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">카테고리</label>
                      <input 
                        type="text" 
                        value={item.category}
                        onChange={(e) => updateItem(item.id, { category: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs focus:border-navy-light focus:outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">제목</label>
                      <input 
                        type="text" 
                        value={item.title}
                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sm focus:border-navy-light focus:outline-none font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">이미지 (파일 첨부)</label>
                      <label className={`block cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] text-white/40 group-hover:border-navy-light group-hover:text-white transition-all flex items-center gap-2">
                          <ImageIcon size={12} className={isUploading ? 'animate-pulse' : ''} /> 
                          {isUploading ? '이미지 처리 중...' : '이미지 교체하기...'}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => handleImageUpload(e, (url) => updateItem(item.id, { image: url }))}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-white/5 flex justify-end">
                    <button 
                      onClick={() => {
                        if (confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) removeItem(item.id);
                      }}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
