import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, User, Trophy, Target, Percent } from 'lucide-react';
import { useProfile } from '../lib/stores/useProfile';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

import { Page } from '../App';

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { profile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    age: profile.age.toString()
  });

  const handleSave = () => {
    updateProfile({
      name: editForm.name,
      age: parseInt(editForm.age) || 18
    });
    setEditing(false);
  };

  const winRatio = profile.gamesPlayed > 0 ? (profile.wins / profile.gamesPlayed * 100).toFixed(1) : '0.0';

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
        <h1 className="cartoon-font text-2xl font-bold">Profile</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditing(!editing)}
          className="glossy rounded-xl p-3"
        >
          <Edit className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Profile Card */}
        <Card className="glossy border-white/10 bg-transparent">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-2xl">
                <User className="w-12 h-12" />
              </div>
              {editing ? (
                <div className="space-y-3">
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Enter name"
                    className="text-center bg-white/10 border-white/20"
                  />
                  <Input
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    placeholder="Enter age"
                    className="text-center bg-white/10 border-white/20"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} className="flex-1 glossy-button">
                      Save
                    </Button>
                    <Button onClick={() => setEditing(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                  <p className="text-gray-400">Age: {profile.age}</p>
                  <p className="text-sm text-yellow-400 mt-2">Level {Math.floor(profile.gamesPlayed / 10) + 1}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="glossy border-white/10 bg-transparent">
            <CardContent className="pt-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-2xl font-bold">{profile.gamesPlayed}</p>
              <p className="text-sm text-gray-400">Games Played</p>
            </CardContent>
          </Card>

          <Card className="glossy border-white/10 bg-transparent">
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <p className="text-2xl font-bold">{profile.wins}</p>
              <p className="text-sm text-gray-400">Wins</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glossy border-white/10 bg-transparent">
          <CardContent className="pt-6 text-center">
            <Percent className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-3xl font-bold">{winRatio}%</p>
            <p className="text-sm text-gray-400">Win Ratio</p>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="glossy border-white/10 bg-transparent">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4 text-center">Achievements</h3>
            <div className="space-y-3">
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${profile.gamesPlayed >= 1 ? 'bg-green-600/20' : 'bg-gray-600/20'}`}>
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold">First Game</p>
                  <p className="text-sm text-gray-400">Play your first bingo game</p>
                </div>
              </div>
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${profile.wins >= 1 ? 'bg-green-600/20' : 'bg-gray-600/20'}`}>
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-semibold">First Victory</p>
                  <p className="text-sm text-gray-400">Win your first bingo game</p>
                </div>
              </div>
              <div className={`flex items-center space-x-3 p-3 rounded-lg ${profile.wins >= 10 ? 'bg-green-600/20' : 'bg-gray-600/20'}`}>
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-semibold">Bingo Master</p>
                  <p className="text-sm text-gray-400">Win 10 bingo games</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coins Display */}
        <Card className="glossy border-yellow-400/30 bg-gradient-to-r from-yellow-600/20 to-yellow-800/20">
          <CardContent className="pt-6 text-center">
            <span className="text-4xl mb-2 block">🪙</span>
            <p className="text-3xl font-bold text-yellow-400">{profile.coins}</p>
            <p className="text-sm text-gray-300">Total Coins</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
