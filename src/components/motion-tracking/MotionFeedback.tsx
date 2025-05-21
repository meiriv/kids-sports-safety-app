import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import { useMotion } from '../../context/MotionContext';
import { useGamification } from '../../context/GamificationContext';

interface MotionFeedbackProps {
  activityType: string;
}

const MotionFeedback: React.FC<MotionFeedbackProps> = ({ activityType }) => {
  const { poses, isTracking } = useMotion();
  const { addPoints } = useGamification();
  
  const [activityScore, setActivityScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('Start moving to earn points!');
  const [motionDetected, setMotionDetected] = useState<boolean>(false);
  const [lastPointTime, setLastPointTime] = useState<number>(Date.now());
  
  // Analyze pose data when poses are updated
  useEffect(() => {
    if (!isTracking || poses.length === 0) return;
    
    // Basic motion detection algorithm
    const currentPose = poses[0]; // Use the first detected pose
    
    // Calculate motion intensity based on key body points
    const calculateMotionIntensity = (): number => {
      if (!currentPose || !currentPose.keypoints) return 0;
      
      // Extract key points we care about for activity detection
      const relevantPoints = [
        'nose', 'left_shoulder', 'right_shoulder', 
        'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist',
        'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
      ];
      
      const keypoints = currentPose.keypoints.filter(
        kp => relevantPoints.includes(kp.name || '') && kp.score && kp.score > 0.3
      );
      
      if (keypoints.length < 4) return 0; // Not enough data
      
      // Compare with previous frame to detect movement
      // For simplicity, just count visible keypoints as a measure of activity
      // In a real app, you would track keypoint positions across frames
      const visibilityScore = keypoints.length / relevantPoints.length;
      return visibilityScore * 100;
    };
    
    const motionIntensity = calculateMotionIntensity();
    setActivityScore(motionIntensity);
    
    // Update feedback based on motion intensity
    if (motionIntensity > 60) {
      setFeedback('Great job! Keep moving!');
      setMotionDetected(true);
      
      // Award points for continuous activity, but not too frequently
      const now = Date.now();
      if (now - lastPointTime > 5000) { // 5 seconds between point awards
        addPoints(5, `Active ${activityType}`);
        setLastPointTime(now);
      }
    } else if (motionIntensity > 30) {
      setFeedback('Good! Try to move a bit more');
      setMotionDetected(true);
    } else {
      setFeedback('Move around more to earn points!');
      setMotionDetected(false);
    }
    
  }, [poses, isTracking, activityType, addPoints, lastPointTime]);
  
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Activity Feedback
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
        <Typography variant="body1" sx={{ mr: 1, minWidth: 100 }}>
          Activity Level:
        </Typography>
        <Box sx={{ width: '100%' }}>
          <LinearProgress 
            variant="determinate" 
            value={activityScore} 
            color={activityScore > 60 ? "success" : activityScore > 30 ? "warning" : "error"}
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: 'rgba(0,0,0,0.1)'
            }}
          />
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ ml: 2, minWidth: 40 }}>
          {Math.round(activityScore)}%
        </Typography>
      </Box>
      
      <Box sx={{ 
        mt: 2, 
        p: 2, 
        bgcolor: motionDetected ? 'success.light' : 'warning.light', 
        color: 'white', 
        borderRadius: 1 
      }}>
        <Typography variant="body1">
          {feedback}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MotionFeedback;
