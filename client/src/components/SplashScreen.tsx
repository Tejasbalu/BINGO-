import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="text-center">
        {/* Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={showLogo ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative w-40 h-40 mx-auto mb-4">
            {/* Crown Logo */}
            <svg className="w-full h-full" viewBox="0 0 128 128" fill="none">
              {/* Crown Base */}
              <motion.path
                d="M20 85 L108 85 L98 95 L30 95 Z"
                fill="url(#goldGradientSplash)"
                animate={{ 
                  scale: [1, 1.03, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              />
              
              {/* Crown Body */}
              <motion.path
                d="M25 50 L35 85 L93 85 L103 50 L85 65 L75 45 L64 60 L53 45 L43 65 Z"
                fill="url(#crownGradientSplash)"
                animate={{ 
                  y: [0, -2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              />
              
              {/* Gems */}
              <motion.circle
                cx="64" cy="55" r="7"
                fill="#FF6B9D"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              />
              <motion.circle
                cx="45" cy="62" r="5"
                fill="#4ECDC4"
                animate={{ 
                  scale: [1, 1.3, 1],
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
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2.2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              {/* Sparkles */}
              <motion.path
                d="M30 30 L33 37 L40 40 L33 43 L30 50 L27 43 L20 40 L27 37 Z"
                fill="#FFD700"
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
                d="M95 25 L98 32 L105 35 L98 38 L95 45 L92 38 L85 35 L92 32 Z"
                fill="#FFD700"
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
                fill="#FFD700"
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.1, 0.5]
                }}
                transition={{ 
                  duration: 2.1, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1.2
                }}
              />
              
              <defs>
                <linearGradient id="goldGradientSplash" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FFA500" />
                  <stop offset="100%" stopColor="#FF8C00" />
                </linearGradient>
                <linearGradient id="crownGradientSplash" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE55C" />
                  <stop offset="50%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#DAA520" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Main Title */}
        <h1 className="cartoon-font text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Bingo
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 font-semibold mb-8">
          made by TiRRuS
        </p>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-red-600 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
