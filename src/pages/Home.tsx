import { motion } from 'motion/react';
import { ArrowRight, Calendar, Tv, Users, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

import { useTheme } from '@/src/context/ThemeContext';

export function Home() {
  const { settings, services } = useTheme();

  const getIcon = (iconName: string) => {
    // @ts-ignore
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent size={24} /> : <Star size={24} />;
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black z-10" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-10 pointer-events-none" />
          
          {/* Animated Glow Globes */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-navy-primary/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-navy-light/20 rounded-full blur-[100px] animate-pulse delay-700" />

          <motion.img
            initial={{ scale: 1.1, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            src={settings.heroImageUrl}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-4">
                <div className="w-2 h-2 bg-navy-light rounded-full animate-ping" />
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/80 uppercase">
                  {settings.heroBadge}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.95]">
                {settings.heroTitle1} <br />
                <span className="text-gradient">{settings.heroTitle2}</span>
              </h1>
              
              <div className="w-24 h-1 bg-navy-primary mx-auto mb-8 rounded-full" />

              <p className="text-lg md:text-2xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                {settings.description} <br className="hidden md:block" />
                {settings.heroDescription}
              </p>


            </motion.div>
          </div>
        </div>

      </section>

      {/* Services Overview */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Specialty</h2>
            <div className="w-20 h-1 bg-navy-primary mx-auto mb-6" />
            <p className="text-white/50 max-w-lg mx-auto">
              유니온기획&스튜디오가 제공하는 핵심 서비스 모델입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card hover:border-navy-light transition-all group overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="w-12 h-12 bg-navy-primary/20 rounded-xl flex items-center justify-center mb-6 text-navy-light group-hover:bg-navy-primary group-hover:text-white transition-colors">
                    {getIcon(service.icon)}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link to={`/services#${service.id}`} className="text-sm font-semibold text-navy-light flex items-center gap-1 group/btn">
                    자세히 보기
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Numbers/Stats */}
      <section className="py-24 bg-navy-dark border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: '누적 프로젝트', value: '500+' },
              { label: '클라이언트 만족도', value: '98%' },
              { label: '방송 제작 시간', value: '1,200h' },
              { label: '보유 인프라', value: '20+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold text-navy-light mb-2">{stat.value}</div>
                <div className="text-white/40 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star size={120} className="text-navy-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">성공적인 이벤트를 위한 파트너</h2>
          <p className="text-white/60 mb-10 text-lg">
            귀사의 상상을 현실로 만들어 드립니다. 지금 바로 전문가와 상담하세요.
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-navy-light hover:text-white transition-all shadow-xl"
          >
            프로젝트 문의하기
          </Link>
        </div>
      </section>
    </div>
  );
}
