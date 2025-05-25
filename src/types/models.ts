export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  photoURL?: string;
  age?: number;
  parentIds?: string[];
  friendIds?: string[];
  createdAt: Date;
  lastLogin: Date;
  provider?: 'email' | 'google' | 'facebook' | 'apple';
}

export interface Parent {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  childrenIds: string[];
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isEmergencyService?: boolean;
}

export interface ActivitySession {
  id: string;
  userId: string;
  activityType: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  points: number;
  formScore: number;
  achievements: Achievement[];
  feedbackItems: FeedbackItem[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  pointsAwarded: number;
  dateEarned: Date;
  type?: 'star' | 'checkmark' | 'first-aid';
}

export interface FeedbackItem {
  id: string;
  timestamp: Date;
  type: 'form' | 'effort' | 'safety';
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  minAge: number;
  maxAge: number;
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  motionKeypoints: MotionKeypoint[];
  voicePrompts: string[];
}

export interface MotionKeypoint {
  id: string;
  name: string;
  expectedPositions: PosePosition[];
  toleranceRange: number;
}

export interface PosePosition {
  x: number;
  y: number;
  z?: number;
  confidence: number;
}

export interface Leaderboard {
  id: string;
  name: string;
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  points: number;
  rank: number;
}

export interface EmergencyAlert {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'noMovement' | 'lostVisual' | 'abnormalPattern' | 'userInitiated';
  status: 'pending' | 'notified' | 'resolved' | 'falseAlarm';
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  heartRate?: number;
  notifiedContacts: string[];
}

// For Phase 2 - Wearable integration
export interface WearableDevice {
  id: string;
  userId: string;
  type: 'smartwatch' | 'smartring' | 'fitnesstracker';
  name: string;
  model: string;
  connected: boolean;
  lastSyncTime: Date;
  batteryLevel: number;
}

export interface BiometricReading {
  id: string;
  userId: string;
  deviceId: string;
  timestamp: Date;
  heartRate?: number;
  steps?: number;
  calories?: number;
  activity?: string;
  motionData?: {
    acceleration: { x: number, y: number, z: number },
    gyroscope?: { x: number, y: number, z: number }
  };
}
