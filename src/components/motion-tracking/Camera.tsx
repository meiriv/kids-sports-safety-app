import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useMotion } from '../../context/MotionContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

interface CameraProps {
  width?: number;
  height?: number;
  showOverlay?: boolean;
}

const Camera: React.FC<CameraProps> = ({
  width = 640,
  height = 480,
  showOverlay = true
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activityFeedback, setActivityFeedback] = useState<string>('');
  const feedbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const { 
    setVideoElement, 
    cameraReady, 
    isTracking, 
    startTracking, 
    stopTracking,
    modelLoading
  } = useMotion();

  // Initialize camera
  useEffect(() => {
    let isMounted = true;
    // Only set isInitializing to true on first mount
    setIsInitializing(prev => prev); // do not set to true again if already initialized
    const initializeCamera = async () => {
      if (!videoRef.current) {
        if (isMounted) setCameraError('Video element not found');
        if (isMounted) setIsInitializing(false);
        return;
      }
      try {
        const constraints = {
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: 'user'
          }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMounted) return;
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (!videoRef.current) return;
          videoRef.current.play()
            .then(() => {
              if (!isMounted) return;
              setVideoElement(videoRef.current!);
              setIsInitializing(false);
            })
            .catch(err => {
              if (!isMounted) return;
              console.error('Error playing video:', err);
              if (err && err.name === 'NotReadableError') {
                setCameraError('Could not start video source. Your camera may be in use by another application, not connected, or blocked by browser privacy settings. Please close other apps that use the camera, check permissions, and try again.');
              } else {
                setCameraError('Failed to start video stream');
              }
              setIsInitializing(false);
            });
        };
      } catch (err) {
        if (!isMounted) return;
        console.error('Error accessing camera:', err);
        setCameraError('Failed to access camera. Please check permissions.');
        setIsInitializing(false);
      }
    };
    initializeCamera();
    // Clean up function
    return () => {
      isMounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, [width, height, setVideoElement]);
  
  const isAnalyzingRef = useRef(false);

  // Periodically capture frame and send to backend for activity analysis, with 3s delay between calls
  useEffect(() => {
    let isMounted = true;
    let timeout: NodeJS.Timeout | null = null;

    const runAnalysisLoop = () => {
      if (!isMounted || !isTracking || !videoRef.current || !cameraReady || isInitializing) return;
      if (isAnalyzingRef.current) {
        // If still analyzing, try again in 500ms
        timeout = setTimeout(runAnalysisLoop, 500);
        return;
      }
      const video = videoRef.current;
      if (!video || video.readyState < 3 || video.videoWidth === 0 || video.videoHeight === 0) {
        timeout = setTimeout(runAnalysisLoop, 500);
        return;
      }
      let canvas = feedbackCanvasRef.current;
      if (!canvas) {
        canvas = document.createElement('canvas');
        feedbackCanvasRef.current = canvas;
      }
      canvas.width = video.videoWidth || width;
      canvas.height = video.videoHeight || height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        timeout = setTimeout(runAnalysisLoop, 500);
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');

      const analyzeFrame = async () => {
        isAnalyzingRef.current = true;
        try {
          const response = await fetch('http://localhost:5001/analyze_frame', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image_data: base64Data })
          });
          if (!isMounted) return;
          const data = await response.json();
          setActivityFeedback(data.analysis_result || '');
        } catch (err) {
          if (!isMounted) return;
          setActivityFeedback('Error analyzing activity');
        } finally {
          isAnalyzingRef.current = false;
          // Wait 3 seconds before next call
          if (isMounted && isTracking) {
            timeout = setTimeout(runAnalysisLoop, 1);
          }
        }
      };
      analyzeFrame();
    };

    if (isTracking && videoRef.current && cameraReady && !isInitializing) {
      runAnalysisLoop();
    } else {
      setActivityFeedback('');
    }
    return () => {
      isMounted = false;
      if (timeout) clearTimeout(timeout);
      isAnalyzingRef.current = false; // Reset analyzing flag on cleanup
    };
  }, [isTracking, width, height, cameraReady, isInitializing]);

  // Toggle tracking (restored, needed for button)
  const handleToggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  // --- COMPONENT RETURN ---
  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      height: `${height}px`,
      margin: '0 auto',
      maxWidth: '100%'
    }}>
      {/* Video element */}
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: '8px',
          transform: 'scaleX(-1)'
        }}
        muted
        playsInline
      />
      {/* Feedback label overlay */}
      {isTracking && activityFeedback && (
        <Box sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          px: 2,
          py: 1,
          borderRadius: 2,
          zIndex: 10,
          maxWidth: '60%',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          boxShadow: 3
        }}>
          {activityFeedback}
        </Box>
      )}
      {/* Activity recording indicator */}
      {isTracking && !isInitializing && !modelLoading && (
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
          />
          <Typography variant="body2" fontWeight="bold">
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
      {/* Control button */}
      {cameraReady && !isInitializing && !modelLoading && !cameraError && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 30,
            pb: 3 // padding bottom for spacing
          }}
        >
          <Button
            variant="contained"
            color={isTracking ? "error" : "primary"}
            sx={{
              minWidth: 180,
              minHeight: 48,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              boxShadow: 4
            }}
            onClick={handleToggleTracking}
          >
            {isRTL 
              ? (isTracking ? "עצור מעקב" : "התחל מעקב")
              : (isTracking ? "Stop Tracking" : "Start Tracking")
            }
          </Button>
        </Box>
      )}
      {/* Loading indicator */}
      {(isInitializing || modelLoading) && (
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
            zIndex: 20
          }}
        >
          <CircularProgress color="primary" size={60} />
          <Typography variant="h6" color="white" sx={{ mt: 2, fontWeight: 'bold' }} align={isRTL ? 'right' : 'left'}>
            {isRTL 
              ? (modelLoading ? 'טוען גלאי תנועה...' : 'מגדיר מצלמה...')
              : (modelLoading ? 'Loading Movement Detector...' : 'Setting up camera...')
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
        >
          <Typography variant="h6" color="error" align={isRTL ? 'right' : 'left'}>
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
}

export default Camera;
