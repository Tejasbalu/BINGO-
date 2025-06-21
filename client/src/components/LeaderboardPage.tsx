import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

import { Page } from '../App';

interface LeaderboardPageProps {
  onNavigate: (page: Page) => void;
}

// Mock leaderboard data
const globalLeaderboard = [
  { rank: 1, name: 'BingoMaster', wins: 150, coins: 5000, country: 'US' },
  { rank: 2, name: 'NumbersCrusher', wins: 132, coins: 4200, country: 'UK' },
  { rank: 3, name: 'LuckyPlayer', wins: 98, coins: 3100, country: 'CA' },
  { rank: 4, name: 'BingoQueen', wins: 87, coins: 2800, country: 'AU' },
  { rank: 5, name: 'FastCaller', wins: 76, coins: 2400, country: 'DE' },
  { rank: 6, name: 'WinStreak', wins: 65, coins: 2100, country: 'FR' },
  { rank: 7, name: 'GameChanger', wins: 54, coins: 1800, country: 'JP' },
  { rank: 8, name: 'BingoStar', wins: 43, coins: 1500, country: 'BR' },
];

export default function LeaderboardPage({ onNavigate }: LeaderboardPageProps) {
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'alltime'>('alltime');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'US': '🇺🇸', 'UK': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺',
      'DE': '🇩🇪', 'FR': '🇫🇷', 'JP': '🇯🇵', 'BR': '🇧🇷'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('home')}
          className="glossy rounded-xl p-3"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
        <h1 className="cartoon-font text-2xl font-bold">Leaderboard</h1>
        <div className="w-12" /> {/* Spacer */}
      </div>

      <div className="max-w-md mx-auto">
        {/* Time Filter */}
        <div className="flex space-x-2 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeFilter('weekly')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              timeFilter === 'weekly' 
                ? 'glossy-button' 
                : 'glossy text-gray-400'
            }`}
          >
            Weekly
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeFilter('alltime')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              timeFilter === 'alltime' 
                ? 'glossy-button' 
                : 'glossy text-gray-400'
            }`}
          >
            All Time
          </motion.button>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 rounded-xl p-1">
            <TabsTrigger value="global" className="rounded-lg data-[state=active]:bg-red-600">
              Global
            </TabsTrigger>
            <TabsTrigger value="country" className="rounded-lg data-[state=active]:bg-red-600">
              Country
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-6 space-y-3">
            {globalLeaderboard.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glossy border-white/10 bg-transparent ${
                  player.rank <= 3 ? 'border-yellow-400/30' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(player.rank)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold truncate">{player.name}</p>
                          <span className="text-lg">{getCountryFlag(player.country)}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>🏆 {player.wins} wins</span>
                          <span>🪙 {player.coins}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="country" className="mt-6">
            <Card className="glossy border-white/10 bg-transparent">
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-lg font-bold mb-2">Country Rankings</h3>
                <p className="text-gray-400 text-sm">
                  Country-specific leaderboards will be available soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Your Rank */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="glossy border-blue-400/30 bg-gradient-to-r from-blue-600/20 to-blue-800/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-1">Your Current Rank</p>
                <p className="text-2xl font-bold text-blue-400">#247</p>
                <p className="text-xs text-gray-400">Keep playing to climb higher!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
