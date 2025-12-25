
export type HomepageSection = 
  | 'hero-featured' 
  | 'hero-recommended' 
  | 'success-stories' 
  | 'fresh-favorites' 
  | 'promos-mid'
  | 'interviews' 
  | 'taking-off' 
  | 'crowdfunding-tips' 
  | 'near-you' 
  | 'home-stretch' 
  | 'creators-corner';

export interface RemixContribution {
  id: string;
  visitorName: string;
  prompt: string;
  imageUrl: string;
  score: number;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  date: string;
  views: number;
  comments: number;
  category: string;
  tags: string[];
  coverUrl?: string;
  aiRemixUrl?: string; 
  videoUrl?: string;
  fundingGoal?: number;
  currentFunding?: number;
  daysLeft?: number;
  fundingPercentage?: number;
  location?: string;
  section?: HomepageSection;
  isFeatured?: boolean;
  remixes?: RemixContribution[]; // 新增：访问者重构的作品集
}

export type AppView = 'home' | 'discovery' | 'detail' | 'admin-dashboard' | 'admin-editor' | 'admin-articles' | 'admin-models';
