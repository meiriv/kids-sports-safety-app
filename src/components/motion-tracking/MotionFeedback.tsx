import { Box, Typography } from '@mui/material';
import { useMotion } from '../../context/MotionContext';

interface MotionFeedbackProps {
  activityType: string;
}

const MotionFeedback: React.FC<MotionFeedbackProps> = ({ activityType }) => {
  const { isTracking } = useMotion();

  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Activity Feedback
      </Typography>
      {isTracking ? (
        <Typography variant="body1" color="textSecondary">
          Real-time feedback will appear here (powered by backend API).
        </Typography>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Start motion tracking to receive feedback on your activity.
        </Typography>
      )}
    </Box>
  );
};

export default MotionFeedback;
