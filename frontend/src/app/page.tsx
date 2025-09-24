'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import NewsSection from '@/components/NewsSection';
import CommunitySection from '@/components/CommunitySection';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: '💬 Chat', component: <ChatInterface /> },
    { id: 'news', label: '📰 Notícias', component: <NewsSection /> },
    { id: 'community', label: '👥 Comunidade', component: <CommunitySection /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md py-4 px-6 sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#ff6ea4]">
              HallyuChat
            </h1>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-pink-600 shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="flex gap-3">
            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
              🔐 Login
            </button>
            <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg transition">
              ✨ Registrar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 min-h-[80vh]">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md py-6 text-center border-t border-white/10">
        <div className="container mx-auto">
          <p className="text-white/80">
            © 2024 HallyuChat - Conectando fãs de K-Pop ao redor do mundo 🌍
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="text-sm text-white/60">🎵 BTS</span>
            <span className="text-sm text-white/60">💖 BLACKPINK</span>
            <span className="text-sm text-white/60">✨ TWICE</span>
            <span className="text-sm text-white/60">🔥 STRAY KIDS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}