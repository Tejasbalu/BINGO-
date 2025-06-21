import { motion } from 'framer-motion';
import { ArrowLeft, Settings, ShoppingCart, Key, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { useAudio } from '../lib/stores/useAudio';

import { Page } from '../App';

interface MenuPageProps {
  onNavigate: (page: Page) => void;
}

export default function MenuPage({ onNavigate }: MenuPageProps) {
  const [inviteCode, setInviteCode] = useState('');
  const { isMuted, toggleMute } = useAudio();

  const handleEnterCode = () => {
    if (inviteCode.trim()) {
      // TODO: Implement invite code functionality
      console.log('Entering room with code:', inviteCode);
      onNavigate('custom-room');
    }
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
        <h1 className="cartoon-font text-2xl font-bold">Menu</h1>
        <div className="w-12" /> {/* Spacer */}
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Settings Card */}
        <Card className="glossy border-white/10 bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-bold">Game Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  <span>Sound Effects</span>
                </div>
                <Switch
                  checked={!isMuted}
                  onCheckedChange={toggleMute}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span>Vibration</span>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <span>Auto-mark Numbers</span>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shop Card */}
        <Card className="glossy border-white/10 bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ShoppingCart className="w-6 h-6 text-green-400" />
              <h2 className="text-lg font-bold">Shop</h2>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🛍️</div>
              <p className="text-gray-400 text-sm mb-4">
                Customize your bingo experience with special boards and themes
              </p>
              <Button className="w-full glossy-button">
                Browse Shop
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invite Code Card */}
        <Card className="glossy border-white/10 bg-transparent">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Key className="w-6 h-6 text-purple-400" />
              <h2 className="text-lg font-bold">Enter Invite Code</h2>
            </div>
            
            <div className="space-y-3">
              <Input
                placeholder="Enter room code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="bg-white/10 border-white/20 text-center text-lg tracking-wider"
                maxLength={6}
              />
              <Button 
                onClick={handleEnterCode}
                disabled={!inviteCode.trim()}
                className="w-full glossy-button"
              >
                Join Room
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About Card */}
        <Card className="glossy border-white/10 bg-transparent">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">🎲</div>
            <h2 className="text-lg font-bold mb-2">Bingo Game</h2>
            <p className="text-gray-400 text-sm mb-2">Made by TiRRuS</p>
            <p className="text-xs text-gray-500">Version 1.0.0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
