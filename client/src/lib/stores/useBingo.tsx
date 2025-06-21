import { create } from 'zustand';

interface BingoState {
  gameState: number[][];
  markedCells: boolean[][];
  
  // Actions
  initializeGame: () => void;
  markNumber: (number: number) => boolean;
  checkWin: () => boolean;
  resetGame: () => void;
}

const generateBingoBoard = (): number[][] => {
  const board: number[][] = [];
  
  for (let row = 0; row < 5; row++) {
    const boardRow: number[] = [];
    for (let col = 0; col < 5; col++) {
      if (row === 2 && col === 2) {
        // Free space in the middle
        boardRow.push(0);
      } else {
        // Generate numbers based on column (B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75)
        const min = col * 15 + 1;
        const max = (col + 1) * 15;
        let number;
        do {
          number = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (boardRow.includes(number));
        boardRow.push(number);
      }
    }
    board.push(boardRow);
  }
  
  return board;
};

export const useBingo = create<BingoState>((set, get) => ({
  gameState: [],
  markedCells: [],
  
  initializeGame: () => {
    const newBoard = generateBingoBoard();
    const newMarkedCells = Array(5).fill(null).map(() => Array(5).fill(false));
    // Mark the free space
    newMarkedCells[2][2] = true;
    
    set({
      gameState: newBoard,
      markedCells: newMarkedCells,
    });
  },
  
  markNumber: (number: number) => {
    const { gameState, markedCells } = get();
    let found = false;
    
    const newMarkedCells = markedCells.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (gameState[rowIndex][colIndex] === number) {
          found = true;
          return true;
        }
        return cell;
      })
    );
    
    if (found) {
      set({ markedCells: newMarkedCells });
    }
    
    return found;
  },
  
  checkWin: () => {
    const { markedCells } = get();
    
    // Check rows
    for (let row = 0; row < 5; row++) {
      if (markedCells[row].every(cell => cell)) {
        return true;
      }
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
      if (markedCells.every(row => row[col])) {
        return true;
      }
    }
    
    // Check diagonals
    if (markedCells.every((row, index) => row[index])) {
      return true;
    }
    
    if (markedCells.every((row, index) => row[4 - index])) {
      return true;
    }
    
    return false;
  },
  
  resetGame: () => {
    set({
      gameState: [],
      markedCells: [],
    });
  },
}));
