import { motion } from 'motion/react';
import { Calendar, Tv, Users, CheckCircle2, ChevronRight, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Services() {
  const { services } = useTheme();

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={28} /> : <Star size={28} />;
  };

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="bg-navy-dark py-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            서비스 안내
          </motion.h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            유니온기획&스튜디오는 전문적인 기획력과 최신 방송 장비, 
            그리고 숙련된 인력을 통해 최고의 결과를 만들어냅니다.
          </p>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-32">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              id={service.id}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
            >
              <div className="flex-1 w-full">
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 to-transparent" />
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="w-14 h-14 bg-navy-primary rounded-2xl flex items-center justify-center text-white mb-4">
                  {getIcon(service.icon)}
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{service.title}</h2>
                <p className="text-white/60 text-lg leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-4">
                  {service.features?.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/40">
                      <CheckCircle2 size={20} className="text-navy-light" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-32 bg-white/5 border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">프로젝트 진행 방식</h2>
            <p className="text-white/40">우리는 체계적인 단계를 거쳐 성공적인 결과를 도출합니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: '상담 및 분석', desc: '고객 요구 분석 및 목표 설정' },
              { step: '02', title: '기획 및 전략', desc: '세부 실행 계획 및 콘텐츠 기획' },
              { step: '03', title: '현장 실행', desc: '현장 운영 및 성공적인 진행' },
              { step: '04', title: '결과 리포트', desc: '성과 측정 및 파트너십 강화' }
            ].map((p, i) => (
              <div key={i} className="relative p-8 glass-card">
                <div className="text-5xl font-bold text-white/5 mb-6">{p.step}</div>
                <h3 className="text-xl font-bold mb-2 text-navy-light">{p.title}</h3>
                <p className="text-white/40 text-sm">{p.desc}</p>
                {i < 3 && <ChevronRight className="absolute -right-4 top-1/2 -translate-y-1/2 text-white/10 hidden md:block" size={32} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
