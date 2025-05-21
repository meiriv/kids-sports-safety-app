import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';

interface MotionContextType {
  detector: poseDetection.PoseDetector | null;
  poses: poseDetection.Pose[];
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
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [poses, setPoses] = useState<poseDetection.Pose[]>([]);
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
        
        // Load MoveNet model - one of the best for real-time human pose estimation
        const model = poseDetection.SupportedModels.MoveNet;
        const detectorConfig = {
          modelType: 'thunder', // Use 'thunder' for higher accuracy or 'lightning' for speed
          enableSmoothing: true,
        };
        
        const poseDetector = await poseDetection.createDetector(
          model, 
          detectorConfig
        );
        
        setDetector(poseDetector);
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
      if (detector) {
        detector.dispose();
      }
    };
  }, []);

  const startTracking = () => {
    if (!detector || !videoRef.current || !cameraReady) {
      setError('Camera or detection model not ready');
      return;
    }

    setIsTracking(true);
    
    // Start detecting poses at regular intervals
    trackingIntervalRef.current = window.setInterval(async () => {
      if (detector && videoRef.current) {
        try {
          const detectedPoses = await detector.estimatePoses(videoRef.current);
          setPoses(detectedPoses);
        } catch (err) {
          console.error('Error during pose estimation:', err);
        }
      }
    }, 100); // Detect poses ~10 times per second
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
    detector,
    poses,
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
