import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShieldCheck, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export function Header() {
  const { settings } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: '홈', path: '/' },
    { name: '서비스', path: '/services' },
    { name: '포트폴리오', path: '/portfolio' },
    { name: '공지사항', path: '/news' },
    { name: '문의하기', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-black/80 backdrop-blur-lg border-bottom border-white/10 py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-navy-primary rounded-lg flex items-center justify-center border border-white/20">
            <Lightbulb className="text-white fill-current" size={24} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
            {settings.siteName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-navy-light',
                location.pathname === item.path ? 'text-white' : 'text-white/60'
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/admin"
            className="p-2 text-white/40 hover:text-white transition-colors"
            title="관리자 페이지"
          >
            <ShieldCheck size={20} />
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'text-lg font-medium py-2 border-b border-white/5',
                    location.pathname === item.path ? 'text-navy-light' : 'text-white'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/admin"
                className="text-white/40 pt-4 text-sm"
                onClick={() => setIsOpen(false)}
              >
                관리자 로그인
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
