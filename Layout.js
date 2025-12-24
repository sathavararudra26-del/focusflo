import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Icon from './components/shared/Icon';

const menuItems = [
  { id: 'Home', icon: 'Calendar', label: 'home' },
  { id: 'Tasks', icon: 'CheckCircle2', label: 'tasks' },
  { id: 'Analytics', icon: 'BarChart2', label: 'analytics' },
  { id: 'Rewards', icon: 'Gift', label: 'rewards' },
  { id: 'Progress', icon: 'TrendingUp', label: 'progress' },
  { id: 'Settings', icon: 'Settings', label: 'settings' }
];

export default function Layout({ children, currentPageName }) {
  const { data: userProgress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progress = await base44.entities.UserProgress.list();
      return progress[0] || { total_xp: 0, current_level: 1, current_streak: 0 };
    }
  });

  const xp = userProgress?.total_xp || 0;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-24 lg:pb-0">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
      
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md hidden lg:block">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
              <Icon name="Zap" className="w-4 h-4 fill-white" />
            </div>
            <span className="font-bold text-neutral-900 tracking-tight text-xl">FocusFlow</span>
          </Link>

          <div className="flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={createPageUrl(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                  currentPageName === item.id
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100">
              <Icon name="Zap" className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-black text-amber-700">{xp}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors">
              <Icon name="Bell" className="w-4 h-4 text-neutral-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-neutral-100 p-2 lg:hidden">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={createPageUrl(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                currentPageName === item.id ? 'text-neutral-900' : 'text-neutral-400'
              }`}
            >
              <Icon
                name={item.icon}
                className={`w-6 h-6 transition-transform ${currentPageName === item.id ? 'scale-110' : ''}`}
              />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
