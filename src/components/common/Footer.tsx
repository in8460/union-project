import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin, Lightbulb } from 'lucide-react';
import { useTheme } from '@/src/context/ThemeContext';

export function Footer() {
  const { settings } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-navy-primary rounded flex items-center justify-center border border-white/20">
                <Lightbulb size={20} className="text-white fill-current" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                {settings.siteName}
              </span>
            </Link>
            <p className="text-white/50 max-w-md leading-relaxed mb-8">
              {settings.description}
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/union8460?igsh=MWY3cjZrdjM0MG56bw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-navy-primary transition-colors border border-white/10">
                <Instagram size={18} />
              </a>
              <a href="https://www.youtube.com/@유니온스튜디오" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-navy-primary transition-colors border border-white/10">
                <Youtube size={18} />
              </a>
              <a href="https://www.facebook.com/choeseongho.389429?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-navy-primary transition-colors border border-white/10">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">바로가기</h4>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-white/40 hover:text-white transition-colors text-sm">서비스 안내</Link></li>
              <li><Link to="/portfolio" className="text-white/40 hover:text-white transition-colors text-sm">포트폴리오</Link></li>
              <li><Link to="/news" className="text-white/40 hover:text-white transition-colors text-sm">공지사항</Link></li>
              <li><Link to="/contact" className="text-white/40 hover:text-white transition-colors text-sm">견적 제안 및 문의</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-white/40">
                <Phone size={16} className="text-navy-light shrink-0" />
                <span>{settings.phoneNumber}</span>
              </li>
              <li className="flex gap-3 text-sm text-white/40">
                <Mail size={16} className="text-navy-light shrink-0" />
                <span>{settings.email}</span>
              </li>
              <li className="flex gap-3 text-sm text-white/40">
                <MapPin size={16} className="text-navy-light shrink-0" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {currentYear} {settings.siteName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 hover:text-white text-xs">개인정보처리방침</a>
            <a href="#" className="text-white/30 hover:text-white text-xs">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
