import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Contact() {
  const { settings } = useTheme();
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const officeAddresses = [
    '경남 창원시 진해구 충장로 100번길 3, 2F',
    '서울특별시 관악구 대학14길 52, 동남빌딩 502호',
    '경남 창원시 의창구 대산면 가술리 1281-2 A동'
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('SUBMITTING');

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('https://formspree.io/f/mojyonnv', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('SUCCESS');
      } else {
        setStatus('ERROR');
      }
    } catch (err) {
      setStatus('ERROR');
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-bold mb-6"
                >
                  프로젝트의 시작, <br />
                  <span className="text-gradient">유니온이 함께합니다.</span>
                </motion.h1>
                <p className="text-white/50 text-lg">
                  구체적인 기획안이 없어도 괜찮습니다. 전문가와의 상담을 통해 
                  비전을 구체화하고 성공적인 프로젝트로 이끌어 드립니다.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-navy-primary/20 flex items-center justify-center text-navy-light shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">전화 문의</h3>
                    <p className="text-white/40 text-sm">{settings.phoneNumber}</p>
                    <p className="text-white/40 text-xs mt-1">월-금 09:00 - 18:00 (주말/공휴일 휴무)</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-navy-primary/20 flex items-center justify-center text-navy-light shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">이메일 문의</h3>
                    <p className="text-white/40 text-sm">{settings.email}</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-navy-primary/20 flex items-center justify-center text-navy-light shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">오시는 길</h3>
                    <div className="space-y-2">
                      {officeAddresses.map((addr, idx) => (
                        <p key={idx} className="text-white/40 text-sm">{addr}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 glass-card border-navy-light/30">
                <div className="flex items-center gap-4 mb-4">
                  <MessageCircle size={24} className="text-navy-light" />
                  <h4 className="font-bold">카카오톡 실시간 상담</h4>
                </div>
                <p className="text-white/40 text-sm mb-6">아래 버튼을 눌러 카카오톡 실시간 채팅 상담을 시작하세요. 정성을 다해 답변해 드리겠습니다.</p>
                <a 
                  href="https://open.kakao.com/o/siVPpssi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-[#FEE500] text-[#191919] font-bold rounded-xl hover:bg-[#FADA0A] transition-all text-center"
                >
                  채팅 시작하기
                </a>
              </div>
            </div>

            <div className="glass-card p-10 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 left-0 w-32 h-32 bg-navy-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              
              <AnimatePresence mode="wait">
                {status === 'SUCCESS' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">전송 완료!</h2>
                    <p className="text-white/50 mb-8">소중한 문의가 운영진에게 전달되었습니다.<br />담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.</p>
                    <button 
                      onClick={() => setStatus('IDLE')}
                      className="px-8 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all"
                    >
                      다시 문의하기
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h2 className="text-2xl font-bold mb-10">프로젝트 문의하기</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">성명 / 담당자명</label>
                          <input name="name" required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-navy-light focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">업체명</label>
                          <input name="company" type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-navy-light focus:outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">연락처</label>
                          <input name="phone" required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-navy-light focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">이메일</label>
                          <input name="email" required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-navy-light focus:outline-none transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">관심 플랫폼</label>
                        <select name="category" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-navy-light focus:outline-none transition-colors appearance-none">
                          <option value="행사 기획" className="bg-navy-dark">행사 기획</option>
                          <option value="방송 기획" className="bg-navy-dark">방송 기획</option>
                          <option value="행사 대행" className="bg-navy-dark">행사 대행</option>
                          <option value="기타" className="bg-navy-dark">기타</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">문의 내용</label>
                        <textarea name="message" required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-navy-light focus:outline-none transition-colors resize-none"></textarea>
                      </div>
                      
                      <button 
                        disabled={status === 'SUBMITTING'}
                        className="w-full py-5 bg-navy-primary text-white font-bold rounded-xl hover:bg-navy-light transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {status === 'SUBMITTING' ? '전송 중...' : (
                          <>
                            문의 전송하기 <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>

                      {status === 'ERROR' && (
                        <p className="text-red-500 text-sm mt-4 text-center">전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
