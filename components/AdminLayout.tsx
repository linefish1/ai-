
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentView, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close sidebar on smaller screens by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'admin-dashboard', label: '控制台', icon: 'M4 6h16M4 12h16M4 18h16' },
    { id: 'admin-articles', label: '文章管理', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 2v6h6' },
    { id: 'admin-editor', label: '撰写文章', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'admin-models', label: '模型配置', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  ];

  const handleNav = (id: AppView) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f7]">
      {/* Sidebar - Desktop & Tablet */}
      <aside className={`hidden md:flex flex-col border-r border-gray-200 bg-white/80 backdrop-blur-xl transition-all duration-500 z-30 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          <span className={`${isSidebarOpen ? 'block' : 'hidden'} font-bold text-xl tracking-tight truncate`}>数用AI</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id as AppView)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${currentView === item.id ? 'bg-[#0071e3] text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <svg className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-white' : 'text-gray-400 group-hover:text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {isSidebarOpen && <span className="ml-4 font-medium text-sm whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <nav className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 space-y-2 animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between mb-8">
                 <span className="font-bold text-2xl tracking-tight">数用AI</span>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id as AppView)}
                  className={`w-full flex items-center p-4 rounded-2xl transition-all duration-200 ${currentView === item.id ? 'bg-[#0071e3] text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                  <span className="font-bold text-lg">{item.label}</span>
                </button>
              ))}
           </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-white/70 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button onClick={() => onNavigate('home')} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 flex items-center">
               <svg className="w-4 h-4 mr-1 md:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
               <span className="hidden sm:inline">前台预览</span>
            </button>
          </div>
          <div className="flex items-center space-x-3 md:space-x-5">
            <div className="text-right hidden xs:block">
                <p className="text-[13px] font-bold text-black leading-none">shuyongai</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Admin</p>
            </div>
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-[10px] md:text-xs">SA</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f5f5f7]">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
