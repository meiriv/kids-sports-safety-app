import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useMotion } from '../../context/MotionContext';
import { useLanguage } from '../../context/LanguageContext';
import { GeminiLiveService, GeminiLiveFeedback } from '../../services/GeminiLiveService';
import { useParams } from 'react-router-dom';

interface CameraProps {
  width?: number;
  height?: number;
  showOverlay?: boolean;
  onCameraReady?: (ready: boolean) => void;
}

const Camera: React.FC<CameraProps> = ({
  width = 640,
  height = 480,
  showOverlay = true,
  onCameraReady
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [geminiFeedback, setGeminiFeedback] = useState<GeminiLiveFeedback | null>(null);
  
  const { isRTL } = useLanguage();
  
  const { 
    setVideoElement, 
    isTracking
  } = useMotion();

  const { activityId } = useParams<{ activityId: string }>();

  // Initialize camera
  useEffect(() => {
    setIsInitializing(true);
    const videoEl = videoRef.current;
    if (!videoEl) {
      setCameraError('Video element not found');
      setIsInitializing(false);
      if (onCameraReady) onCameraReady(false);
      return;
    }
    const initializeCamera = async () => {
      try {
        const constraints = {
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: 'user'
          }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoEl.srcObject = stream;
        videoEl.onloadedmetadata = () => {
          videoEl.play()
            .then(() => {
              setVideoElement(videoEl);
              setIsInitializing(false);
              if (onCameraReady) onCameraReady(true);
            })
            .catch(err => {
              console.error('Error playing video:', err);
              setCameraError('Failed to start video stream');
              setIsInitializing(false);
              if (onCameraReady) onCameraReady(false);
            });
        };
      } catch (err) {
        console.error('Error accessing camera:', err);
        setCameraError('Failed to access camera. Please check permissions.');
        setIsInitializing(false);
        if (onCameraReady) onCameraReady(false);
      }
    };
    initializeCamera();
    // Clean up function
    return () => {
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, [width, height, setVideoElement, onCameraReady]);
  
  // --- Gemini WebSocket live streaming integration using MediaRecorder ---
  const apiKey = '<YOUR_GEMINI_API_KEY>'; // TODO: Replace with your actual API key

  useEffect(() => {
    let localWs: WebSocket | null = null;
    let stream: MediaStream | null = null;
    if (isTracking && activityId && apiKey && videoRef.current && videoRef.current.srcObject) {
      stream = videoRef.current.srcObject as MediaStream;
      localWs = GeminiLiveService.createLiveWebSocketFromMediaStream(
        stream,
        activityId,
        apiKey,
        (feedback) => setGeminiFeedback(feedback),
        (err) => {/* Optionally handle error */}
      );
    }
    return () => {
      if (localWs) localWs.close();
    };
  }, [isTracking, activityId, apiKey]);

  // Close camera connection on browser refresh or tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      const videoEl = videoRef.current;
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return (
    <Box sx={{ position: 'relative', width, height, margin: '0 auto' }}>
      {/* Video element */}
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '8px',
          transform: 'scaleX(-1)' // Mirror the video
        }}
        width={width}
        height={height}
        muted
        playsInline
      />
        {/* Canvas overlay for drawing pose keypoints */}
      {showOverlay && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'scaleX(-1)', // Mirror the canvas to match the video
            pointerEvents: 'none'
          }}
        />
      )}
      
      {/* Gemini Live feedback label */}
      {geminiFeedback && (
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: 2,
          zIndex: 10,
          maxWidth: 320
        }}>
          <Typography variant="body2" fontWeight="bold">
            Gemini AI Feedback:
          </Typography>
          <Typography variant="body1">
            {geminiFeedback.feedback}
          </Typography>
        </Box>
      )}
      
      {/* Activity recording indicator */}
      {isTracking && !isInitializing && (
        <Box 
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(0,0,0,0.5)',
            color: '#FF5252',
            px: 1.5,
            py: 0.5,
            borderRadius: 5,
            zIndex: 5
          }}
        >
          <Box 
            sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: '#FF5252',
              mr: 1,
              animation: 'pulsate 1.5s infinite ease-in-out'
            }} 
          />          <Typography variant="body2" fontWeight="bold">
            {isRTL ? 'מקליט' : 'Recording'}
          </Typography>
          <Box
            sx={{
              '@keyframes pulsate': {
                '0%': { opacity: 0.5, transform: 'scale(0.8)' },
                '50%': { opacity: 1, transform: 'scale(1.2)' },
                '100%': { opacity: 0.5, transform: 'scale(0.8)' }
              }
            }}
          />
        </Box>
      )}
      {/* Loading indicator */}
      {isInitializing && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '8px'
          }}
        >
          <CircularProgress color="primary" size={60} />          <Typography variant="h6" color="white" sx={{ mt: 2, fontWeight: 'bold' }} align={isRTL ? 'right' : 'left'}>
            {isRTL 
              ? 'מגדיר מצלמה...'
              : 'Setting up camera...'
            }
          </Typography>
          <Typography variant="body2" color="white" sx={{ mt: 1, opacity: 0.8 }} align={isRTL ? 'right' : 'left'}>
            {isRTL ? 'התכונן לזוז וליהנות!' : 'Get ready to move and have fun!'}
          </Typography>
          {/* Fun loading animation */}
          <Box 
            sx={{ 
              mt: 4, 
              display: 'flex', 
              justifyContent: 'center',
              gap: 2
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <Box 
                key={i} 
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: `${i * 0.16}s`
                }}
              />
            ))}
          </Box>
          <Box
            sx={{
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)'
                },
                '40%': {
                  transform: 'scale(1)'
                }
              }
            }}
          />
        </Box>
      )}
      
      {/* Error message */}
      {cameraError && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            padding: 2
          }}
        >          <Typography variant="h6" color="error" align={isRTL ? 'right' : 'left'}>
            {isRTL ? 'שגיאת מצלמה' : 'Camera Error'}
          </Typography>
          <Typography variant="body1" color="white" align={isRTL ? 'right' : 'left'} sx={{ mt: 1 }}>
            {isRTL 
              ? (cameraError === 'Failed to access camera. Please check permissions.' 
                  ? 'נכשלה הגישה למצלמה. אנא בדוק את ההרשאות.'
                  : cameraError === 'Failed to start video stream' 
                  ? 'נכשלה הפעלת זרם הוידאו.'
                  : cameraError === 'Video element not found'
                  ? 'לא נמצא רכיב וידאו.'
                  : cameraError)
              : cameraError}
          </Typography>
        </Box>
      )}
      
    </Box>
  );
};

export default Camera;
