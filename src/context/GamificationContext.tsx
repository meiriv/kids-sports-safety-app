import React, { createContext, useState, useContext, useEffect } from 'react';
import { Achievement, ActivitySession, Leaderboard, LeaderboardEntry } from '../types/models';
import { useAuth } from './AuthContext';

interface GamificationContextType {
  userPoints: number;
  userAchievements: Achievement[];
  currentSession: ActivitySession | null;
  personalBests: Record<string, number>;
  leaderboards: Leaderboard[];
  startActivitySession: (activityType: string) => void;
  endActivitySession: () => void;
  addPoints: (points: number, reason: string) => void;
  awardAchievement: (achievementId: string) => void;
  getLeaderboardPositions: () => Record<string, number>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [currentSession, setCurrentSession] = useState<ActivitySession | null>(null);
  const [personalBests, setPersonalBests] = useState<Record<string, number>>({});
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);

  // Mock data for leaderboards
  useEffect(() => {
    if (!currentUser) return;

    // Mock daily leaderboard
    const mockDailyLeaderboard: Leaderboard = {
      id: 'daily',
      name: 'Daily Challenge',
      period: 'daily',
      entries: Array.from({ length: 10 }, (_, index) => ({
        userId: index === 0 ? (currentUser?.id || 'user-1') : `user-${index + 1}`,
        displayName: index === 0 ? (currentUser?.displayName || 'You') : `Player ${index + 1}`,
        avatarUrl: `https://randomuser.me/api/portraits/children/${index + 1}.jpg`,
        points: 100 - (index * 8) + Math.floor(Math.random() * 5),
        rank: index + 1
      }))
    };

    // Mock weekly leaderboard
    const mockWeeklyLeaderboard: Leaderboard = {
      id: 'weekly',
      name: 'Weekly Stars',
      period: 'weekly',
      entries: Array.from({ length: 10 }, (_, index) => ({
        userId: index === 2 ? (currentUser?.id || 'user-1') : `user-${index + 10}`,
        displayName: index === 2 ? (currentUser?.displayName || 'You') : `Player ${index + 10}`,
        avatarUrl: `https://randomuser.me/api/portraits/children/${index + 10}.jpg`,
        points: 500 - (index * 45) + Math.floor(Math.random() * 20),
        rank: index + 1
      }))
    };

    setLeaderboards([mockDailyLeaderboard, mockWeeklyLeaderboard]);
  }, [currentUser]);

  const startActivitySession = (activityType: string) => {
    if (currentSession) {
      console.warn('Session already in progress, ending previous session');
      endActivitySession();
    }

    const newSession: ActivitySession = {
      id: Date.now().toString(),
      userId: currentUser?.id || 'unknown',
      activityType,
      startTime: new Date(),
      duration: 0,
      points: 0,
      formScore: 0,
      achievements: [],
      feedbackItems: []
    };

    setCurrentSession(newSession);
  };

  const endActivitySession = () => {
    if (!currentSession) return;

    const endedSession: ActivitySession = {
      ...currentSession,
      endTime: new Date(),
      duration: Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000), // duration in seconds
    };

    // In a real app, you would save this session to your backend
    console.log('Ended activity session:', endedSession);

    // Update personal bests if applicable
    if (endedSession.activityType in personalBests) {
      if (endedSession.points > personalBests[endedSession.activityType]) {
        setPersonalBests({
          ...personalBests,
          [endedSession.activityType]: endedSession.points
        });
      }
    } else {
      setPersonalBests({
        ...personalBests,
        [endedSession.activityType]: endedSession.points
      });
    }

    // Add session points to user's total
    setUserPoints(prev => prev + endedSession.points);
    
    // Reset current session
    setCurrentSession(null);
  };

  const addPoints = (points: number, reason: string) => {
    // Add points to current session if one exists
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        points: prev.points + points,
        feedbackItems: [
          ...prev.feedbackItems,
          {
            id: Date.now().toString(),
            timestamp: new Date(),
            type: 'effort',
            message: `Earned ${points} points for ${reason}`,
            severity: 'info'
          }
        ]
      } : null);
    } else {
      // Add points directly to user's total if no session is active
      setUserPoints(prev => prev + points);
    }
  };
  const awardAchievement = (achievementId: string) => {
    // This would normally fetch achievement details from a database
    // For now, we'll use mock achievements
    const mockAchievements: Record<string, Achievement> = {
      'first-session': {
        id: 'first-session',
        name: 'First Steps',
        description: 'Completed your first activity session',
        iconUrl: '/assets/achievements/star-achievement.svg',
        pointsAwarded: 50,
        dateEarned: new Date(),
        type: 'star'
      },
      'perfect-form': {
        id: 'perfect-form',
        name: 'Perfect Form',
        description: 'Achieved perfect form during an exercise',
        iconUrl: '/assets/achievements/checkmark-achievement.svg',
        pointsAwarded: 100,
        dateEarned: new Date(),
        type: 'checkmark'
      },
      'streak-3': {
        id: 'streak-3',
        name: 'On Fire',
        description: 'Completed activities 3 days in a row',
        iconUrl: '/assets/achievements/first-aid-achievement.svg',
        pointsAwarded: 150,
        dateEarned: new Date(),
        type: 'first-aid'
      }
    };

    if (achievementId in mockAchievements) {
      const achievement = mockAchievements[achievementId];
      
      // Check if already awarded
      if (userAchievements.some(a => a.id === achievementId)) {
        console.log('Achievement already awarded');
        return;
      }

      // Add achievement to user's collection
      setUserAchievements(prev => [...prev, achievement]);
      
      // Add points
      setUserPoints(prev => prev + achievement.pointsAwarded);
      
      // Add to current session if active
      if (currentSession) {
        setCurrentSession(prev => prev ? {
          ...prev,
          achievements: [...prev.achievements, achievement]
        } : null);
      }

      console.log(`Achievement awarded: ${achievement.name}`);
    } else {
      console.warn(`Unknown achievement ID: ${achievementId}`);
    }
  };

  const getLeaderboardPositions = (): Record<string, number> => {
    if (!currentUser) return {};

    const positions: Record<string, number> = {};
    
    leaderboards.forEach(board => {
      const entry = board.entries.find(e => e.userId === currentUser.id);
      if (entry) {
        positions[board.id] = entry.rank;
      }
    });

    return positions;
  };

  const value = {
    userPoints,
    userAchievements,
    currentSession,
    personalBests,
    leaderboards,
    startActivitySession,
    endActivitySession,
    addPoints,
    awardAchievement,
    getLeaderboardPositions
  };
  
  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};
