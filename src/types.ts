export interface SiteSettings {
  siteName: string;
  description: string;
  primaryColor: string;
  phoneNumber: string;
  email: string;
  address: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  heroImageUrl: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  features: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: '공지사항' | '뉴스' | '포트폴리오';
  imageUrl?: string;
  createdAt: number;
}

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: '유니온기획&스튜디오',
  description: '행사기획, 방송기획, 행사대행 전문 기업',
  primaryColor: '#001F3F',
  phoneNumber: '055-716-2331',
  email: 'in8460@hanmail.net',
  address: '경남 창원시 진해구 충장로 100번길 3, 2F',
  heroBadge: '프리미엄 이벤트 & 방송 에이전시',
  heroTitle1: '한계 없는',
  heroTitle2: '창의성',
  heroDescription: '우리는 압도적인 스케일과 섬세한 기획으로 보답드리겠습니다.',
  heroImageUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce6742?auto=format&fit=crop&q=100&w=2000',
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'event-planning',
    title: '행사기획',
    description: '기업 행사, 지역 축제, 프로모션 등 맞춤형 행사 기획 서비스를 제공합니다.',
    icon: 'Calendar',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80',
    features: ['업계 전문가의 맞춤형 컨설팅', '최첨단 하드웨어 인프라 지원', '철저한 리스크 관리 및 현장 운영', '성과 분석 및 사후 관리 리포트'],
  },
  {
    id: 'broadcast-planning',
    title: '방송기획',
    description: '유튜브 방송, 라이브 커머스, 스튜디오 촬영 및 영상 제작 솔루션을 제안합니다.',
    icon: 'Tv',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80',
    features: ['실시간 스트리밍 최적화 시스템', '전문 PD 및 엔지니어 매칭', '고퀄리티 스튜디오 대관 서비스', '바이럴 마케팅 연계 제작'],
  },
  {
    id: 'event-agency',
    title: '행사대행',
    description: '다각도의 인프라와 운영 노하우를 바탕으로 완벽한 행사 운영을 약속합니다.',
    icon: 'Users',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
    features: ['신속하고 정확한 인력 배치', '협력사 네트워크 통합 관리', '투명한 예산 집행 및 정산', '재난 대비 안전 가이드 준수'],
  },
];

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  { id: 1, title: '골든벨 행사기획', category: '행사기획', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80' },
  { id: 2, title: '마산 오동동 아구포 맥주축제', category: '행사기획', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80' },
  { id: 3, title: '진해 군항상권 블라썸 페스타', category: '행사대행', image: 'https://images.unsplash.com/photo-1464366442487-0b1615455541?auto=format&fit=crop&q=80' },
  { id: 4, title: 'NC 다이노스 야구장 건립 기공식', category: '행사대행', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80' },
  { id: 5, title: '성원그랜드쇼핑 고객감사 페스타', category: '행사기획', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80' },
  { id: 6, title: '남해 상주 썸머페스티벌', category: '행사대행', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80' },
];

export const INITIAL_NEWS: Post[] = [
  { id: '1', title: '유니온기획&스튜디오 웹사이트 리뉴얼 안내', content: '내용입니다.', category: '공지사항', createdAt: Date.now() - 86400000 * 2 },
  { id: '2', title: '2024년 하반기 방송 인턴 및 경력사원 채용 공고', content: '내용입니다.', category: '뉴스', createdAt: Date.now() - 86400000 * 5 },
  { id: '3', title: '[보도자료] 글로벌 스타트업 페어 기획 대행사로 유니온 선정', content: '내용입니다.', category: '뉴스', createdAt: Date.now() - 86400000 * 10 },
];
