'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import FloatingCropButton from '@/components/FloatingCropButton';
import BottomNavigation from '@/components/BottomNavigation';
import Database from '@/components/Database';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'asking' | 'dashboard' | 'analysis' | 'database' | 'settings'>('analysis');
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const handleTabChange = (tab: 'asking' | 'dashboard' | 'analysis' | 'database' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'database') {
      setIsDatabaseOpen(true);
    }
  };

  const handleScreenshotTaken = (url: string) => {
    setScreenshotUrl(url);
  };

  useEffect(() => {
    const handleNavigateToDatabase = () => {
      setActiveTab('database');
      setIsDatabaseOpen(true);
    };

    window.addEventListener('navigateToDatabase', handleNavigateToDatabase);
    return () => {
      window.removeEventListener('navigateToDatabase', handleNavigateToDatabase);
    };
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-full max-w-[430px] h-screen max-h-[932px]">
        <Image
          src="/iPhone 14 & 15 Pro Max - 3.png"
          alt="App Background"
          fill
          className="object-contain"
          priority
        />
        <FloatingCropButton onScreenshotTaken={handleScreenshotTaken} />
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      
      <Database 
        isOpen={isDatabaseOpen} 
        onClose={() => {
          setIsDatabaseOpen(false);
          setActiveTab('analysis');
        }}
        screenshotUrl={screenshotUrl}
      />
    </main>
  );
}