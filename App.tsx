
import React, { useState } from 'react';
import { AppView, Article } from './types';
import FrontHome from './views/FrontHome';
import Discovery from './views/Discovery';
import ProjectDetail from './views/ProjectDetail';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './views/AdminDashboard';
import AdminArticles from './views/AdminArticles';
import AdminEditor from './views/AdminEditor';
import AdminModels from './views/AdminModels';

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'hero-1',
    title: 'Momentum Collection: 轻量与耐用的极致平衡',
    excerpt: '专为日常通勤、周末逃离设计的全系列轻质背包。',
    content: `## 项目背景\n在城市生活中，我们需要一种既能保护昂贵电子设备，又不会给肩膀带来负担的载体。Momentum 系列应运而生。\n\n## 核心设计\n采用了创新的 X-Pac 复合面料，不仅完全防水，而且重量比传统帆布轻 30%。\n\n## AI 优化说明\n本项目由数用AI提供全方位的市场趋势分析，确保每一个设计细节都符合当代城市人的审美。`,
    author: 'ALPAKA Design',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
    date: '2025-01-01',
    views: 15400,
    comments: 89,
    category: '设计',
    tags: ['背包', '旅行'],
    coverUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    fundingGoal: 50000,
    currentFunding: 250000,
    fundingPercentage: 500,
    daysLeft: 21,
    location: '墨尔本, 澳大利亚',
    section: 'hero-featured',
    remixes: []
  },
  {
    id: 'taking-off-1',
    title: 'ZenFocus: 墨水屏智能桌面生产力中心',
    excerpt: '拒绝手机干扰，让深度工作成为一种享受。',
    content: '集成了番茄钟、待办事项和环境音效的极简桌面设备。',
    author: 'Aura Studio',
    authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AS',
    date: '2025-01-01',
    views: 8900,
    comments: 24,
    category: '科技',
    tags: ['效率', '极简'],
    coverUrl: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80',
    fundingGoal: 10000,
    currentFunding: 85600,
    fundingPercentage: 856,
    daysLeft: 28,
    location: '深圳, 中国',
    section: 'taking-off',
    remixes: []
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  const navigate = (v: AppView, artId?: string) => {
    if (artId) setSelectedArticleId(artId);
    setView(v);
    window.scrollTo(0, 0);
  };

  const handleUpdateArticle = (updated: Article) => {
    setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <FrontHome 
          articles={articles} 
          onLogin={() => navigate('admin-dashboard')} 
          onSelect={(art) => navigate('detail', art.id)}
          onExplore={() => navigate('discovery')}
        />;
      case 'discovery':
        return <Discovery 
          articles={articles} 
          onBack={() => navigate('home')} 
          onSelect={(art) => navigate('detail', art.id)}
        />;
      case 'detail':
        return selectedArticle ? (
          <ProjectDetail 
            article={selectedArticle} 
            onBack={() => navigate('home')} 
            onUpdateArticle={handleUpdateArticle}
          />
        ) : <FrontHome articles={articles} onLogin={() => navigate('admin-dashboard')} onSelect={(art) => navigate('detail', art.id)} onExplore={() => navigate('discovery')} />;
      case 'admin-dashboard':
        return (
          <AdminLayout currentView={view} onNavigate={navigate}>
            <AdminDashboard articles={articles} />
          </AdminLayout>
        );
      case 'admin-articles':
        return (
          <AdminLayout currentView={view} onNavigate={navigate}>
            <AdminArticles articles={articles} onEdit={(id) => navigate('admin-editor')} />
          </AdminLayout>
        );
      case 'admin-editor':
        return (
          <AdminLayout currentView={view} onNavigate={navigate}>
            <AdminEditor 
              onSave={(newArt) => {
                setArticles(prev => [newArt, ...prev]);
                navigate('admin-articles');
              }} 
            />
          </AdminLayout>
        );
      case 'admin-models':
        return (
          <AdminLayout currentView={view} onNavigate={navigate}>
            <AdminModels />
          </AdminLayout>
        );
      default:
        return <FrontHome articles={articles} onLogin={() => navigate('admin-dashboard')} onSelect={(art) => navigate('detail', art.id)} onExplore={() => navigate('discovery')} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};

export default App;
