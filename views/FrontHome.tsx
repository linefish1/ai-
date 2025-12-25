
import React, { useState } from 'react';
import { Article, HomepageSection } from '../types';
import { aiService } from '../services/geminiService';

interface FrontHomeProps {
  articles: Article[];
  onLogin: () => void;
  onSelect: (article: Article) => void;
  onExplore: () => void;
}

const ProjectCard = ({ 
  article, 
  t, 
  onSelect,
  showAvatar = false, 
  showLocation = false, 
  variant = 'default'
}: { 
  article: Article, 
  t: any, 
  onSelect: (a: Article) => void,
  showAvatar?: boolean, 
  showLocation?: boolean, 
  variant?: 'default' | 'editorial' | 'compact'
}) => {
  const [remixUrl, setRemixUrl] = useState<string | undefined>(article.aiRemixUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const fallbackUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';

  const handleRemix = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    try {
      // 模拟访问者重构，生成一个更具未来感或艺术感的变体
      const prompt = `A futuristic, hyper-realistic reinterpretation of this product: "${article.title}". Concept art style, studio lighting, clean background.`;
      const url = await aiService.generateCover(prompt);
      if (url) setRemixUrl(url);
    } catch (err) {
      console.error("AI Remix failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div 
        onClick={() => onSelect(article)}
        className="flex gap-4 group cursor-pointer animate-in fade-in duration-500 hover:bg-gray-50 p-2 rounded-lg transition-all"
      >
        <div className="w-20 h-20 shrink-0 overflow-hidden bg-gray-100 rounded-sm">
          <img src={article.coverUrl || fallbackUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <h5 className="font-bold text-[14px] leading-tight group-hover:underline mb-1 truncate">{article.title}</h5>
          <p className="text-[11px] text-[#037362] font-bold uppercase tracking-wider">{article.category}</p>
          <p className="text-[11px] text-gray-400 font-bold mt-1">剩余 {article.daysLeft} 天</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelect(article)}
      className="group cursor-pointer mb-12 animate-in fade-in duration-700"
    >
      {/* Original Image Container */}
      <div className="overflow-hidden mb-1 border border-gray-100 rounded-t-sm bg-gray-100 relative aspect-video">
        <img 
          src={article.coverUrl || fallbackUrl} 
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
          alt={article.title} 
        />
        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm">
          Original
        </div>
      </div>

      {/* AI Remix Section - Below the main image */}
      <div className="relative mb-4 bg-[#f8f9fa] border-x border-b border-gray-100 rounded-b-sm p-3 group/remix overflow-hidden">
        {remixUrl ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
             <div className="relative aspect-[21/9] rounded-sm overflow-hidden bg-gray-200">
                <img src={remixUrl} className="w-full h-full object-cover" alt="AI Remix" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#037362] text-white rounded text-[8px] font-black uppercase tracking-tighter">
                  AI Visual Remix
                </div>
             </div>
             <p className="text-[10px] text-gray-400 italic font-medium">访问者使用数用AI重构了该项目的视觉可能</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 space-y-3 border border-dashed border-gray-200 rounded-sm hover:border-[#037362]/40 transition-colors">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#037362]">
               <svg className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
               </svg>
             </div>
             <button 
              onClick={handleRemix}
              disabled={isGenerating}
              className="text-[11px] font-black text-[#037362] uppercase tracking-[0.15em] hover:scale-105 transition-transform disabled:opacity-50"
             >
               {isGenerating ? "生成创意中..." : "查看 AI 重构视图"}
             </button>
          </div>
        )}
      </div>
      
      {showAvatar && (
        <div className="flex items-center space-x-2 mb-2 px-1">
          <img src={article.authorAvatar} className="w-5 h-5 rounded-full ring-1 ring-gray-100" alt="" />
          <span className="text-[12px] font-bold text-gray-600 truncate">{article.author}</span>
        </div>
      )}
      
      <div className="px-1">
        <h5 className="font-bold text-[18px] mb-2 group-hover:underline leading-tight">{article.title}</h5>
        <div className="flex items-center text-[12px] font-bold">
          <span className="text-[#037362] mr-3">{article.fundingPercentage}% 已筹</span>
          {showLocation && <span className="text-gray-400 font-medium">📍 {article.location}</span>}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, moreText, onMore, t }: { title: string, moreText?: string, onMore?: () => void, t: any }) => (
  <div className="flex justify-between items-end mb-8 pb-3 border-b border-gray-100">
    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{title}</h3>
    {moreText && (
      <button onClick={onMore} className="text-[11px] font-black text-[#037362] hover:underline uppercase tracking-widest flex items-center">
        {moreText} <span className="ml-1 text-lg">›</span>
      </button>
    )}
  </div>
);

const FrontHome: React.FC<FrontHomeProps> = ({ articles, onLogin, onSelect, onExplore }) => {
  const [lang, setLang] = useState<'CN' | 'EN'>('CN');
  const t = (cn: string, en: string) => (lang === 'CN' ? cn : en);
  
  const getBySection = (section: HomepageSection) => articles.filter(a => a.section === section);

  const categories = [
    '设计', '科技', '游戏', '艺术', '电影', '出版', '美食', '音乐'
  ];

  return (
    <div className="bg-white min-h-screen text-[#282828]">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-[100] h-16">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <h1 className="text-xl font-black text-[#037362] tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0,0)}>KICKSTARTER</h1>
            <div className="hidden lg:flex space-x-8 text-[13px] font-bold">
              <button onClick={onExplore} className="hover:text-[#037362] transition-colors">{t("探索", "Explore")}</button>
              <button className="hover:text-[#037362] transition-colors">{t("创作者中心", "Creators")}</button>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button onClick={onExplore} className="p-2 hover:bg-gray-50 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button onClick={onLogin} className="text-[13px] font-bold hover:text-[#037362]">{t("登录", "Sign In")}</button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-8">
            <SectionHeader title={t("精选推荐", "FEATURED")} t={t} />
            {articles[0] && <ProjectCard article={articles[0]} t={t} onSelect={onSelect} showAvatar />}
          </div>
          <div className="lg:col-span-4 border-l border-gray-100 lg:pl-12">
            <SectionHeader title={t("为你推荐", "RECOMMENDED")} t={t} />
            <div className="space-y-6">
              {articles.slice(1, 5).map(art => (
                <ProjectCard key={art.id} article={art} t={t} onSelect={onSelect} variant="compact" />
              ))}
            </div>
          </div>
        </div>

        <section className="mb-20">
          <SectionHeader title={t("蓄势待发", "TAKING OFF")} moreText={t("查看全部", "See all")} t={t} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map(art => (
              <ProjectCard key={art.id} article={art} t={t} onSelect={onSelect} showLocation />
            ))}
          </div>
        </section>

        <div className="bg-[#1d1d1f] rounded-2xl p-12 text-white flex flex-col md:flex-row items-center justify-between mb-20">
           <div className="max-w-xl mb-8 md:mb-0">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#037362]">{t("数用AI 动力", "POWERED BY SHUYONG AI")}</span>
              <h3 className="text-3xl font-bold mt-4 mb-4">{t("用智能，点亮你的每一个创意。", "Ignite every idea with intelligence.")}</h3>
              <p className="text-gray-400 text-lg">{t("集成了最新的 Gemini 3.0 模型，访问者可以一键重构项目视觉，让分享更有趣。", "Integrated with Gemini 3.0, visitors can remix project visuals with one click.")}</p>
           </div>
           <button onClick={onLogin} className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl">
             {t("立即开始创作", "Start Creating")}
           </button>
        </div>

        <section className="mb-20">
          <SectionHeader title={t("按类别浏览", "CATEGORIES")} t={t} />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
             {categories.map(cat => (
               <div key={cat} className="aspect-square bg-[#FBFBFA] flex items-center justify-center rounded-xl hover:bg-[#037362] hover:text-white transition-all cursor-pointer group">
                  <span className="font-bold text-sm tracking-wide">{cat}</span>
               </div>
             ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#fbfbfa] border-t border-gray-100 py-20 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <h4 className="text-xl font-black text-[#037362] mb-4">SHUYONG AI</h4>
            <p className="text-sm text-gray-500 leading-relaxed">不仅仅是众筹，更是智能内容创作的未来。让每一个伟大的构思都能在这个时代产生回响。</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
             <div className="space-y-4">
                <h6 className="text-[11px] font-black uppercase tracking-widest text-gray-400">关于</h6>
                <ul className="text-sm font-bold space-y-2">
                  <li><a href="#" className="hover:text-[#037362]">关于我们</a></li>
                  <li><a href="#" className="hover:text-[#037362]">联系我们</a></li>
                  <li><a href="#" className="hover:text-[#037362]">隐私条款</a></li>
                </ul>
             </div>
             <div className="space-y-4">
                <h6 className="text-[11px] font-black uppercase tracking-widest text-gray-400">社交</h6>
                <ul className="text-sm font-bold space-y-2">
                  <li><a href="#" className="hover:text-[#037362]">微信</a></li>
                  <li><a href="#" className="hover:text-[#037362]">小红书</a></li>
                  <li><a href="#" className="hover:text-[#037362]">X (Twitter)</a></li>
                </ul>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FrontHome;
