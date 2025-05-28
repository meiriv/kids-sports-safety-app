import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

interface MotionContextType {
  isTracking: boolean;
  cameraReady: boolean;
  modelLoading: boolean;
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

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackingIntervalRef = useRef<number | null>(null);

  // Load pose detection model when the component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        // Ensure TensorFlow.js is ready before loading the model
        await tf.ready();
        setModelLoading(false);
      } catch (err) {
        console.error('Failed to load pose detection model:', err);
        setError('Failed to load motion tracking capabilities. Please refresh the app.');
        setModelLoading(false);
      }
    };

    loadModel();

    // Cleanup function
    return () => {
      if (trackingIntervalRef.current) {
        window.clearInterval(trackingIntervalRef.current);
      }
    };
  }, []);

  const startTracking = () => {
    if (!videoRef.current || !cameraReady) {
      setError('Camera not ready');
      return;
    }

    setIsTracking(true);
    // Tracking logic here (if any)
  };

  const stopTracking = () => {
    if (trackingIntervalRef.current) {
      window.clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    setIsTracking(false);
  };

  const setVideoElement = (videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
    setCameraReady(true);
  };

  const value = {
    isTracking,
    cameraReady,
    modelLoading,
    error,
    startTracking,
    stopTracking,
    setVideoElement,
  };

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
};
