import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Clock, Trophy } from 'lucide-react';
import BingoBoard from './BingoBoard';
import Confetti from './Confetti';
import { useBingo } from '../lib/stores/useBingo';
import { useProfile } from '../lib/stores/useProfile';
import { socket } from '../lib/socket';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

import { Page } from '../App';

interface BingoGameProps {
  onNavigate: (page: Page) => void;
  config: any;
}

export default function BingoGame({ onNavigate, config }: BingoGameProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameTimer, setGameTimer] = useState(0);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  
  const { gameState, initializeGame, markNumber, checkWin } = useBingo();
  const { profile, updateStats } = useProfile();

  useEffect(() => {
    initializeGame();

    if (config?.mode === 'multiplayer') {
      // Join multiplayer game
      socket.emit('join-game', { 
        playerId: profile.name,
        playerCount: config.players || 4 
      });

      socket.on('game-started', (data) => {
        setPlayers(data.players);
        setGameStarted(true);
      });

      socket.on('number-called', (number) => {
        setCurrentNumber(number);
        setCalledNumbers(prev => [...prev, number]);
      });

      socket.on('player-won', (winnerData) => {
        setWinner(winnerData.player);
        setShowConfetti(true);
        if (winnerData.player === profile.name) {
          updateStats(true);
        } else {
          updateStats(false);
        }
      });
    } else if (config?.mode === 'ai') {
      // Start AI game
      setPlayers([
        { id: profile.name, name: profile.name, isAI: false },
        { id: 'ai-bot', name: 'BingoBot 🤖', isAI: true }
      ]);
      setGameStarted(true);
      startAIGame();
    }

    return () => {
      socket.off('game-started');
      socket.off('number-called');
      socket.off('player-won');
    };
  }, [config, profile.name]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !winner) {
      interval = setInterval(() => {
        setGameTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, winner]);

  const startAIGame = () => {
    let numberPool = Array.from({ length: 75 }, (_, i) => i + 1);
    
    const callNextNumber = () => {
      if (numberPool.length === 0 || winner) return;
      
      const randomIndex = Math.floor(Math.random() * numberPool.length);
      const number = numberPool.splice(randomIndex, 1)[0];
      
      setCurrentNumber(number);
      setCalledNumbers(prev => [...prev, number]);
      
      // AI has a chance to mark the number
      if (Math.random() < 0.8) {
        // AI marks the number if it has it
        setTimeout(() => {
          // Check if AI wins (simplified)
          if (Math.random() < 0.001 * calledNumbers.length) {
            setWinner('BingoBot 🤖');
            setShowConfetti(true);
            updateStats(false);
            return;
          }
        }, 1000);
      }
      
      setTimeout(callNextNumber, 3000);
    };
    
    setTimeout(callNextNumber, 2000);
  };

  const handleNumberMark = (number: number) => {
    const isMarked = markNumber(number);
    
    if (config?.mode === 'multiplayer' && isMarked) {
      // Emit to server that we marked this number
      socket.emit('mark-number', { number });
    }
    if (isMarked && calledNumbers.includes(number)) {
      const hasWon = checkWin();
      if (hasWon) {
        if (config?.mode === 'multiplayer') {
          socket.emit('player-win', { player: profile.name });
        } else {
          setWinner(profile.name);
          setShowConfetti(true);
          updateStats(true);
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 flex items-center justify-center">
        <Card className="glossy border-white/10 bg-transparent max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-4">Waiting for players...</h2>
            <p className="text-gray-400 mb-6">
              {config?.mode === 'multiplayer' 
                ? 'Finding other players to start the game'
                : 'Preparing your AI opponent'
              }
            </p>
            <Button onClick={() => onNavigate('home')} variant="outline">
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('home')}
          className="glossy rounded-xl p-3"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
        
        <div className="flex items-center space-x-4">
          <div className="glossy rounded-lg px-3 py-1 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(gameTimer)}</span>
          </div>
          
          <div className="glossy rounded-lg px-3 py-1 flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{players.length}</span>
          </div>
        </div>
      </div>

      {/* Current Number Display */}
      <motion.div
        key={currentNumber}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-center mb-6"
      >
        <div className="glossy rounded-2xl p-6 max-w-xs mx-auto">
          <p className="text-sm text-gray-400 mb-2">Current Number</p>
          <div className="text-6xl font-bold text-yellow-400 mb-2">
            {currentNumber || '?'}
          </div>
          <p className="text-sm text-gray-300">
            {calledNumbers.length} numbers called
          </p>
        </div>
      </motion.div>

      {/* Bingo Board */}
      <div className="max-w-md mx-auto mb-6">
        <BingoBoard
          gameState={gameState}
          calledNumbers={calledNumbers}
          onNumberMark={handleNumberMark}
        />
      </div>

      {/* Players List */}
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-bold mb-3 text-center">Players</h3>
        <div className="grid grid-cols-2 gap-2">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glossy rounded-lg p-3 text-center ${
                winner === player.name ? 'border-2 border-yellow-400' : ''
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {winner === player.name && <Trophy className="w-4 h-4 text-yellow-400" />}
                <span className="font-semibold truncate">{player.name}</span>
              </div>
              {player.isAI && <span className="text-xs text-gray-400">AI</span>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => onNavigate('home')}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="glossy rounded-2xl p-8 max-w-sm mx-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">
                {winner === profile.name ? '🎉' : '😔'}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {winner === profile.name ? 'BINGO!' : 'Game Over'}
              </h2>
              <p className="text-lg mb-4 text-yellow-400 font-semibold">
                {winner} wins!
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Game completed in {formatTime(gameTimer)}
              </p>
              <Button
                onClick={() => onNavigate('home')}
                className="w-full glossy-button"
              >
                Back to Home
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
