import { motion } from 'motion/react';
import { Search, Calendar, ChevronRight, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export function News() {
  const { news } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<typeof news[0] | null>(null);

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedPost) {
    return (
      <div className="pt-24 min-h-screen">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden"
            >
              {selectedPost.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="text-navy-light text-sm font-bold flex items-center gap-1 hover:underline"
                  >
                    ← 목록으로 돌아가기
                  </button>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${selectedPost.category === '공지사항' ? 'bg-navy-light/20 text-navy-light' : 'bg-white/10 text-white/60'}`}>
                    {selectedPost.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/30 font-medium tracking-tight">
                    <Calendar size={12} /> {new Date(selectedPost.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight text-white">
                  {selectedPost.title}
                </h1>

                <div className="prose prose-invert max-w-none">
                  <div className="text-white/70 leading-relaxed whitespace-pre-wrap text-lg">
                    {selectedPost.content}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-sm text-white/20">
                  <span>유니온기획&스튜디오</span>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-all font-bold"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-bold mb-4"
            >
              공지사항
            </motion.h1>
            <p className="text-white/40">유니온의 새로운 소식과 주요 공지사항을 전달합니다.</p>
          </div>

          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
            <input 
              type="text" 
              placeholder="검색어를 입력하세요..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-navy-light focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-4">
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group glass-card p-6 cursor-pointer hover:bg-white/10 transition-all flex items-center justify-between"
                onClick={() => setSelectedPost(item)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${item.category === '공지사항' ? 'bg-navy-light/20 text-navy-light' : 'bg-white/10 text-white/60'}`}>
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/30 font-medium tracking-tight">
                      <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white/80 group-hover:text-navy-light transition-colors">
                    {item.title}
                  </h3>
                </div>
                <ChevronRight size={24} className="text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-2" />
              </motion.div>
            ))}
            
            {filteredNews.length === 0 && (
              <div className="text-center py-20 text-white/20 italic">
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-center gap-2">
            {[1, 2, 3].map(page => (
              <button 
                key={page} 
                className={`w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center font-bold transition-all ${page === 1 ? 'bg-navy-primary border-navy-primary' : 'hover:bg-white/5'}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
