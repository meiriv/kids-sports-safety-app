import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useMotion } from '../../context/MotionContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
// Import MediaPipe dependencies
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

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
  
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const { 
    setVideoElement, 
    cameraReady, 
    isTracking, 
    poses, 
    startTracking, 
    stopTracking,
    modelLoading
  } = useMotion();

  // Initialize camera
  useEffect(() => {
    const initializeCamera = async () => {
      setIsInitializing(true);
      
      if (!videoRef.current) {
        setCameraError('Video element not found');
        setIsInitializing(false);
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
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setVideoElement(videoRef.current!);
                setIsInitializing(false);
              })
              .catch(err => {
                console.error('Error playing video:', err);
                setCameraError('Failed to start video stream');
                setIsInitializing(false);
              });
          }
        };
      } catch (err) {
        console.error('Error accessing camera:', err);
        setCameraError('Failed to access camera. Please check permissions.');
        setIsInitializing(false);
      }
    };

    initializeCamera();

    // Clean up function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        
        tracks.forEach(track => {
          track.stop();
        });
      }
    };
  }, [width, height, setVideoElement]);
  
  // Draw pose keypoints on canvas when poses change
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !showOverlay || poses.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw keypoints and connections
    poses.forEach(pose => {
      // Draw keypoints
      pose.keypoints.forEach(keypoint => {
        if (keypoint.score && keypoint.score > 0.3) {
          ctx.fillStyle = 'rgb(255, 0, 0)';
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fill();
          
          // Optionally draw keypoint names
          if (keypoint.name) {
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(keypoint.name, keypoint.x + 10, keypoint.y);
          }
        }
      });
      
      // Draw skeleton (connections between keypoints)
      drawConnections(ctx, pose);
    });
  }, [poses, width, height, showOverlay]);
  
  // Function to draw connections between keypoints
  const drawConnections = (
    ctx: CanvasRenderingContext2D,
    pose: any
  ) => {
    const connections = [
      ['nose', 'left_eye'],
      ['nose', 'right_eye'],
      ['left_eye', 'left_ear'],
      ['right_eye', 'right_ear'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['right_shoulder', 'right_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'],
      ['right_knee', 'right_ankle']
    ];
    
    ctx.strokeStyle = 'rgb(0, 255, 0)';
    ctx.lineWidth = 2;
    
    connections.forEach(([startPoint, endPoint]) => {
      const startKeypoint = pose.keypoints.find((kp: any) => kp.name === startPoint);
      const endKeypoint = pose.keypoints.find((kp: any) => kp.name === endPoint);
      
      if (
        startKeypoint && 
        endKeypoint && 
        startKeypoint.score && 
        endKeypoint.score && 
        startKeypoint.score > 0.3 && 
        endKeypoint.score > 0.3
      ) {
        ctx.beginPath();
        ctx.moveTo(startKeypoint.x, startKeypoint.y);
        ctx.lineTo(endKeypoint.x, endKeypoint.y);
        ctx.stroke();
      }
    });
  };
  
  // Toggle tracking
  const handleToggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

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
            borderRadius: '8px'
          }}
        >
          <CircularProgress color="primary" size={60} />          <Typography variant="h6" color="white" sx={{ mt: 2, fontWeight: 'bold' }} align={isRTL ? 'right' : 'left'}>
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
      
      {/* Control button */}
      {cameraReady && !isInitializing && !modelLoading && !cameraError && (
        <Button
          variant="contained"
          color={isTracking ? "error" : "primary"}
          sx={{ 
            position: 'absolute', 
            bottom: 16, 
            left: '50%', 
            transform: 'translateX(-50%)'
          }}          onClick={handleToggleTracking}
        >
          {isRTL 
            ? (isTracking ? "עצור מעקב" : "התחל מעקב")
            : (isTracking ? "Stop Tracking" : "Start Tracking")
          }
        </Button>
      )}
    </Box>
  );
};

export default Camera;
