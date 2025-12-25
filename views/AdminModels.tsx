
import React, { useState } from 'react';

interface ModelConfig {
    id: string;
    name: string;
    provider: string;
    isActive: boolean;
    apiKey: string;
    baseUrl: string;
    version: string;
    description: string;
}

const DOMESTIC_MODELS: ModelConfig[] = [
    { id: 'deepseek', name: 'DeepSeek-V3', provider: 'DeepSeek', isActive: true, apiKey: 'sk-••••••••••••', baseUrl: 'https://api.deepseek.com', version: 'v3', description: '国产大模型之光，极高性价比与推理能力。' },
    { id: 'qwen', name: '通义千问 Qwen-Max', provider: 'Alibaba Cloud', isActive: false, apiKey: '', baseUrl: 'https://dashscope.aliyuncs.com/api/v1', version: 'max-latest', description: '阿里通义千问旗舰模型，多模态能力出众。' },
    { id: 'baichuan', name: '百川 Baichuan-4', provider: 'Baichuan AI', isActive: false, apiKey: '', baseUrl: 'https://api.baichuan-ai.com/v1', version: 'baichuan4', description: '深耕中文语境，医疗与常识问答表现优异。' },
];

const INTERNATIONAL_MODELS: ModelConfig[] = [
    { id: 'gemini', name: 'Gemini 3.0 Pro', provider: 'Google', isActive: true, apiKey: 'AIza••••••••••••', baseUrl: 'Native SDK', version: '3.0-preview', description: '谷歌原生多模态大模型，长文本处理专家。' },
    { id: 'gpt4', name: 'GPT-4o', provider: 'OpenAI', isActive: true, apiKey: 'sk-proj-••••••••••••', baseUrl: 'https://api.openai.com/v1', version: 'gpt-4o-2024-08-06', description: '全球大模型标杆，全能型智慧引擎。' },
    { id: 'claude', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', isActive: false, apiKey: '', baseUrl: 'https://api.anthropic.com/v1', version: 'claude-3-5-sonnet-20240620', description: '更具人性化的语言风格，代码编写能力卓越。' },
];

const AdminModels: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
    const [configs, setConfigs] = useState([...DOMESTIC_MODELS, ...INTERNATIONAL_MODELS]);

    const toggleStatus = (id: string) => {
        setConfigs(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    };

    const currentModels = activeTab === 'domestic' 
        ? configs.filter(c => DOMESTIC_MODELS.some(d => d.id === c.id))
        : configs.filter(c => INTERNATIONAL_MODELS.some(i => i.id === c.id));

    return (
        <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">模型引擎配置</h2>
                    <p className="text-gray-500 mt-2 font-medium">管理为您提供智能服务的底层 AI 动力源。</p>
                </div>
                
                {/* Segmented Control */}
                <div className="bg-gray-200/50 p-1 rounded-xl flex items-center self-start overflow-hidden shrink-0">
                    <button 
                        onClick={() => setActiveTab('domestic')}
                        className={`px-4 md:px-6 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'domestic' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        国内模型
                    </button>
                    <button 
                        onClick={() => setActiveTab('international')}
                        className={`px-4 md:px-6 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === 'international' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        国外模型
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {currentModels.map(model => (
                    <div key={model.id} className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-5 md:mb-6">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-inner ${model.isActive ? 'bg-gradient-to-tr from-blue-600 to-indigo-500' : 'bg-gray-200 text-gray-400'}`}>
                                    {model.provider[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm md:text-base text-[#1d1d1f] leading-tight truncate max-w-[120px] md:max-w-none">{model.name}</h3>
                                    <p className="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase tracking-wider">{model.provider}</p>
                                </div>
                            </div>
                            {/* iOS Style Toggle */}
                            <button 
                                onClick={() => toggleStatus(model.id)}
                                className={`w-10 h-6 rounded-full relative transition-colors duration-300 flex items-center px-1 shrink-0 ${model.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${model.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                            {model.description}
                        </p>

                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase block mb-1">API Key</label>
                                <div className="relative group/key">
                                    <input 
                                        type="password" 
                                        value={model.apiKey} 
                                        readOnly
                                        className="w-full bg-[#f5f5f7] border-none rounded-xl p-2.5 text-[12px] md:text-[13px] font-mono focus:ring-0 outline-none" 
                                        placeholder="未设置密钥"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase block mb-1">Endpoint / Version</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        value={model.baseUrl} 
                                        readOnly
                                        className="flex-1 bg-[#f5f5f7] border-none rounded-xl p-2.5 text-[10px] md:text-[12px] truncate outline-none" 
                                    />
                                    <div className="bg-gray-100 text-gray-500 px-2 md:px-3 py-2.5 rounded-xl text-[9px] md:text-[10px] font-bold flex items-center whitespace-nowrap">
                                        {model.version}
                                    </div>
                                </div>
                            </div>
                            
                            <button className="w-full text-[11px] md:text-xs font-bold text-blue-600 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>测试连接</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Settings Block */}
            <div className="bg-[#1d1d1f] rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 text-center lg:text-left">
                    <h3 className="text-lg md:text-xl font-bold">智能调度设置</h3>
                    <p className="text-gray-400 text-xs md:text-sm">启用自动模型切换，当主模型响应延迟超过 2s 时自动切换至备选方案。</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0 w-full lg:w-auto">
                    <button className="bg-white/10 text-white px-6 py-3 rounded-2xl font-bold hover:bg-white/20 transition-all text-xs md:text-sm">配置备选列表</button>
                    <button className="bg-[#0071e3] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#0077ed] transition-all text-xs md:text-sm shadow-lg shadow-blue-500/20">保存全局设置</button>
                </div>
            </div>
        </div>
    );
};

export default AdminModels;
