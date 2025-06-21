import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SplashScreen from './components/SplashScreen';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import LeaderboardPage from './components/LeaderboardPage';
import MenuPage from './components/MenuPage';
import BingoGame from './components/BingoGame';
import CustomRoom from './components/CustomRoom';
import ReferPage from './components/ReferPage';
import { useProfile } from './lib/stores/useProfile';
import './index.css';

const queryClient = new QueryClient();

export type Page = 'splash' | 'home' | 'profile' | 'leaderboard' | 'menu' | 'multiplayer' | 'custom-room' | 'vs-ai' | 'refer';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('splash');
  const [gameConfig, setGameConfig] = useState<any>(null);
  const { initializeProfile } = useProfile();

  useEffect(() => {
    initializeProfile();
    // Show splash for 3 seconds
    const timer = setTimeout(() => {
      setCurrentPage('home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [initializeProfile]);

  const navigateTo = (page: Page, config?: any) => {
    setCurrentPage(page);
    if (config) setGameConfig(config);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen />;
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'profile':
        return <ProfilePage onNavigate={navigateTo} />;
      case 'leaderboard':
        return <LeaderboardPage onNavigate={navigateTo} />;
      case 'menu':
        return <MenuPage onNavigate={navigateTo} />;
      case 'multiplayer':
        return <BingoGame onNavigate={navigateTo} config={gameConfig} />;
      case 'custom-room':
        return <CustomRoom onNavigate={navigateTo} />;
      case 'vs-ai':
        return <BingoGame onNavigate={navigateTo} config={{ mode: 'ai', players: 2 }} />;
      case 'refer':
        return <ReferPage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {renderCurrentPage()}
      </div>
    </QueryClientProvider>
  );
}

export default App;
