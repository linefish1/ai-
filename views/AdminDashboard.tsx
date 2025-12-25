
import React from 'react';
import { Article } from '../types';

interface AdminDashboardProps {
  articles: Article[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ articles }) => {
  const stats = [
    { label: '文章总数', count: articles.length, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z', color: 'bg-blue-500' },
    { label: '今日浏览', count: 124, icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z', color: 'bg-green-500' },
    { label: '待审评论', count: 0, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'bg-orange-500' },
    { label: '系统状态', count: '稳定', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <header className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">早上好, shuyongai.</h2>
          <p className="text-gray-500 mt-2 font-medium">这是您今天的数字资产概览。</p>
      </header>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-4 md:p-6 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between h-[140px] md:h-[160px] hover:shadow-lg transition-shadow">
            <div className={`w-8 h-8 md:w-10 md:h-10 ${s.color} rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-inner`}>
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
            </div>
            <div>
                <p className="text-[10px] md:text-[13px] font-bold text-gray-400 uppercase tracking-tight">{s.label}</p>
                <p className="text-2xl md:text-3xl font-extrabold text-[#1d1d1f]">{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content Block */}
        <div className="lg:col-span-2 bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 md:mb-8">
             <h3 className="text-lg md:text-xl font-bold">系统摘要</h3>
             <button className="text-[12px] md:text-[13px] text-blue-600 font-semibold hover:underline">查看日志</button>
          </div>
          <div className="space-y-4 md:space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-2">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-semibold">Gemini AI Engine</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">LATENCY: 42ms</span>
             </div>
             <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-2">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-semibold">Database Persistence</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">MySQL 5.7.38</span>
             </div>
             <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-2">
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="text-sm font-semibold">Image Generation</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">READY</span>
             </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-[#1d1d1f] rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 transform group-hover:scale-110 transition-transform">
                <svg className="w-24 h-24 md:w-32 md:h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 relative z-10">AI 升级提醒</h3>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 relative z-10">
                您的创作助手现在支持 Gemini 3.0 Preview 模型。获得更精准的上下文理解。
            </p>
            <button className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-gray-100 transition-colors relative z-10 text-sm">
                立即解锁
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
