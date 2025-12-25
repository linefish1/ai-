
import React, { useState } from 'react';
import { Article, RemixContribution } from '../types';
import { aiService } from '../services/geminiService';

interface ProjectDetailProps {
  article: Article;
  onBack: () => void;
  onUpdateArticle?: (updated: Article) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ article, onBack, onUpdateArticle }) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  
  // Remix State
  const [showRemixPanel, setShowRemixPanel] = useState(false);
  const [remixPrompt, setRemixPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [remixPreviewUrl, setRemixPreviewUrl] = useState<string | null>(null);
  const [isGeneratingRemix, setIsGeneratingRemix] = useState(false);
  const [remixes, setRemixes] = useState<RemixContribution[]>(article.remixes || []);

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const data = await aiService.generateMetadata(article.content);
      setAiSummary(data.summary || "无法生成摘要");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleAnalyzeImage = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = await aiService.generateVisualPrompt(article.title, article.content);
      setRemixPrompt(prompt);
      setShowRemixPanel(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateRemix = async () => {
    if (!remixPrompt) return;
    setIsGeneratingRemix(true);
    try {
      const url = await aiService.generateCover(remixPrompt);
      setRemixPreviewUrl(url);
    } finally {
      setIsGeneratingRemix(false);
    }
  };

  const handlePublishRemix = () => {
    if (!remixPreviewUrl) return;
    const newRemix: RemixContribution = {
      id: Date.now().toString(),
      visitorName: "匿名访问者_" + Math.floor(Math.random() * 1000),
      prompt: remixPrompt,
      imageUrl: remixPreviewUrl,
      score: 0,
      createdAt: new Date().toLocaleDateString()
    };
    const updatedRemixes = [newRemix, ...remixes];
    setRemixes(updatedRemixes);
    setRemixPreviewUrl(null);
    setShowRemixPanel(false);
    
    // In a real app, this would persist to the backend
    if (onUpdateArticle) {
      onUpdateArticle({ ...article, remixes: updatedRemixes });
    }
  };

  const handleVote = (id: string, delta: number) => {
    const updatedRemixes = remixes.map(r => 
      r.id === id ? { ...r, score: r.score + delta } : r
    ).sort((a, b) => b.score - a.score);
    setRemixes(updatedRemixes);
    if (onUpdateArticle) {
      onUpdateArticle({ ...article, remixes: updatedRemixes });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Detail Header */}
      <nav className="h-16 border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 bg-white/90 backdrop-blur-md z-[110]">
        <button onClick={onBack} className="text-gray-400 hover:text-black transition-colors flex items-center font-bold text-sm">
           <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
           返回
        </button>
        <div className="flex items-center space-x-4">
           <button onClick={handleAnalyzeImage} className="text-[12px] font-black text-[#037362] uppercase tracking-widest bg-[#037362]/5 px-4 py-2 rounded-full hover:bg-[#037362]/10 transition-all">
             {isAnalyzing ? "正在识别中..." : "AI 灵感重构"}
           </button>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">{article.title}</h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">{article.excerpt}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="aspect-video rounded-sm overflow-hidden bg-gray-100 mb-12 border border-gray-100 relative group">
               <img src={article.coverUrl} className="w-full h-full object-cover" alt="" />
               <button 
                onClick={handleAnalyzeImage}
                className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-sm font-black text-[#037362] uppercase tracking-widest"
               >
                 ✨ 重新构思这个设计
               </button>
            </div>

            {/* AI Summary Card */}
            <div className="bg-[#F5F5F7] p-8 rounded-2xl mb-12 border border-gray-100">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-[#037362] rounded-full flex items-center justify-center text-white font-bold">AI</div>
                     <div>
                        <h4 className="font-bold text-sm tracking-tight">数用智能内容摘要</h4>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Gemini 3.0 分析引擎</p>
                     </div>
                  </div>
                  {!aiSummary && (
                    <button onClick={handleGenerateSummary} disabled={isLoadingSummary} className="text-xs font-black text-[#037362] uppercase tracking-widest hover:underline">
                      {isLoadingSummary ? "构思中..." : "一键概括项目"}
                    </button>
                  )}
               </div>
               {aiSummary ? (
                 <p className="text-sm leading-relaxed text-gray-600 font-medium italic">"{aiSummary}"</p>
               ) : (
                 <p className="text-sm text-gray-400">项目细节过多？让 AI 帮你快速提取核心价值点。</p>
               )}
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-loose mb-20">
               <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
            </div>

            {/* Remix Interaction Panel */}
            {showRemixPanel && (
              <div className="bg-white border-2 border-[#037362] rounded-[32px] p-8 mb-12 animate-in slide-in-from-bottom-4 duration-500 shadow-2xl shadow-[#037362]/10">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-[#282828] tracking-tight">AI 视觉重构工坊</h3>
                    <button onClick={() => setShowRemixPanel(false)} className="text-gray-400 hover:text-black">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">灵感提示词 (可修改)</label>
                       <textarea 
                        value={remixPrompt}
                        onChange={(e) => setRemixPrompt(e.target.value)}
                        className="w-full h-32 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#037362] font-mono text-sm leading-relaxed"
                        placeholder="描述你心目中的新版本..."
                       />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                        onClick={handleGenerateRemix}
                        disabled={isGeneratingRemix}
                        className="flex-1 bg-[#037362] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#037362]/20 active:scale-95 transition-all"
                       >
                         {isGeneratingRemix ? "正在渲染新灵感..." : "生成重构视图"}
                       </button>
                       {remixPreviewUrl && (
                         <button 
                          onClick={handlePublishRemix}
                          className="flex-1 border-2 border-[#037362] text-[#037362] py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#037362] hover:text-white transition-all"
                         >
                           发布并分享此创意
                         </button>
                       )}
                    </div>

                    {remixPreviewUrl && (
                      <div className="mt-8 animate-in zoom-in-95 duration-500">
                         <div className="aspect-video rounded-xl overflow-hidden border-4 border-gray-50 shadow-inner">
                            <img src={remixPreviewUrl} className="w-full h-full object-cover" alt="Preview" />
                         </div>
                         <p className="mt-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">这是基于你的想法生成的全新视觉方案</p>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* Remix Gallery */}
            <section className="border-t border-gray-100 pt-16">
               <div className="flex items-end justify-between mb-12">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight mb-2">访问者灵感墙</h3>
                    <p className="text-gray-500 font-medium">看大家是如何通过 AI 重构这个创意的</p>
                  </div>
                  <span className="text-sm font-black text-gray-300 uppercase tracking-[0.2em]">{remixes.length} 个重构方案</span>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {remixes.map(remix => (
                    <div key={remix.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
                       <div className="aspect-video bg-gray-100 overflow-hidden relative">
                          <img src={remix.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                             <p className="text-white text-[10px] font-medium leading-relaxed italic line-clamp-3">"{remix.prompt}"</p>
                          </div>
                       </div>
                       <div className="p-6 flex items-center justify-between">
                          <div>
                             <p className="font-bold text-sm text-[#282828]">{remix.visitorName}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{remix.createdAt}</p>
                          </div>
                          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 space-x-3">
                             <button onClick={() => handleVote(remix.id, 1)} className="text-gray-400 hover:text-[#037362] transform active:scale-125 transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                             </button>
                             <span className="font-black text-xs text-[#037362] min-w-[20px] text-center">{remix.score}</span>
                             <button onClick={() => handleVote(remix.id, -1)} className="text-gray-400 hover:text-red-500 transform active:scale-125 transition-all">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" /></svg>
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               {remixes.length === 0 && (
                 <div className="py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">目前还没有重构灵感</p>
                    <button onClick={handleAnalyzeImage} className="text-[#037362] font-black text-sm uppercase tracking-widest hover:underline">
                      成为第一个重构者 ✨
                    </button>
                 </div>
               )}
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 border border-gray-100 rounded-sm bg-white shadow-sm">
                <div className="h-2 w-full bg-gray-100 rounded-full mb-6 overflow-hidden">
                  <div className="h-full bg-[#037362]" style={{ width: `${Math.min(article.fundingPercentage || 0, 100)}%` }} />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-black text-[#037362]">¥{article.currentFunding?.toLocaleString() || 0}</h3>
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mt-1">已筹金额，目标 ¥{article.fundingGoal?.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-black text-gray-800">{article.fundingPercentage}%</h3>
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mt-1">筹款进度</p>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-black text-gray-800">{article.daysLeft}</h3>
                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mt-1">剩余天数</p>
                  </div>

                  <button className="w-full bg-[#037362] text-white py-4 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all">
                    支持该项目
                  </button>
                </div>
              </div>

              <div className="p-6 bg-[#FBFBFA] rounded-sm">
                 <h5 className="font-bold text-sm mb-4">关于创作者</h5>
                 <div className="flex items-center space-x-4">
                    <img src={article.authorAvatar} className="w-12 h-12 rounded-full" alt="" />
                    <div>
                       <p className="font-bold text-sm">{article.author}</p>
                       <p className="text-xs text-gray-400">📍 {article.location}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
