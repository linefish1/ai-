
import React, { useState } from 'react';
import { Article } from '../types';
import { aiService } from '../services/geminiService';

interface DiscoveryProps {
  articles: Article[];
  onBack: () => void;
  onSelect: (art: Article) => void;
}

const ProjectCardDiscovery = ({ art, onSelect }: { art: Article, onSelect: (a: Article) => void }) => {
  const [remixUrl, setRemixUrl] = useState<string | undefined>(art.aiRemixUrl);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRemix = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    try {
      const prompt = `A highly detailed, cinematic commercial shot of: "${art.title}". 8k resolution, photorealistic.`;
      const url = await aiService.generateCover(prompt);
      if (url) setRemixUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      onClick={() => onSelect(art)}
      className="group cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="aspect-video bg-gray-100 overflow-hidden relative">
          <img src={art.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
          <div className="absolute top-2 right-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#037362]">
            {art.category}
          </div>
      </div>
      
      {/* Remix Section Small Version */}
      <div className="p-3 bg-gray-50/50 border-b border-gray-100">
         {remixUrl ? (
           <div className="relative h-16 rounded overflow-hidden">
              <img src={remixUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                 <span className="text-[8px] text-white font-black uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded">AI REMIX</span>
              </div>
           </div>
         ) : (
           <button 
            onClick={handleRemix}
            disabled={isGenerating}
            className="w-full py-2 border border-dashed border-gray-300 rounded text-[9px] font-black text-gray-400 uppercase tracking-widest hover:bg-white hover:text-[#037362] transition-all"
           >
             {isGenerating ? "生成中..." : "+ AI 重构视觉"}
           </button>
         )}
      </div>

      <div className="p-4">
        <h4 className="font-bold text-base mb-1 group-hover:underline line-clamp-1">{art.title}</h4>
        <p className="text-[10px] text-gray-400 mb-3 truncate font-bold uppercase tracking-wider">by {art.author}</p>
        <div className="h-1 w-full bg-gray-100 rounded-full mb-3">
            <div className="h-full bg-[#037362]" style={{ width: `${Math.min(art.fundingPercentage || 0, 100)}%` }} />
        </div>
        <div className="flex justify-between items-center text-[10px] font-black">
            <span className="text-[#037362] uppercase">{art.fundingPercentage}% 筹得</span>
            <span className="text-gray-400 uppercase tracking-widest">{art.daysLeft} 天剩余</span>
        </div>
      </div>
    </div>
  );
};

const Discovery: React.FC<DiscoveryProps> = ({ articles, onBack, onSelect }) => {
  const [search, setSearch] = useState("");
  const categories = ['全部', '设计', '科技', '艺术', '手工', '出版'];
  const [activeCat, setActiveCat] = useState('全部');

  const filtered = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCat === '全部' || a.category === activeCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-white min-h-screen">
      <nav className="h-16 border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 bg-white/95 backdrop-blur-sm z-[110]">
        <div className="flex items-center space-x-6">
           <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
           </button>
           <h2 className="text-lg font-black tracking-tight">探索创意项目</h2>
        </div>
      </nav>

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
           <div className="relative flex-1 max-w-xl">
              <input 
                type="text"
                placeholder="搜索标题、创作者或关键字..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#037362] transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-4 top-4.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           
           <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCat === cat ? 'bg-[#037362] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {filtered.map(art => (
             <ProjectCardDiscovery key={art.id} art={art} onSelect={onSelect} />
           ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-32 text-center">
             <div className="text-4xl mb-4">🔍</div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">没有找到符合条件的项目</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
