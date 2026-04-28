import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('이메일 주소 또는 비밀번호가 일치하지 않습니다.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('네트워크 연결이 불안정합니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다. (Firebase 설정 확인 필요)');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('구글 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-navy-dark/20 z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-navy-primary rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">관리자 로그인</h1>
          <p className="text-white/40 text-sm">유니온기획&스튜디오 관리 시스템</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Mail size={12} /> 이메일 주소
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-navy-light focus:outline-none transition-colors disabled:opacity-50"
              placeholder="admin@union-studio.kr"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Lock size={12} /> 비밀번호
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:border-navy-light focus:outline-none transition-colors disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-navy-primary text-white font-bold rounded-xl hover:bg-navy-light transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : <>로그인하기 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4 text-white/20">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[10px] uppercase tracking-widest">or</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full mt-6 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          구글 계정으로 로그인
        </button>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-white/30 hover:text-white text-sm transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
