import { Server as SocketIOServer, Socket } from 'socket.io';

interface Player {
  id: string;
  name: string;
  socketId: string;
  board: number[][];
  markedCells: boolean[][];
  isReady: boolean;
}

interface GameRoom {
  id: string;
  players: Player[];
  maxPlayers: number;
  gameStarted: boolean;
  calledNumbers: number[];
  currentNumber: number | null;
  host: string;
  winner: string | null;
}

export class BingoGameManager {
  private io: SocketIOServer;
  private waitingPlayers: Socket[] = [];
  private rooms: Map<string, GameRoom> = new Map();
  private playerRooms: Map<string, string> = new Map(); // socketId -> roomId

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  generateBingoBoard(): number[][] {
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
  }

  createPlayer(socket: Socket, playerName: string): Player {
    const board = this.generateBingoBoard();
    const markedCells = Array(5).fill(null).map(() => Array(5).fill(false));
    markedCells[2][2] = true; // Mark free space

    return {
      id: playerName,
      name: playerName,
      socketId: socket.id,
      board,
      markedCells,
      isReady: false,
    };
  }

  joinGame(socket: Socket, data: { playerId: string, playerCount: number }) {
    console.log(`Player ${data.playerId} joining game for ${data.playerCount} players`);
    
    const player = this.createPlayer(socket, data.playerId);
    
    // Find or create a room
    let targetRoom: GameRoom | null = null;
    
    for (const room of this.rooms.values()) {
      if (!room.gameStarted && 
          room.players.length < room.maxPlayers && 
          room.maxPlayers === data.playerCount) {
        targetRoom = room;
        break;
      }
    }
    
    if (!targetRoom) {
      // Create new room
      const roomId = this.generateRoomId();
      targetRoom = {
        id: roomId,
        players: [],
        maxPlayers: data.playerCount,
        gameStarted: false,
        calledNumbers: [],
        currentNumber: null,
        host: data.playerId,
        winner: null,
      };
      this.rooms.set(roomId, targetRoom);
    }
    
    targetRoom.players.push(player);
    this.playerRooms.set(socket.id, targetRoom.id);
    socket.join(targetRoom.id);
    
    // Notify room about new player
    this.io.to(targetRoom.id).emit('player-joined', {
      player: player.name,
      playerCount: targetRoom.players.length,
      maxPlayers: targetRoom.maxPlayers
    });
    
    // Start game if room is full
    if (targetRoom.players.length === targetRoom.maxPlayers) {
      this.startGame(targetRoom);
    }
  }

  createRoom(socket: Socket, data: { playerId: string, maxPlayers: number }) {
    const roomId = this.generateRoomId();
    const player = this.createPlayer(socket, data.playerId);
    
    const room: GameRoom = {
      id: roomId,
      players: [player],
      maxPlayers: data.maxPlayers,
      gameStarted: false,
      calledNumbers: [],
      currentNumber: null,
      host: data.playerId,
      winner: null,
    };
    
    this.rooms.set(roomId, room);
    this.playerRooms.set(socket.id, roomId);
    socket.join(roomId);
    
    socket.emit('room-created', { roomId, room });
  }
// Diagnostic version of joinRoom for debugging "Room not found" issue
joinRoom(socket: Socket, data: { playerId: string, roomId: string }) {
  const roomIdCleaned = data.roomId.trim().toUpperCase();
  console.log('--- JOIN ROOM ATTEMPT ---');
  console.log('Requested roomId:', data.roomId);
  console.log('Cleaned roomId:', roomIdCleaned);
  console.log('Available rooms:', Array.from(this.rooms.keys()));

  const room = this.rooms.get(roomIdCleaned);

  if (!room) {
    console.log('Room NOT FOUND.');
    socket.emit('error', { message: 'Room not found' });
    return;
  }

  if (room.gameStarted) {
    socket.emit('error', { message: 'Game already started' });
    return;
  }

  if (room.players.length >= room.maxPlayers) {
    socket.emit('error', { message: 'Room is full' });
    return;
  }

  const player = this.createPlayer(socket, data.playerId);
  room.players.push(player);
  this.playerRooms.set(socket.id, room.id);
  socket.join(room.id);

  this.io.to(room.id).emit('player-joined', {
    player: player.name,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers
  });

  if (room.players.length === room.maxPlayers) {
    this.startGame(room);
  }
}
  
  startGame(room: GameRoom) {
    room.gameStarted = true;
    
    this.io.to(room.id).emit('game-started', {
      players: room.players.map(p => ({ id: p.id, name: p.name })),
      roomId: room.id
    });
    
    // Start calling numbers
    this.startNumberCalling(room);
  }

  startNumberCalling(room: GameRoom) {
    const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
    let availableNumbers = [...numbers];
    
    const callNextNumber = () => {
      if (availableNumbers.length === 0 || room.winner) {
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const number = availableNumbers.splice(randomIndex, 1)[0];
      
      room.calledNumbers.push(number);
      room.currentNumber = number;
      
      this.io.to(room.id).emit('number-called', number);
      
      // Call next number after 4 seconds
      setTimeout(callNextNumber, 4000);
    };
    
    // Start calling numbers after 3 seconds
    setTimeout(callNextNumber, 3000);
  }

  markNumber(socket: Socket, data: { number: number }) {
    const roomId = this.playerRooms.get(socket.id);
    if (!roomId) return;
    
    const room = this.rooms.get(roomId);
    if (!room || !room.gameStarted) return;
    
    const player = room.players.find(p => p.socketId === socket.id);
    if (!player) return;
    
    // Check if number was called
    if (!room.calledNumbers.includes(data.number)) return;
    
    // Mark the number on player's board
    let found = false;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (player.board[row][col] === data.number) {
          player.markedCells[row][col] = true;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    
    if (found) {
      // Check for win
      if (this.checkWin(player.markedCells)) {
        this.handleWin(socket, { player: player.name });
      }
    }
  }

  checkWin(markedCells: boolean[][]): boolean {
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
  }

  handleWin(socket: Socket, data: { player: string }) {
    const roomId = this.playerRooms.get(socket.id);
    if (!roomId) return;
    
    const room = this.rooms.get(roomId);
    if (!room || room.winner) return;
    
    room.winner = data.player;
    
    this.io.to(room.id).emit('player-won', {
      player: data.player,
      gameEnded: true
    });
    
    // Clean up room after 10 seconds
    setTimeout(() => {
      this.cleanupRoom(roomId);
    }, 10000);
  }

  handleDisconnect(socket: Socket) {
    const roomId = this.playerRooms.get(socket.id);
    if (!roomId) return;
    
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    // Remove player from room
    room.players = room.players.filter(p => p.socketId !== socket.id);
    this.playerRooms.delete(socket.id);
    
    // Notify other players
    this.io.to(roomId).emit('player-left', {
      playerCount: room.players.length,
      maxPlayers: room.maxPlayers
    });
    
    // Clean up empty rooms
    if (room.players.length === 0) {
      this.cleanupRoom(roomId);
    }
  }

  cleanupRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    // Remove all players from tracking
    room.players.forEach(player => {
      this.playerRooms.delete(player.socketId);
    });
    
    // Delete room
    this.rooms.delete(roomId);
    
    console.log(`Cleaned up room: ${roomId}`);
  }
}
