import { motion } from 'motion/react';
import { ExternalLink, Tag } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

export function Portfolio() {
  const { portfolio } = useTheme();

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
            <div className="flex gap-4 mb-2">
              {['전체', '행사기획', '방송기획', '행사대행'].map(filter => (
                <button key={filter} className="text-sm px-4 py-2 rounded-full border border-white/10 hover:border-navy-light transition-all">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group relative h-[400px] rounded-3xl overflow-hidden glass-card cursor-pointer"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={14} className="text-navy-light" />
                    <span className="text-xs font-semibold text-navy-light tracking-wider uppercase">{item.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{item.title}</h3>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-navy-primary transition-colors">
                      상세보기 <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
