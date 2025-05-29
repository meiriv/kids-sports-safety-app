import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useMotion } from '../../context/MotionContext';
import { useGamification } from '../../context/GamificationContext';

interface MotionFeedbackProps {
  activityType: string;
}

const MotionFeedback: React.FC<MotionFeedbackProps> = ({ activityType }) => {
  const { isTracking } = useMotion();
  const { addPoints } = useGamification();
  const [feedback, setFeedback] = useState<string>('Start moving to earn points!');

  // No pose/motion analysis, just show a static message
  useEffect(() => {
    setFeedback(isTracking ? 'Tracking is active.' : 'Start moving to earn points!');
  }, [isTracking]);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Activity Feedback
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {feedback}
      </Typography>
    </Paper>
  );
};

export default MotionFeedback;
