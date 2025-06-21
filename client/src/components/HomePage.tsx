import { motion } from 'framer-motion';
import { User, Trophy, Menu, Users, Home, Bot, Gift } from 'lucide-react';
import { useProfile } from '../lib/stores/useProfile';

import { Page } from '../App';

interface HomePageProps {
  onNavigate: (page: Page, config?: any) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { profile } = useProfile();

  const gameButtons = [
    {
      title: 'Multiplayer',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <motion.path
            d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.97 2.97 0 0 0 17.13 6H15c-.8 0-1.54.37-2.01.99L11 9v13h2v-6h2v6h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 1H5c-.8 0-1.54.37-2.01.99L1 10v13h2v-6h2v6h4v-6H7v-2.5l1.5-1.5z"
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      ),
      description: 'Play with friends online',
      action: () => onNavigate('multiplayer', { mode: 'multiplayer' })
    },
    {
      title: 'Custom Rooms',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <motion.path
            d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect
            x="9" y="17" width="6" height="1"
            animate={{ scaleX: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      ),
      description: 'Create or join private games',
      action: () => onNavigate('custom-room')
    },
    {
      title: 'Vs AI',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <motion.path
            d="M20 9V7l-2-2h-3l-2 2v2L8 9c-1.1 0-2 .9-2 2v9h16v-9c0-1.1-.9-2-2-2h-2zm-6 10H8v-2c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v2zm2-4H8v-2h8v2zm-2-4.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm-3 0c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="11" cy="8" r="0.5"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="13" cy="8" r="0.5"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>
      ),
      description: 'Challenge the computer',
      action: () => onNavigate('vs-ai')
    },
    {
      title: 'Refer & Earn',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <motion.path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.text
            x="12" y="8" 
            textAnchor="middle" 
            fontSize="6" 
            fill="currentColor"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            $
          </motion.text>
        </svg>
      ),
      description: 'Invite friends and earn coins',
      action: () => onNavigate('refer')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      {/* Header */}
      <div className="flex flex-col space-y-3 mb-4">
        {/* Top row with profile and leaderboard */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('profile')}
            className="flex items-center space-x-3 bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-700/30"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-black rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <motion.circle
                  cx="12" cy="7" r="4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z"
                  animate={{ y: [0, -1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">{profile.name}</p>
              <p className="text-xs text-gray-400">Level {Math.floor(profile.gamesPlayed / 10) + 1}</p>
            </div>
          </motion.button>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('leaderboard')}
              className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-3"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <motion.path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  animate={{ 
                    scale: [1, 1.15, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="12" cy="12" r="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('menu')}
              className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-3"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <motion.rect
                  x="3" y="6" width="18" height="2"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                />
                <motion.rect
                  x="3" y="11" width="18" height="2"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: [1, 0.9, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />
                <motion.rect
                  x="3" y="16" width="18" height="2"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Coins section below */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-center space-x-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-xl px-4 py-3"
        >
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <motion.circle
              cx="12" cy="12" r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.text
              x="12" y="16" 
              textAnchor="middle" 
              fontSize="8" 
              fill="currentColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              $
            </motion.text>
          </svg>
          <span className="font-bold text-yellow-400">{profile.coins}</span>
          <span className="text-gray-400 text-sm">Coins</span>
        </motion.div>
      </div>

      {/* Logo Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="relative w-36 h-36 mx-auto mb-6">
          {/* Crown Logo with White Highlights */}
          <svg className="w-full h-full" viewBox="0 0 128 128" fill="none">
            {/* Crown Base with White Border */}
            <motion.path
              d="M20 85 L108 85 L98 95 L30 95 Z"
              fill="url(#goldGradient)"
              stroke="#FFFFFF"
              strokeWidth="2"
              animate={{ 
                scale: [1, 1.03, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            />
            
            {/* Crown Body with White Outlines */}
            <motion.path
              d="M25 50 L35 85 L93 85 L103 50 L85 65 L75 45 L64 60 L53 45 L43 65 Z"
              fill="url(#crownGradient)"
              stroke="#FFFFFF"
              strokeWidth="2"
              animate={{ 
                y: [0, -2, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            />
            
            {/* Central Diamond Gem */}
            <motion.path
              d="M64 45 L70 55 L64 65 L58 55 Z"
              fill="#FFFFFF"
              stroke="#FFD700"
              strokeWidth="1"
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            />
            
            {/* Side Gems with White Centers */}
            <motion.circle
              cx="45" cy="62" r="5"
              fill="#4ECDC4"
              stroke="#FFFFFF"
              strokeWidth="1"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.circle
              cx="45" cy="62" r="2"
              fill="#FFFFFF"
              animate={{ 
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            <motion.circle
              cx="83" cy="62" r="5"
              fill="#45B7D1"
              stroke="#FFFFFF"
              strokeWidth="1"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.circle
              cx="83" cy="62" r="2"
              fill="#FFFFFF"
              animate={{ 
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
            
            {/* White Sparkles */}
            <motion.path
              d="M35 35 L37 40 L42 42 L37 44 L35 49 L33 44 L28 42 L33 40 Z"
              fill="#FFFFFF"
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.3
              }}
            />
            <motion.path
              d="M95 30 L97 35 L102 37 L97 39 L95 44 L93 39 L88 37 L93 35 Z"
              fill="#FFFFFF"
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.8
              }}
            />
            <motion.path
              d="M64 25 L66 30 L71 32 L66 34 L64 39 L62 34 L57 32 L62 30 Z"
              fill="#FFFFFF"
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 1.3, 0.5]
              }}
              transition={{ 
                duration: 2.1, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1.2
              }}
            />
            
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FF8C00" />
              </linearGradient>
              <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE55C" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#DAA520" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <motion.h1 
          className="cartoon-font text-4xl md:text-5xl font-bold mb-2 text-white"
          animate={{ 
            opacity: [1, 0.8, 1],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          BINGO
        </motion.h1>
        <p className="text-gray-400">Choose your game mode</p>
      </motion.div>

      {/* Game Mode Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {gameButtons.map((button, index) => (
          <motion.button
            key={button.title}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={button.action}
            className="bg-white text-black rounded-2xl p-6 text-left transition-all duration-300 border-2 border-white/20 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-black/20 rounded-xl p-3 text-black">
                {button.icon}
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-black">{button.title}</h3>
                <p className="text-gray-700 text-sm">{button.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>


    </div>
  );
}
