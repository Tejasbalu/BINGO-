import { motion } from 'framer-motion';
import { useAudio } from '../lib/stores/useAudio';

interface BingoBoardProps {
  gameState: number[][];
  calledNumbers: number[];
  onNumberMark: (number: number) => void;
}

export default function BingoBoard({ gameState, calledNumbers, onNumberMark }: BingoBoardProps) {
  const { playHit } = useAudio();

  const handleCellClick = (number: number) => {
    if (calledNumbers.includes(number)) {
      onNumberMark(number);
      playHit();
    }
  };

  const isCellMarked = (row: number, col: number) => {
    return gameState[row] && gameState[row][col] === -1;
  };

  const isCellCallable = (number: number) => {
    return calledNumbers.includes(number);
  };

  const generateBoard = () => {
    // Generate a standard 5x5 bingo board
    const board = [];
    
    for (let row = 0; row < 5; row++) {
      const boardRow = [];
      for (let col = 0; col < 5; col++) {
        if (row === 2 && col === 2) {
          // Free space in the middle
          boardRow.push(0);
        } else {
          // Generate numbers based on column (B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75)
          const min = col * 15 + 1;
          const max = (col + 1) * 15;
          const number = Math.floor(Math.random() * (max - min + 1)) + min;
          boardRow.push(number);
        }
      }
      board.push(boardRow);
    }
    
    return board;
  };

  // Initialize board if not already set
  const board = gameState.length > 0 ? gameState : generateBoard();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* BINGO Header */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
          <div
            key={letter}
            className="bg-gradient-to-br from-red-600 to-red-800 rounded-lg h-12 flex items-center justify-center"
          >
            <span className="cartoon-font text-2xl font-bold text-white">
              {letter}
            </span>
          </div>
        ))}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-5 gap-1">
        {board.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            const isMarked = isCellMarked(rowIndex, colIndex);
            const isCallable = number !== 0 && isCellCallable(number);
            const isFreeSpace = rowIndex === 2 && colIndex === 2;

            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={{ scale: isCallable ? 1.05 : 1 }}
                whileTap={{ scale: isCallable ? 0.95 : 1 }}
                animate={{
                  backgroundColor: isMarked
                    ? '#dc2626'
                    : isCallable
                    ? '#059669'
                    : isFreeSpace
                    ? '#7c3aed'
                    : '#374151',
                }}
                onClick={() => number !== 0 && handleCellClick(number)}
                disabled={!isCallable && !isFreeSpace}
                className={`
                  aspect-square rounded-lg flex items-center justify-center
                  text-white font-bold text-lg border-2
                  transition-all duration-300
                  ${isMarked
                    ? 'border-red-400 shadow-lg shadow-red-500/50'
                    : isCallable
                    ? 'border-green-400 shadow-lg shadow-green-500/50 cursor-pointer'
                    : isFreeSpace
                    ? 'border-purple-400 shadow-lg shadow-purple-500/50'
                    : 'border-gray-600 opacity-60'
                  }
                  ${isCallable ? 'hover:shadow-xl' : ''}
                `}
              >
                {isFreeSpace ? (
                  <span className="text-sm">FREE</span>
                ) : isMarked ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                  >
                    ✓
                  </motion.span>
                ) : (
                  number
                )}
              </motion.button>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-4 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span className="text-gray-300">Called</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span className="text-gray-300">Marked</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-purple-600 rounded"></div>
          <span className="text-gray-300">Free</span>
        </div>
      </div>
    </div>
  );
}
