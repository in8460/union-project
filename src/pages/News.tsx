import { motion } from 'motion/react';
import { Search, Calendar, ChevronRight, Bell } from 'lucide-react';

const newsItems = [
  { id: 1, title: '유니온기획&스튜디오 웹사이트 리뉴얼 안내', date: '2024.04.28', category: '공지사항', important: true },
  { id: 2, title: '2024년 하반기 방송 인턴 및 경력사원 채용 공고', date: '2024.04.15', category: '뉴스', important: false },
  { id: 3, title: '[보도자료] 글로벌 스타트업 페어 기획 대행사로 유니온 선정', date: '2024.04.10', category: '뉴스', important: false },
  { id: 4, title: '개인정보처리방침 개정 안내 (2024년 5월부터)', date: '2024.03.25', category: '공지사항', important: false },
  { id: 5, title: '스튜디오 촬영 설비 및 최신 방송 장비 업그레이드 완료', date: '2024.03.12', category: '뉴스', important: false },
];

export function News() {
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
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:border-navy-light focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-4">
            {newsItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group glass-card p-6 cursor-pointer hover:bg-white/10 transition-all flex items-center justify-between"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${item.important ? 'bg-red-500/20 text-red-500' : 'bg-navy-light/20 text-navy-light'}`}>
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/30 font-medium tracking-tight">
                      <Calendar size={12} /> {item.date}
                    </span>
                  </div>
                  <h3 className={`text-lg font-semibold ${item.important ? 'text-white' : 'text-white/80'} group-hover:text-navy-light transition-colors`}>
                    {item.important && <Bell size={16} className="inline mr-2 text-red-500" />}
                    {item.title}
                  </h3>
                </div>
                <ChevronRight size={24} className="text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-2" />
              </motion.div>
            ))}
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
