import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardMedia
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Camera from '../../components/motion-tracking/Camera';
import EmergencyAlert from '../../components/emergency/EmergencyAlert';
import MotionFeedback from '../../components/motion-tracking/MotionFeedback';
import { useGamification } from '../../context/GamificationContext';
import { useMotion } from '../../context/MotionContext';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useLanguage } from '../../context/LanguageContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

interface Activity {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  instructions: string[];
}

// We'll use translations for activity types
const getActivityTypes = (t: TFunction, isRTL: boolean): Activity[] => [
  {
    id: 'freestyle',
    name: t('activities.freestyle.title'),
    description: t('activities.freestyle.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/freestyle-play.svg`,
    instructions: [
      t('activities.freestyle.step1'),
      t('activities.freestyle.step2'),
      t('activities.freestyle.step3')
    ]
  },
  {
    id: 'dance',
    name: t('activities.dance.title'),
    description: t('activities.dance.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/dance-party.svg`,
    instructions: [
      t('activities.dance.step1'),
      t('activities.dance.step2'),
      t('activities.dance.step3')
    ]
  },
  {
    id: 'sports',
    name: t('activities.sports.title'),
    description: t('activities.sports.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/sports-practice.svg`,
    instructions: [
      t('activities.sports.step1'),
      t('activities.sports.step2'),
      t('activities.sports.step3')
    ]
  }
];

const ActivityPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const activityTypes = getActivityTypes(t, isRTL);
  
  const [activity, setActivity] = useState(activityTypes[0]);
  const [activeStep, setActiveStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  
  const { 
    startActivitySession, 
    endActivitySession, 
    addPoints, 
    currentSession 
  } = useGamification();
  
  const { isTracking, startTracking, stopTracking } = useMotion();

  // Find activity based on ID from URL
  useEffect(() => {
    if (activityId) {
      const foundActivity = activityTypes.find(act => act.id === activityId);
      if (foundActivity) {
        setActivity(foundActivity);
      }
    }
  }, [activityId, activityTypes]);

  // Handle timer for activity session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSessionActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        
        // Award points every 10 seconds of activity
        if (timer > 0 && timer % 10 === 0) {
          addPoints(5, 'Continued activity');
        }
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSessionActive, timer, addPoints]);

  // Format seconds into mm:ss format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start activity recording session
  const handleStartActivity = () => {
    startTracking();
    startActivitySession(activity.name);
    setIsSessionActive(true);
    // Give initial points for starting
    addPoints(10, 'Started activity');
  };

  // End activity recording session
  const handleStopActivity = () => {
    stopTracking();
    endActivitySession();
    setIsSessionActive(false);
    setIsCompleted(true);
    // Award completion points
    addPoints(20, 'Completed activity');
    
    // Show completion state briefly before returning home
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  // Go to next step in instructions
  const handleNext = () => {
    if (activeStep < activity.instructions.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  // Go back a step in instructions
  const handleBack = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
  };

  // Reset session state when activity changes
  useEffect(() => {
    setIsSessionActive(false);
    setIsCompleted(false);
    setTimer(0);
    setActiveStep(0);
  }, [activityId]);

  // Start tracking automatically when the activity page is loaded or activityId changes, but only after camera is ready
  useEffect(() => {
    // Only auto-start if not already started for this activity
    if (cameraReady && !isSessionActive && !isCompleted) {
      handleStartActivity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId, cameraReady]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button
        variant="outlined"
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Home
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {activity.name}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Camera and tracking section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Camera width={640} height={480} onCameraReady={setCameraReady} />
              {/* Activity controls */}
            <Box sx={{ p: 2, display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                <TimerIcon sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0, color: 'text.secondary' }} />
                <Typography variant="h5" fontWeight="bold">
                  {formatTime(timer)}
                </Typography>
              </Box>
              
              {!isSessionActive ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={!isRTL && <PlayArrowIcon />}
                  endIcon={isRTL && <PlayArrowIcon />}
                  onClick={handleStartActivity}
                  disabled={isCompleted}
                  sx={{ borderRadius: 4, px: 4 }}
                >
                  {t('activities.start')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={!isRTL && <StopIcon />}
                  endIcon={isRTL && <StopIcon />}
                  onClick={handleStopActivity}
                  sx={{ borderRadius: 4, px: 4 }}
                >
                  {t('activities.stop')}
                </Button>
              )}
            </Box>
          </Paper>
            {/* Form analysis feedback */}
          {isSessionActive && (
            <Box sx={{ mt: 2 }}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom align={isRTL ? 'right' : 'left'}>
                  {isRTL ? 'משוב פעילות' : 'Activity Feedback'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" align={isRTL ? 'right' : 'left'}>
                    {isRTL ? 'המשך לזוז כדי להרוויח יותר נקודות!' : 'Keep moving to earn more points!'}
                  </Typography>
                  {currentSession && (
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {isRTL ? `${currentSession.points} נקודות` : `${currentSession.points} points`}
                    </Typography>
                  )}
                </Box>
                
                {/* Show feedback from motion tracking */}
                {isTracking && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', color: 'white', borderRadius: 1 }}>
                    <Typography variant="body1" align={isRTL ? 'right' : 'left'}>
                      {isRTL ? 'עבודה מצוינת! אנחנו מזהים את התנועות שלך.' : 'Great job! We\'re detecting your movements.'}
                    </Typography>
                  </Box>
                )}
                </Paper>
            </Box>
          )}
          
          {/* Enhanced motion feedback */}
          {isSessionActive && (
            <Box sx={{ mt: 2 }}>
              <MotionFeedback activityType={activity.id} />
            </Box>
          )}
        </Grid>        {/* Instructions section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom align={isRTL ? 'right' : 'left'}>
              {isRTL ? 'הוראות' : 'Instructions'}
            </Typography>
            
            <Typography variant="body1" paragraph align={isRTL ? 'right' : 'left'}>
              {activity.description}
            </Typography>
            
            {/* Activity image */}
            <Card sx={{ mb: 3, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="160"
                image={activity.imageUrl}
                alt={activity.name}
              />
            </Card>
              {/* Step-by-step instructions */}
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
              {activity.instructions.map((instruction, index) => (
                <Step key={index}>
                  <StepLabel>
                    <Typography variant="subtitle1" align={isRTL ? 'right' : 'left'}>
                      {isRTL ? `שלב ${index + 1}` : `Step ${index + 1}`}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body1" align={isRTL ? 'right' : 'left'}>
                      {instruction}
                    </Typography>
                    <Box sx={{ mb: 2, mt: 2, display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0 }}
                        disabled={activeStep === activity.instructions.length - 1}
                      >
                        {isRTL ? 'הבא' : 'Next'}
                      </Button>
                      {activeStep > 0 && (
                        <Button
                          onClick={handleBack}
                        >
                          {isRTL ? 'חזור' : 'Back'}
                        </Button>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>          {/* Session info with enhanced gamification */}
          {currentSession && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', mb: 2 }}>
                <DirectionsRunIcon sx={{ fontSize: 28, mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0 }} />
                <Typography variant="h6" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
                  {currentSession.activityType}
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    p: 1,
                    borderRadius: 2
                  }}>
                    <TimerIcon />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {isRTL ? 'משך זמן' : 'Duration'}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">{formatTime(timer)}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    p: 1,
                    borderRadius: 2
                  }}>
                    <EmojiEventsIcon />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {isRTL ? 'נקודות' : 'Points'}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">{currentSession.points}</Typography>
                  </Box>
                </Grid>
              </Grid>
                {timer >= 60 && (
                <Box sx={{ 
                  mt: 2, 
                  py: 1, 
                  px: 2, 
                  bgcolor: 'success.main', 
                  borderRadius: 2, 
                  display: 'flex',
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  alignItems: 'center'
                }}>
                  <EmojiEventsIcon sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0, fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
                    {isRTL 
                      ? `הישג: פעיל במשך ${Math.floor(timer/60)} דקות${timer >= 120 ? '' : ''}!` 
                      : `Achievement: Active for ${Math.floor(timer/60)} minute${timer >= 120 ? 's' : ''}!`
                    }
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
            {/* Enhanced completion message with reward animation */}
          {isCompleted && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mt: 3, 
                borderRadius: 2, 
                bgcolor: 'success.main', 
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                  animation: 'pulse 2s infinite'
                }}
              />
                <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', mb: 2 }}>
                <EmojiEventsIcon sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0, fontSize: 30 }} />
                <Typography variant="h5" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
                  {isRTL ? 'הפעילות הושלמה!' : 'Activity Completed!'}
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2 }} align={isRTL ? 'right' : 'left'}>
                {isRTL 
                  ? `עבודה מדהימה! הרווחת ${currentSession?.points || 0} נקודות עבור הפעילות שלך.`
                  : `Awesome job! You've earned ${currentSession?.points || 0} points for your activity.`
                }
              </Typography>
                <Box sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: 2,
                textAlign: isRTL ? 'right' : 'center'
              }}>
                {currentSession && timer >= 60 && (
                  <Typography variant="body1" fontWeight="bold" align={isRTL ? 'right' : 'center'}>
                    {isRTL 
                      ? `הישג חדש: ${Math.floor(timer/60)} דקות פעילות!` 
                      : `New Achievement: ${Math.floor(timer/60)} minute${timer >= 120 ? 's' : ''} of activity!`
                    }
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }} align={isRTL ? 'right' : 'center'}>
                  {isRTL ? 'חוזר למסך הבית...' : 'Returning to home screen...'}
                </Typography>
              </Box>
                <Box
                sx={{
                  '@keyframes pulse': {
                    '0%': { opacity: 0.4 },
                    '50%': { opacity: 0.8 },
                    '100%': { opacity: 0.4 }
                  }
                }}
              />
            </Paper>
          )}
        </Grid>
      </Grid>
      
      <EmergencyAlert />
    </Container>
  );
};

export default ActivityPage;
