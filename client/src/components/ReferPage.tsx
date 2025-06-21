import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Copy, Share, MessageCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useProfile } from '../lib/stores/useProfile';

import { Page } from '../App';

interface ReferPageProps {
  onNavigate: (page: Page) => void;
}

export default function ReferPage({ onNavigate }: ReferPageProps) {
  const { profile } = useProfile();
  const [copied, setCopied] = useState(false);
  
  // Generate unique invite code based on profile
  const inviteCode = `BINGO${profile.name.slice(0, 2).toUpperCase()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  const inviteMessage = `🎲 Join me for a fun Bingo game! Use my invite code: ${inviteCode} 
Download the game and let's play together! 🎯`;

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
    window.open(url, '_blank');
  };

  const shareViaTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent('Download Bingo Game')}&text=${encodeURIComponent(inviteMessage)}`;
    window.open(url, '_blank');
  };

  const shareGeneric = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my Bingo game!',
        text: inviteMessage,
        url: window.location.href,
      });
    } else {
      copyInviteCode();
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
        <h1 className="cartoon-font text-2xl font-bold">Refer & Earn</h1>
        <div className="w-12" />
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Invite Code Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glossy border-yellow-400/30 bg-gradient-to-r from-yellow-600/20 to-yellow-800/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h2 className="text-xl font-bold mb-2">Your Invite Code</h2>
              
              <div className="bg-black/50 rounded-xl p-4 mb-4">
                <p className="text-2xl font-bold tracking-wider text-yellow-400">
                  {inviteCode}
                </p>
              </div>

              <Button 
                onClick={copyInviteCode}
                className={`w-full transition-all ${copied ? 'bg-green-600' : 'glossy-button'}`}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="glossy border-white/10 bg-transparent">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 text-center">How it Works</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-semibold">Share your code</p>
                    <p className="text-gray-400 text-sm">Send your invite code to friends</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-semibold">Friend joins & plays</p>
                    <p className="text-gray-400 text-sm">They use your code and play their first game</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-semibold">Both earn rewards</p>
                    <p className="text-gray-400 text-sm">You both get 100 coins!</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Share Options */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="glossy border-white/10 bg-transparent">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 text-center">Share with Friends</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={shareViaWhatsApp}
                  className="flex flex-col space-y-2 p-4 h-auto bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-xs">WhatsApp</span>
                </Button>
                
                <Button
                  onClick={shareViaTelegram}
                  className="flex flex-col space-y-2 p-4 h-auto bg-blue-600 hover:bg-blue-700"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-xs">Telegram</span>
                </Button>
                
                <Button
                  onClick={shareGeneric}
                  className="flex flex-col space-y-2 p-4 h-auto glossy-button"
                >
                  <Share className="w-6 h-6" />
                  <span className="text-xs">More</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="glossy border-white/10 bg-transparent">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 text-center">Your Referral Stats</h3>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">0</p>
                  <p className="text-sm text-gray-400">Friends Referred</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">0</p>
                  <p className="text-sm text-gray-400">Coins Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Card className="glossy border-white/10 bg-transparent">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                ⚡ Rewards are credited when your friend completes their first game. 
                Each friend can only be referred once. Fair play rules apply.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
