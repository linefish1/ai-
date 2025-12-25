
import React from 'react';
import { Article } from '../types';

interface AdminArticlesProps {
  articles: Article[];
  onEdit: (id: string) => void;
}

const AdminArticles: React.FC<AdminArticlesProps> = ({ articles, onEdit }) => {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">内容库</h2>
            <p className="text-gray-500 mt-2 font-medium">管理与维护您的所有发布文章。</p>
          </div>
          <button 
            onClick={() => onEdit('')} 
            className="bg-[#0071e3] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-[#0077ed] transition-all flex items-center justify-center"
          >
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
             撰写新文章
          </button>
      </header>

      {/* Filter Bar */}
      <div className="bg-white/50 backdrop-blur-md rounded-[20px] md:rounded-[24px] p-2 border border-gray-200 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 overflow-hidden">
          <div className="flex bg-gray-200/30 p-1 rounded-xl overflow-x-auto scrollbar-hide shrink-0">
             <button className="px-4 md:px-6 py-1.5 rounded-lg text-xs md:text-sm font-bold bg-white shadow-sm whitespace-nowrap">全部</button>
             <button className="px-4 md:px-6 py-1.5 rounded-lg text-xs md:text-sm font-bold text-gray-500 hover:text-black whitespace-nowrap">已发布</button>
             <button className="px-4 md:px-6 py-1.5 rounded-lg text-xs md:text-sm font-bold text-gray-500 hover:text-black whitespace-nowrap">草稿箱</button>
          </div>
          <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="搜索标题或标签" 
                className="bg-gray-100/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full" 
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {articles.map(article => (
          <div key={article.id} className="bg-white rounded-[20px] md:rounded-[24px] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center group hover:shadow-lg transition-all duration-300 gap-4">
            <div className="flex items-center flex-1 min-w-0">
               {article.coverUrl ? (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden mr-4 md:mr-6 shrink-0 shadow-inner bg-gray-50">
                  <img src={article.coverUrl} alt={article.title} className="w-full h-full object-cover" />
                </div>
               ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-[#f5f5f7] mr-4 md:mr-6 shrink-0 flex items-center justify-center text-gray-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
               )}
               <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-[#1d1d1f] truncate group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => onEdit(article.id)}>{article.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 md:mt-2">
                     <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">{article.category}</span>
                     <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">{article.date.split(' ')[0]}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end sm:space-x-8 px-0 sm:px-6 border-t sm:border-t-0 sm:border-l border-gray-50 pt-3 sm:pt-0">
               <div className="flex space-x-6">
                  <div className="text-center">
                     <p className="text-[9px] md:text-xs font-bold text-gray-300 uppercase mb-0.5 md:mb-1">评论</p>
                     <p className="text-sm md:text-lg font-extrabold text-[#1d1d1f]">{article.comments}</p>
                  </div>
                  <div className="text-center">
                     <p className="text-[9px] md:text-xs font-bold text-gray-300 uppercase mb-0.5 md:mb-1">阅读</p>
                     <p className="text-sm md:text-lg font-extrabold text-[#1d1d1f]">{article.views}</p>
                  </div>
               </div>

               <div className="flex items-center space-x-2 ml-4">
                  <button 
                   onClick={() => onEdit(article.id)}
                   className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 flex items-center justify-center transition-all"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center py-8 md:py-12">
        <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">已加载全部 {articles.length} 条内容</p>
      </div>
    </div>
  );
};

export default AdminArticles;
