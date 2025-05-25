import React, { createContext, useState, useContext, useRef } from 'react';

interface MotionContextType {
  isTracking: boolean;
  cameraReady: boolean;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
  setVideoElement: (videoElement: HTMLVideoElement) => void;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

export const useMotion = (): MotionContextType => {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
};

// Remove all pose detection and Gemini AI logic, keep only camera/video state management
export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Start/stop tracking just manage state, no pose detection
  const startTracking = () => {
    if (!videoRef.current || !cameraReady) {
      setError('Camera not ready');
      return;
    }
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const setVideoElement = (videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
    setCameraReady(true);
  };

  const value = {
    detector: null, // No longer used
    poses: [], // No longer used
    isTracking,
    cameraReady,
    modelLoading: false, // No model loading
    error,
    startTracking,
    stopTracking,
    setVideoElement,
  };

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
};
