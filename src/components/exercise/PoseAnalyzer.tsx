import React from 'react';
import { Typography, Paper } from '@mui/material';
import { useMotion } from '../../context/MotionContext';
import { Exercise } from '../../types/models';

interface PoseAnalyzerProps {
  exercise: Exercise;
}

const PoseAnalyzer: React.FC<PoseAnalyzerProps> = ({ exercise }) => {
  const { isTracking } = useMotion();

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Exercise Form Analysis
      </Typography>
      {isTracking ? (
        <Typography variant="body1" color="textSecondary">
          Form analysis will appear here (powered by backend API).
        </Typography>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Start motion tracking to analyze your exercise form.
        </Typography>
      )}
    </Paper>
  );
};

export default PoseAnalyzer;
