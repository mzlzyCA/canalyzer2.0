'use client';

interface BottomNavigationProps {
  activeTab: 'asking' | 'dashboard' | 'analysis' | 'database' | 'settings';
  onTabChange: (tab: 'asking' | 'dashboard' | 'analysis' | 'database' | 'settings') => void;
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-3">
        <button 
          onClick={() => onTabChange('asking')}
          className={`flex flex-col items-center p-2 ${activeTab === 'asking' ? 'text-[#FFC470]' : 'text-gray-500'}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 19V20H15V19M12 2L2 7V11C2 16.5 6 21.2 12 22C18 21.2 22 16.5 22 11V7L12 2Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-xs mt-1">Asking</span>
        </button>
        <button 
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-[#FFC470]' : 'text-gray-500'}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-xs mt-1">Dashboard</span>
        </button>
        <button 
          onClick={() => onTabChange('analysis')}
          className={`flex flex-col items-center p-2 ${activeTab === 'analysis' ? 'text-[#FFC470]' : 'text-gray-500'}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H7L10 20L14 4L17 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs mt-1">Analysis</span>
        </button>
        <button 
          onClick={() => onTabChange('database')}
          className={`flex flex-col items-center p-2 ${activeTab === 'database' ? 'text-[#FFC470]' : 'text-gray-500'}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'database' ? 'currentColor' : 'none'}>
            <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4ZM8 8V16H16V8H8ZM10 10H14V14H10V10Z" stroke={activeTab === 'database' ? 'none' : 'currentColor'} strokeWidth={activeTab === 'database' ? '0' : '2'}/>
          </svg>
          <span className="text-xs mt-1">Database</span>
        </button>
        <button 
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center p-2 ${activeTab === 'settings' ? 'text-[#FFC470]' : 'text-gray-500'}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M19.4 15C19.2 15.4 19.1 15.8 19.1 16.2L21 17.5L19.5 20L17.2 19.2C16.7 19.7 16.2 20 15.6 20.3L15.2 22.7H12.2L11.8 20.3C11.2 20 10.7 19.7 10.2 19.2L7.9 20L6.4 17.5L8.3 16.2C8.3 15.8 8.2 15.4 8 15C8.2 14.6 8.3 14.2 8.3 13.8L6.4 12.5L7.9 10L10.2 10.8C10.7 10.3 11.2 10 11.8 9.7L12.2 7.3H15.2L15.6 9.7C16.2 10 16.7 10.3 17.2 10.8L19.5 10L21 12.5L19.1 13.8C19.1 14.2 19.2 14.6 19.4 15Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </div>
  );
}