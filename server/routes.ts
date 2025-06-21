import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { BingoGameManager } from "./gameLogic";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const gameManager = new BingoGameManager(io);

  // Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('join-game', (data) => {
      gameManager.joinGame(socket, data);
    });

    socket.on('create-room', (data) => {
      gameManager.createRoom(socket, data);
    });

    socket.on('join-room', (data) => {
      gameManager.joinRoom(socket, data);
    });

    socket.on('mark-number', (data) => {
      gameManager.markNumber(socket, data);
    });

    socket.on('player-win', (data) => {
      gameManager.handleWin(socket, data);
    });

    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
      gameManager.handleDisconnect(socket);
    });
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  app.get('/api/leaderboard', async (req, res) => {
    try {
      // This would typically come from a database
      // For now, return mock data
      const leaderboard = [
        { rank: 1, name: 'BingoMaster', wins: 150, coins: 5000, country: 'US' },
        { rank: 2, name: 'NumbersCrusher', wins: 132, coins: 4200, country: 'UK' },
        { rank: 3, name: 'LuckyPlayer', wins: 98, coins: 3100, country: 'CA' },
        { rank: 4, name: 'BingoQueen', wins: 87, coins: 2800, country: 'AU' },
        { rank: 5, name: 'FastCaller', wins: 76, coins: 2400, country: 'DE' },
      ];
      
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  app.post('/api/profile', async (req, res) => {
    try {
      const { name, age } = req.body;
      
      // Validate input
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Valid name is required' });
      }
      
      if (!age || typeof age !== 'number' || age < 1 || age > 120) {
        return res.status(400).json({ error: 'Valid age is required' });
      }
      
      // In a real app, you'd save this to a database
      res.json({ success: true, profile: { name: name.trim(), age } });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  app.post('/api/refer', async (req, res) => {
    try {
      const { referralCode, newPlayerName } = req.body;
      
      if (!referralCode || !newPlayerName) {
        return res.status(400).json({ error: 'Referral code and player name are required' });
      }
      
      // In a real app, you'd check if the referral code exists and award coins
      // For now, just return success
      res.json({ 
        success: true, 
        coinsAwarded: 100,
        message: 'Referral bonus awarded!' 
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process referral' });
    }
  });

  return httpServer;
}
