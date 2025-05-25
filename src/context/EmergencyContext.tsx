import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { EmergencyAlert, EmergencyContact } from '../types/models';
import { useMotion } from './MotionContext';

interface EmergencyContextType {
  emergencyMode: boolean;
  countdownActive: boolean;
  countdownSeconds: number;
  activeAlert: EmergencyAlert | null;
  emergencyContacts: EmergencyContact[];
  setEmergencyContacts: (contacts: EmergencyContact[]) => void;
  triggerEmergency: (type: 'noMovement' | 'lostVisual' | 'abnormalPattern' | 'userInitiated') => void;
  cancelEmergency: () => void;
  resolveEmergency: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const useEmergency = (): EmergencyContextType => {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emergencyMode, setEmergencyMode] = useState<boolean>(false);
  const [countdownActive, setCountdownActive] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(10);
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  
  const countdownRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { isTracking } = useMotion();
  
  // Initialize audio for emergency alerts
  useEffect(() => {
    audioRef.current = new Audio('/emergency-alarm.mp3');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (countdownRef.current) {
        window.clearInterval(countdownRef.current);
      }
    };
  }, []);
  
  // Monitor poses for emergency situations when tracking is active
  useEffect(() => {
    if (!isTracking || emergencyMode) return;
    
    // Check for no movement or abnormal patterns
    // This is a simplified check - in a real app, you would implement more sophisticated algorithms
    const checkForEmergency = () => {
      // No poses detected for an extended time could indicate an emergency
      // In a real app, you'd check for a longer duration
      console.log('No poses detected - potential emergency');
      // triggerEmergency('lostVisual');
      
      // You would also implement other checks here, like detecting falls
      // or abnormal motion patterns
    };
    
    const emergencyCheckInterval = window.setInterval(checkForEmergency, 5000);
    
    return () => {
      window.clearInterval(emergencyCheckInterval);
    };
  }, [isTracking, emergencyMode]);
  
  const triggerEmergency = (type: 'noMovement' | 'lostVisual' | 'abnormalPattern' | 'userInitiated') => {
    if (emergencyMode) return;
    
    // Start countdown
    setCountdownActive(true);
    setCountdownSeconds(10);
    
    countdownRef.current = window.setInterval(() => {
      setCountdownSeconds(prev => {
        if (prev <= 1) {
          activateEmergencyProtocol(type);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const activateEmergencyProtocol = (type: 'noMovement' | 'lostVisual' | 'abnormalPattern' | 'userInitiated') => {
    // Clear countdown
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdownActive(false);
    
    // Create emergency alert
    const newAlert: EmergencyAlert = {
      id: Date.now().toString(),
      userId: 'current-user', // This would be the actual user ID
      timestamp: new Date(),
      type,
      status: 'pending',
      notifiedContacts: [],
    };
    
    // In a real app, you would now:
    // 1. Send SMS notifications to emergency contacts
    // 2. Make automated calls
    // 3. Contact emergency services if configured
    
    // For now, we'll just play an alarm sound
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error('Failed to play alarm:', err));
    }
    
    setActiveAlert(newAlert);
    setEmergencyMode(true);
    
    console.log('EMERGENCY ACTIVATED:', type);
  };
  
  const cancelEmergency = () => {
    // Cancel the countdown if active
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
      setCountdownActive(false);
      return;
    }
    
    // If emergency is already active
    if (emergencyMode && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Update alert status
    if (activeAlert) {
      setActiveAlert({
        ...activeAlert,
        status: 'falseAlarm',
      });
    }
    
    setEmergencyMode(false);
  };
  
  const resolveEmergency = () => {
    // Stop alarm
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Update alert status
    if (activeAlert) {
      setActiveAlert({
        ...activeAlert,
        status: 'resolved',
      });
    }
    
    setEmergencyMode(false);
  };
  
  const value = {
    emergencyMode,
    countdownActive,
    countdownSeconds,
    activeAlert,
    emergencyContacts,
    setEmergencyContacts,
    triggerEmergency,
    cancelEmergency,
    resolveEmergency,
  };
  
  return <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>;
};
