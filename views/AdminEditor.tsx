
import React, { useState } from 'react';
import { Article, HomepageSection } from '../types';
import { aiService } from '../services/geminiService';

interface AdminEditorProps {
  onSave: (article: Article) => void;
}

const AdminEditor: React.FC<AdminEditorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Design');
  const [section, setSection] = useState<HomepageSection>('hero-featured');
  const [author, setAuthor] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('https://api.dicebear.com/7.x/initials/svg?seed=SA');
  const [coverUrl, setCoverUrl] = useState('');
  const [fundingGoal, setFundingGoal] = useState('10000');
  const [currentFunding, setCurrentFunding] = useState('5000');
  const [fundingPercentage, setFundingPercentage] = useState('50');
  const [daysLeft, setDaysLeft] = useState('30');
  const [location, setLocation] = useState('New York, NY');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleGenerateCover = async () => {
    if (!title) return alert("Please enter a title first");
    setIsAiLoading(true);
    try {
      const url = await aiService.generateCover(title);
      if (url) setCoverUrl(url);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!title || !content) return alert('Please fill in required fields');
    const newArticle: Article = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: content.substring(0, 100) + '...',
      author: author || 'shuyongai',
      authorAvatar,
      date: new Date().toISOString().split('T')[0],
      views: 0,
      comments: 0,
      category,
      tags: [],
      coverUrl,
      fundingGoal: parseInt(fundingGoal),
      currentFunding: parseInt(currentFunding),
      fundingPercentage: parseInt(fundingPercentage),
      daysLeft: parseInt(daysLeft),
      location,
      section
    };
    onSave(newArticle);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h2 className="text-4xl font-black text-[#282828] tracking-tight mb-2">发布新创意项目</h2>
        <p className="text-gray-500 font-medium">配置众筹项目的各个前台展示区域</p>
      </header>
      
      <div className="space-y-8 bg-white p-10 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">展示区域 (Section)</label>
            <select 
              value={section} 
              onChange={(e) => setSection(e.target.value as HomepageSection)}
              className="w-full p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-bold text-sm"
            >
              <option value="hero-featured">Hero Featured (大图推荐)</option>
              <option value="hero-recommended">Hero Recommended (侧边推荐)</option>
              <option value="success-stories">Success Stories (成功故事)</option>
              <option value="fresh-favorites">Fresh Favorites (最新最热)</option>
              <option value="interviews">Interviews (大咖访谈)</option>
              <option value="taking-off">Taking Off (蓄势待发)</option>
              <option value="crowdfunding-tips">Crowdfunding Tips (众筹秘籍)</option>
              <option value="near-you">Near You (就在身边)</option>
              <option value="home-stretch">Home Stretch (最后冲刺)</option>
              <option value="creators-corner">Creators' Corner (创作者角落)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">项目类别 (Category)</label>
            <input 
              type="text" value={category} onChange={(e) => setCategory(e.target.value)} 
              className="w-full p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-bold text-sm"
              placeholder="e.g. Design, Games, Art"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">项目标题 (Title)</label>
            <input 
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
              className="w-full p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-bold text-sm"
              placeholder="醒目的标题"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">创作者 (Creator)</label>
            <input 
              type="text" value={author} onChange={(e) => setAuthor(e.target.value)} 
              className="w-full p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-bold text-sm"
              placeholder="作者名称"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">项目详情 / 简介 (Description)</label>
          <textarea 
            value={content} onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-medium text-sm leading-relaxed"
            placeholder="描述这个创意的灵魂..."
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">已筹比例 %</label>
            <input type="number" value={fundingPercentage} onChange={(e) => setFundingPercentage(e.target.value)} className="w-full p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-bold text-sm"/>
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">剩余天数</label>
            <input type="number" value={daysLeft} onChange={(e) => setDaysLeft(e.target.value)} className="w-full p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-bold text-sm"/>
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">地理位置</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-bold text-sm"/>
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">已筹金额 (¥)</label>
            <input type="number" value={currentFunding} onChange={(e) => setCurrentFunding(e.target.value)} className="w-full p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-bold text-sm"/>
          </div>
        </div>

        <div className="space-y-6">
          <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">封面视觉 (Cover Visual)</label>
          <div className="flex gap-4">
            <input 
              type="text" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} 
              className="flex-1 p-4 bg-[#FBFBFA] rounded-xl border-none focus:ring-2 focus:ring-[#037362] font-medium text-xs"
              placeholder="图片 URL 地址"
            />
            <button 
              onClick={handleGenerateCover} 
              className="bg-[#002BBD] text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              AI 创作
            </button>
          </div>
          {coverUrl && (
            <div className="mt-6 rounded-2xl overflow-hidden border-2 border-[#FBFBFA] shadow-sm">
              <img src={coverUrl} className="w-full h-64 object-cover" alt="Preview"/>
            </div>
          )}
        </div>

        <div className="pt-6">
          <button 
            onClick={handleSubmit} 
            className="w-full bg-[#037362] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#025a4d] transition-all shadow-2xl shadow-[#037362]/30 active:scale-[0.98]"
          >
            确认并发布至首页
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isAiLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-[200] animate-in fade-in duration-300">
            <div className="flex flex-col items-center space-y-6">
                <div className="w-16 h-16 border-4 border-[#037362] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-xl text-[#282828] tracking-tight">数用智能正在构思您的视觉设计...</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditor;
