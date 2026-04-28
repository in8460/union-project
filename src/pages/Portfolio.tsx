import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

export function Portfolio() {
  const { portfolio } = useTheme();
  const [activeFilter, setActiveFilter] = useState('전체');

  const filteredPortfolio = activeFilter === '전체' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeFilter);

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-navy-light font-bold tracking-widest text-sm uppercase"
              >
                포트폴리오
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mt-4"
              >
                최고의 프로젝트가 증명하는 <br />
                <span className="text-gradient">우리의 독보적인 역량</span>
              </motion.h1>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {['전체', '행사기획', '방송기획', '마케팅'].map(filter => (
                <button 
                  key={filter} 
                  onClick={() => setActiveFilter(filter)}
                  className={`text-sm px-6 py-2.5 rounded-full border transition-all duration-300 font-bold ${
                    activeFilter === filter 
                      ? 'bg-navy-primary border-navy-primary text-white shadow-lg' 
                      : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative h-[400px] rounded-3xl overflow-hidden glass-card"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={14} className="text-navy-light" />
                      <span className="text-xs font-semibold text-navy-light tracking-wider uppercase">{item.category}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredPortfolio.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
              <p className="text-white/20 text-xl italic font-serif">해당 카테고리의 프로젝트가 아직 등록되지 않았습니다.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
