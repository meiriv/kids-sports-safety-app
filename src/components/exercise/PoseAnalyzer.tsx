import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import { useMotion } from '../../context/MotionContext';
import { useGamification } from '../../context/GamificationContext';
import { Exercise, PosePosition } from '../../types/models';

interface PoseAnalyzerProps {
  exercise: Exercise;
}

const PoseAnalyzer: React.FC<PoseAnalyzerProps> = ({ exercise }) => {
  const { poses, isTracking } = useMotion();
  const { addPoints, currentSession } = useGamification();
  
  const [formScore, setFormScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [repetitions, setRepetitions] = useState<number>(0);
  const [inPosition, setInPosition] = useState<boolean>(false);
  
  // Analyze pose data when poses are updated
  useEffect(() => {
    if (!isTracking || !currentSession || poses.length === 0) return;
    
    const latestPose = poses[0]; // Get the most prominent detected pose
    
    // Calculate form score based on keypoint matches with expected positions
    const calculateFormScore = (): number => {
      let totalScore = 0;
      let matchedKeypoints = 0;
      
      // For each expected keypoint in the exercise
      exercise.motionKeypoints.forEach(keypoint => {
        // Find the corresponding detected keypoint
        const detectedKeypoint = latestPose.keypoints.find(
          kp => kp.name === keypoint.name
        );
        
        if (detectedKeypoint && detectedKeypoint.score && detectedKeypoint.score > 0.5) {
          // Compare position with expected position
          const expectedPosition = keypoint.expectedPositions[0]; // Use first position for now
          
          const distance = calculateDistance(
            detectedKeypoint.x, 
            detectedKeypoint.y,
            expectedPosition.x,
            expectedPosition.y
          );
          
          // Check if within tolerance
          if (distance <= keypoint.toleranceRange) {
            totalScore += detectedKeypoint.score;
            matchedKeypoints++;
          }
        }
      });
      
      // Normalize score between 0-100
      return matchedKeypoints > 0 
        ? Math.min(100, (totalScore / matchedKeypoints) * 100) 
        : 0;
    };
    
    // Simulate form analysis
    // In a real application, you'd have more sophisticated algorithms
    const newFormScore = calculateFormScore();
    setFormScore(newFormScore);
    
    // Determine if user is in the correct position
    const correctPosition = newFormScore > 80;
    
    // If user just moved into correct position, we might count a rep
    if (correctPosition && !inPosition) {
      setRepetitions(prev => prev + 1);
      
      // Award points for each successful repetition
      addPoints(10, 'Completed exercise repetition');
      
      // Provide feedback
      setFeedback('Great job! Correct form detected.');
    } else if (!correctPosition && formScore > 50) {
      // Provide corrective feedback
      setFeedback('Almost there! Try adjusting your position.');
    } else if (!correctPosition) {
      setFeedback('Follow the exercise instructions to match the correct form.');
    }
    
    setInPosition(correctPosition);
    
  }, [poses, isTracking, exercise, currentSession, addPoints, inPosition, formScore]);
  
  // Helper function to calculate distance between points
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Exercise Form Analysis
      </Typography>
      
      {isTracking ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
            <Typography variant="body1" sx={{ mr: 1, minWidth: 80 }}>
              Form Score:
            </Typography>
            <Box sx={{ width: '100%' }}>
              <LinearProgress 
                variant="determinate" 
                value={formScore} 
                color={formScore > 80 ? "success" : formScore > 50 ? "warning" : "error"}
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }}
              />
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 2, minWidth: 40 }}>
              {Math.round(formScore)}%
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              Repetitions: {repetitions}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography 
              variant="body1" 
              color={
                formScore > 80 ? "success.main" : 
                formScore > 50 ? "warning.main" : 
                "error.main"
              }
            >
              {feedback}
            </Typography>
          </Box>
        </>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Start motion tracking to analyze your exercise form.
        </Typography>
      )}
    </Paper>
  );
};

export default PoseAnalyzer;
