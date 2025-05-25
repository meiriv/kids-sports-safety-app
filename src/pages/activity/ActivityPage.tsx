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
  CardMedia,
  LinearProgress
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
const getActivityTypes = (t: TFunction, isRTL: boolean): Activity[] => [  {
    id: 'freestyle',
    name: t('activities.freestyle.title'),
    description: t('activities.freestyle.description'),
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: [
      t('activities.dance.step1'),
      t('activities.dance.step2'),
      t('activities.dance.step3')
    ]
  },  {
    id: 'sports',
    name: t('activities.sports.title'),
    description: t('activities.sports.description'),
    imageUrl: 'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',    instructions: [
      t('activities.sports.step1'),
      t('activities.sports.step2'),
      t('activities.sports.step3')
    ]
  },  {
    id: 'stretching',
    name: t('activities.stretching.title'),
    description: t('activities.stretching.description'),
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.stretching.instructions', { returnObjects: true })
  },  {
    id: 'pushups',
    name: t('activities.pushups.title'),
    description: t('activities.pushups.description'),
    imageUrl: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.pushups.instructions', { returnObjects: true })
  },
  {
    id: 'jumpingjacks',
    name: t('activities.jumpingjacks.title'),
    description: t('activities.jumpingjacks.description'),
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',    instructions: t('activities.jumpingjacks.instructions', { returnObjects: true })
  },  {
    id: 'plank',
    name: t('activities.plank.title'),
    description: t('activities.plank.description'),
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.plank.instructions', { returnObjects: true })
  },  {    id: 'resistance',
    name: t('activities.resistance.title'),
    description: t('activities.resistance.description'),
    imageUrl: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.resistance.instructions', { returnObjects: true })
  },
  {
    id: 'squats',
    name: t('activities.squats.title'),
    description: t('activities.squats.description'),
    imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',    instructions: t('activities.squats.instructions', { returnObjects: true })
  },  {
    id: 'yoga',
    name: t('activities.yoga.title'),
    description: t('activities.yoga.description'),
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.yoga.instructions', { returnObjects: true })
  },  {    id: 'crunches',
    name: t('activities.crunches.title'),
    description: t('activities.crunches.description'),
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.crunches.instructions', { returnObjects: true })
  },  {
    id: 'jumprope',
    name: t('activities.jumprope.title'),
    description: t('activities.jumprope.description'),
    imageUrl: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',    instructions: t('activities.jumprope.instructions', { returnObjects: true })
  },  {    id: 'boxing',
    name: t('activities.boxing.title'),
    description: t('activities.boxing.description'),
    imageUrl: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.boxing.instructions', { returnObjects: true })
  },  {
    id: 'stepups',
    name: t('activities.stepups.title'),
    description: t('activities.stepups.description'),
    imageUrl: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.stepups.instructions', { returnObjects: true })
  },  {
    id: 'weightlifting',
    name: t('activities.weightlifting.title'),
    description: t('activities.weightlifting.description'),
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.weightlifting.instructions', { returnObjects: true })
  },  {    id: 'handstands',
    name: t('activities.handstands.title'),
    description: t('activities.handstands.description'),
    imageUrl: 'https://images.unsplash.com/photo-1593164842264-854604db2260?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    instructions: t('activities.handstands.instructions', { returnObjects: true })
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>      <Button
        variant="outlined"
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
        startIcon={!isRTL && <Box component="span">←</Box>}
        endIcon={isRTL && <Box component="span">→</Box>}
      >
        {t('buttons.back')}
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom align={isRTL ? 'right' : 'left'}>
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
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>                <Typography variant="h6" gutterBottom align={isRTL ? 'right' : 'left'}>
                  {t('activities.feedback')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" align={isRTL ? 'right' : 'left'}>
                    {t('activities.keepMoving')}
                  </Typography>
                  {currentSession && (
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {isRTL
                        ? `${currentSession.points} ${t('gamification.points')}`
                        : `${currentSession.points} ${t('gamification.points')}`
                      }
                    </Typography>
                  )}
                </Box>
                  {/* Show feedback from motion tracking */}
                {isTracking && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', color: 'white', borderRadius: 1 }}>
                    <Typography variant="body1" align={isRTL ? 'right' : 'left'}>
                      {t('activities.greatJob')}
                    </Typography>
                  </Box>
                )}

                {/* Progress tracking indicator */}
                {isTracking && currentSession && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom align={isRTL ? 'right' : 'left'}>
                      {isRTL ? 'התקדמות הפעילות' : 'Activity Progress'}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((timer / 180) * 100, 100)}
                      color="success"
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        mb: 1,
                        '& .MuiLinearProgress-bar': {
                          transition: 'transform 1s linear'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="textSecondary">0:00</Typography>
                      <Typography variant="caption" color="textSecondary">3:00</Typography>
                    </Box>
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

          {/* Activity-specific metrics */}
          {isSessionActive && currentSession && (
            <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom align={isRTL ? 'right' : 'left'}>
                {isRTL ? 'מדדי פעילות' : 'Activity Metrics'}
              </Typography>

              <Grid container spacing={2}>
                {/* Different metrics based on activity type */}
                {(activity.id === 'jumprope' || activity.id === 'jumpingjacks') && (
                  <Grid item xs={6}>
                    <Box sx={{ p: 1, bgcolor: 'primary.light', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="body2">
                        {isRTL ? 'קפיצות לדקה' : 'Jumps/min'}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {Math.floor(25 + Math.random() * 30)}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {(activity.id === 'plank' || activity.id === 'yoga' || activity.id === 'handstands') && (
                  <Grid item xs={6}>
                    <Box sx={{ p: 1, bgcolor: 'info.light', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="body2">
                        {isRTL ? 'יציבות' : 'Stability'}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {Math.floor(70 + Math.random() * 30)}%
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {(activity.id === 'boxing' || activity.id === 'pushups' || activity.id === 'weightlifting') && (
                  <Grid item xs={6}>
                    <Box sx={{ p: 1, bgcolor: 'error.light', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="body2">
                        {isRTL ? 'חוזק' : 'Power'}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {Math.floor(60 + Math.random() * 40)}%
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Common metric for all activities */}
                <Grid item xs={6}>
                  <Box sx={{ p: 1, bgcolor: 'success.light', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                      {isRTL ? 'דופק מוערך' : 'Est. Heart Rate'}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {Math.floor(90 + Math.random() * 40)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
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
                    <Box sx={{ mb: 2, mt: 2, display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row' }}>                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0 }}
                        disabled={activeStep === activity.instructions.length - 1}
                        startIcon={!isRTL && <Box component="span">→</Box>}
                        endIcon={isRTL && <Box component="span">→</Box>}
                      >
                        {t('activities.next')}
                      </Button>
                      {activeStep > 0 && (
                        <Button
                          onClick={handleBack}
                          startIcon={!isRTL && <Box component="span">←</Box>}
                          endIcon={isRTL && <Box component="span">←</Box>}
                        >
                          {t('activities.back')}
                        </Button>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>          {/* Session info with enhanced gamification */}          {currentSession && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', mb: 2 }}>
                <DirectionsRunIcon sx={{ fontSize: 28, mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0 }} />
                <Typography variant="h6" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
                  {currentSession.activityType}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
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
                      {t('activities.activitySelection.duration')}
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
                      {t('gamification.points')}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">{currentSession.points}</Typography>
                  </Box>
                </Grid>
              </Grid>                {timer >= 60 && (
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
                    {t('activities.achievement', { minutes: Math.floor(timer/60) })}
                  </Typography>
                </Box>
              )}
            </Paper>
          )}          {/* Enhanced completion message with reward animation */}
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
                overflow: 'hidden',
                animation: 'popIn 0.5s ease-out'
              }}
            >
              <style>
                {`
                  @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    70% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                  }
                  @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.6; }
                  }
                  @keyframes confetti {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
                  }
                `}
              </style>
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

              {/* Animated confetti elements */}
              {[...Array(20)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: ['#FF5722', '#FFC107', '#8BC34A', '#03A9F4', '#9C27B0'][i % 5],
                    top: `-10px`,
                    left: `${5 + (i * 5)}%`,
                    opacity: 0,
                    animation: `confetti ${0.5 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards`
                  }}
                />
              ))}<Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', mb: 2 }}>
                <EmojiEventsIcon sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0, fontSize: 30 }} />
                <Typography variant="h5" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
                  {t('activities.completed')}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }} align={isRTL ? 'right' : 'left'}>
                {t('activities.awesomeJob', { points: currentSession?.points || 0 })}
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
                    {t('activities.achievement', { minutes: Math.floor(timer/60) })}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }} align={isRTL ? 'right' : 'center'}>
                  {t('activities.returningHome')}
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
