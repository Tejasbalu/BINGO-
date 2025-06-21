export interface BingoNumber {
  value: number;
  called: boolean;
  marked: boolean;
}

export interface BingoBoard {
  id: string;
  numbers: BingoNumber[][];
  playerId: string;
}

export interface GamePlayer {
  id: string;
  name: string;
  socketId: string;
  board: BingoBoard;
  isReady: boolean;
  isWinner: boolean;
}

export interface GameRoom {
  id: string;
  players: GamePlayer[];
  maxPlayers: number;
  gameStarted: boolean;
  gameEnded: boolean;
  calledNumbers: number[];
  currentNumber: number | null;
  host: string;
  winner: string | null;
  createdAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  wins: number;
  gamesPlayed: number;
  winRate: number;
  coins: number;
  country?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gamesPlayed: number;
  wins: number;
  coins: number;
  referralCode: string;
  joinedAt: Date;
  lastActive: Date;
}

export interface GameStats {
  totalGames: number;
  totalPlayers: number;
  averageGameDuration: number;
  popularGameModes: { [mode: string]: number };
}

// Socket event types
export interface ClientToServerEvents {
  'join-game': (data: { playerId: string; playerCount: number }) => void;
  'create-room': (data: { playerId: string; maxPlayers: number }) => void;
  'join-room': (data: { playerId: string; roomId: string }) => void;
  'mark-number': (data: { number: number }) => void;
  'player-win': (data: { player: string }) => void;
  'leave-game': () => void;
}

export interface ServerToClientEvents {
  'game-started': (data: { players: GamePlayer[]; roomId: string }) => void;
  'player-joined': (data: { player: string; playerCount: number; maxPlayers: number }) => void;
  'player-left': (data: { playerCount: number; maxPlayers: number }) => void;
  'number-called': (number: number) => void;
  'player-won': (data: { player: string; gameEnded: boolean }) => void;
  'room-created': (data: { roomId: string; room: GameRoom }) => void;
  'error': (data: { message: string }) => void;
}
