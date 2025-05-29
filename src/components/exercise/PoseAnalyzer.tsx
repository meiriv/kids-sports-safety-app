import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Exercise } from '../../types/models';

interface PoseAnalyzerProps {
  exercise: any; // Adjusted type since Exercise is not used
}

const PoseAnalyzer: React.FC<PoseAnalyzerProps> = ({ exercise }) => {
  // Pose analysis removed: only show a message
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Exercise Form Analysis
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Pose analysis is not available in this version.
      </Typography>
    </Paper>
  );
};

export default PoseAnalyzer;
