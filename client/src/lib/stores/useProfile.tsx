import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Profile {
  name: string;
  age: number;
  gamesPlayed: number;
  wins: number;
  coins: number;
  referralCode: string;
}

interface ProfileState {
  profile: Profile;
  
  // Actions
  initializeProfile: () => void;
  updateProfile: (updates: Partial<Profile>) => void;
  updateStats: (won: boolean) => void;
  addCoins: (amount: number) => void;
}

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const useProfile = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: {
        name: 'Player',
        age: 18,
        gamesPlayed: 0,
        wins: 0,
        coins: 100,
        referralCode: generateReferralCode(),
      },
      
      initializeProfile: () => {
        const { profile } = get();
        if (!profile.referralCode) {
          set({
            profile: {
              ...profile,
              referralCode: generateReferralCode(),
            }
          });
        }
      },
      
      updateProfile: (updates) => {
        const { profile } = get();
        set({
          profile: { ...profile, ...updates }
        });
      },
      
      updateStats: (won) => {
        const { profile } = get();
        const coinsEarned = won ? 50 : 10; // Win bonus vs participation
        
        set({
          profile: {
            ...profile,
            gamesPlayed: profile.gamesPlayed + 1,
            wins: won ? profile.wins + 1 : profile.wins,
            coins: profile.coins + coinsEarned,
          }
        });
      },
      
      addCoins: (amount) => {
        const { profile } = get();
        set({
          profile: {
            ...profile,
            coins: profile.coins + amount,
          }
        });
      },
    }),
    {
      name: 'bingo-profile',
    }
  )
);
