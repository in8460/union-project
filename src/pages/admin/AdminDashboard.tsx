import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/src/context/ThemeContext';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'settings' | 'news' | 'portfolio' | 'services' | 'home'>('settings');
  const { 
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
  } = useTheme();
  const navigate = useNavigate();

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
          ].map(item => (
            <button
              key={item.id}
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
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all"
          >
            <ExternalLink size={18} />
            사이트 바로가기
          </button>
          <button 
            onClick={() => navigate('/admin')}
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
          <button className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:bg-navy-light hover:text-white transition-all">
            <Save size={18} /> 변경사항 저장하기
          </button>
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
                    value={settings.siteName}
                    onChange={(e) => updateSettings({ siteName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">사이트 설명 (SEO)</label>
                  <input 
                    type="text" 
                    value={settings.description}
                    onChange={(e) => updateSettings({ description: e.target.value })}
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
                      value={settings.primaryColor}
                      onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                      className="h-11 w-20 bg-transparent border-none rounded cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={settings.primaryColor}
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
                    value={settings.heroBadge}
                    onChange={(e) => updateSettings({ heroBadge: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">배경 이미지 URL</label>
                  <input 
                    type="text" 
                    value={settings.heroImageUrl}
                    onChange={(e) => updateSettings({ heroImageUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">메인 타이틀 1</label>
                  <input 
                    type="text" 
                    value={settings.heroTitle1}
                    onChange={(e) => updateSettings({ heroTitle1: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">메인 타이틀 2 (강조)</label>
                  <input 
                    type="text" 
                    value={settings.heroTitle2}
                    onChange={(e) => updateSettings({ heroTitle2: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none" 
                    placeholder="하이라이트 텍스트"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-white/40 tracking-wider">히어로 설명문</label>
                  <textarea 
                    value={settings.heroDescription}
                    onChange={(e) => updateSettings({ heroDescription: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-navy-light focus:outline-none h-32 resize-none" 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'services' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  const title = prompt('서비스 제목을 입력하세요:');
                  if (title) addService({ 
                    title, 
                    description: '서비스 설명을 입력해주세요.', 
                    icon: 'Star', 
                    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80' 
                  });
                }}
                className="px-5 py-3 bg-navy-primary text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-navy-light transition-all"
              >
                <Plus size={18} /> 새 서비스 추가
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {services.map((service) => (
                <div key={service.id} className="glass-card p-8 flex flex-col lg:flex-row gap-8">
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
                          onChange={(e) => updateService(service.id, { title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-navy-light focus:outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">아이콘 (Lucide 코네임)</label>
                        <input 
                          type="text" 
                          value={service.icon}
                          onChange={(e) => updateService(service.id, { icon: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-navy-light focus:outline-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">설명</label>
                      <textarea 
                        value={service.description}
                        onChange={(e) => updateService(service.id, { description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-navy-light focus:outline-none h-20 resize-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">이미지 URL</label>
                      <input 
                        type="text" 
                        value={service.imageUrl}
                        onChange={(e) => updateService(service.id, { imageUrl: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:border-navy-light focus:outline-none" 
                      />
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
            <div className="flex justify-end mb-6">
              <button className="px-5 py-3 bg-navy-primary text-white text-sm font-bold rounded-xl flex items-center gap-2">
                <Plus size={18} /> 새 글 작성하기
              </button>
            </div>
            <div className="glass-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">카테고리</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">제목</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">작성일</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { id: 1, title: '웹사이트 리뉴얼 안내', date: '2024.04.28', cat: '공지' },
                    { id: 2, title: '2024 공채 공고', date: '2024.04.15', cat: '뉴스' },
                  ].map(post => (
                    <tr key={post.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-navy-primary/20 text-navy-light rounded font-bold">{post.cat}</span></td>
                      <td className="px-6 py-4 font-medium">{post.title}</td>
                      <td className="px-6 py-4 text-sm text-white/40">{post.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button className="p-2 hover:bg-navy-primary rounded-lg transition-colors"><Edit3 size={16} /></button>
                          <button className="p-2 hover:bg-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'portfolio' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => {
                  const title = prompt('제목을 입력하세요:');
                  if (title) addItem({ title, category: '행사기획', image: 'https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&q=80' });
                }}
                className="px-5 py-3 bg-navy-primary text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-navy-light transition-all"
              >
                <Plus size={18} /> 프로젝트 추가하기
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <div key={item.id} className="glass-card overflow-hidden group">
                  <div className="aspect-video relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={() => {
                          const newTitle = prompt('새 제목:', item.title);
                          if (newTitle) updateItem(item.id, { title: newTitle });
                        }}
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('정말로 삭제하시겠습니까?')) removeItem(item.id);
                        }}
                        className="p-3 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-full text-red-500 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-bold text-navy-light mb-2 uppercase tracking-widest">{item.category}</div>
                    <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
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
