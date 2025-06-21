import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Users, Copy, Share } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useProfile } from '../lib/stores/useProfile';
import { socket } from '../lib/socket';

import { Page } from '../App';

interface CustomRoomProps {
  onNavigate: (page: Page, config?: any) => void;
}

export default function CustomRoom({ onNavigate }: CustomRoomProps) {
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [roomCode, setRoomCode] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const { profile } = useProfile();

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode();
    setCreatedRoomCode(newRoomCode);
    
    // Emit to server to create room
    socket.emit('create-room', {
      playerId: profile.name,
      maxPlayers: maxPlayers
    });
    
    console.log('Creating room with code:', newRoomCode, 'for', maxPlayers, 'players');
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      // Emit to server to join room
      socket.emit('join-room', {
        playerId: profile.name,
        roomId: roomCode.trim().toUpperCase()
      });
      
      console.log('Joining room with code:', roomCode);
    }
  };

  useEffect(() => {
    // Listen for room creation success
    socket.on('room-created', (data) => {
      console.log('Room created successfully:', data);
      onNavigate('multiplayer', { mode: 'custom', roomCode: data.roomId, players: maxPlayers });
    });

    // Listen for successful room join
    socket.on('game-started', (data) => {
      console.log('Game started:', data);
      onNavigate('multiplayer', { mode: 'custom', roomCode: data.roomId, gameData: data });
    });

    // Listen for player joined notifications
    socket.on('player-joined', (data) => {
      console.log('Player joined room:', data);
    });

    // Listen for errors
    socket.on('error', (data) => {
      console.error('Room error:', data.message);
      alert(data.message);
    });

    return () => {
      socket.off('room-created');
      socket.off('game-started');
      socket.off('player-joined');
      socket.off('error');
    };
  }, [onNavigate, maxPlayers]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(createdRoomCode);
    // TODO: Show toast notification
  };

  const shareRoom = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my Bingo game!',
        text: `Join my Bingo room with code: ${createdRoomCode}`,
        url: window.location.href,
      });
    } else {
      copyRoomCode();
    }
  };

  if (!mode) {
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
          <h1 className="cartoon-font text-2xl font-bold">Custom Rooms</h1>
          <div className="w-12" />
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Create Room */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glossy border-white/10 bg-transparent cursor-pointer hover:border-green-400/30 transition-all"
                  onClick={() => setMode('create')}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold mb-2">Create Room</h2>
                <p className="text-gray-400">Start a private game with friends</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Join Room */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glossy border-white/10 bg-transparent cursor-pointer hover:border-blue-400/30 transition-all"
                  onClick={() => setMode('join')}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold mb-2">Join Room</h2>
                <p className="text-gray-400">Enter a room code to join friends</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(null)}
            className="glossy rounded-xl p-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="cartoon-font text-2xl font-bold">Create Room</h1>
          <div className="w-12" />
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {!createdRoomCode ? (
            <>
              {/* Room Settings */}
              <Card className="glossy border-white/10 bg-transparent">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-4">Room Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Players</label>
                      <div className="flex space-x-2">
                        {[2, 4, 6, 8].map((num) => (
                          <button
                            key={num}
                            onClick={() => setMaxPlayers(num)}
                            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                              maxPlayers === num 
                                ? 'bg-green-600 text-white' 
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Host</label>
                      <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="font-semibold">{profile.name}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleCreateRoom} className="w-full glossy-button py-4 text-lg">
                Create Room
              </Button>
            </>
          ) : (
            /* Room Created */
            <Card className="glossy border-green-400/30 bg-gradient-to-r from-green-600/20 to-green-800/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-4">Room Created!</h2>
                
                <div className="bg-black/50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-400 mb-2">Room Code</p>
                  <p className="text-3xl font-bold tracking-wider">{createdRoomCode}</p>
                </div>

                <div className="flex space-x-2 mb-6">
                  <Button onClick={copyRoomCode} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={shareRoom} variant="outline" className="flex-1">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <p className="text-gray-400 text-sm mb-6">
                  Share this code with friends to let them join your game!
                </p>

                <Button 
                  onClick={() => onNavigate('multiplayer', { mode: 'custom', roomCode: createdRoomCode, players: maxPlayers })}
                  className="w-full glossy-button"
                >
                  Start Game
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(null)}
            className="glossy rounded-xl p-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="cartoon-font text-2xl font-bold">Join Room</h1>
          <div className="w-12" />
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <Card className="glossy border-white/10 bg-transparent">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔑</div>
                <h2 className="text-xl font-bold mb-2">Enter Room Code</h2>
                <p className="text-gray-400 text-sm">
                  Ask your friend for their 6-digit room code
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="ABCD12"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="text-center text-2xl tracking-wider bg-white/10 border-white/20 h-14"
                  maxLength={6}
                />

                <Button 
                  onClick={handleJoinRoom}
                  disabled={roomCode.length !== 6}
                  className="w-full glossy-button py-4 text-lg"
                >
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Rooms */}
          <Card className="glossy border-white/10 bg-transparent">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Recent Rooms</h3>
              <div className="text-center text-gray-400">
                <p className="text-sm">No recent rooms</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
