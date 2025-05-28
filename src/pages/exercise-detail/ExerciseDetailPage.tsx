import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { type TFunction } from 'i18next';
import { useLanguage } from '../../context/LanguageContext';
import Camera from '../../components/motion-tracking/Camera';
import PoseAnalyzer from '../../components/exercise/PoseAnalyzer';
import ExerciseGuidance from '../../components/exercise/ExerciseGuidance';
import EmergencyAlert from '../../components/emergency/EmergencyAlert';
import { Exercise } from '../../types/models';
import { MotionProvider } from '../../context/MotionContext';

// Mock exercises data - in a real app this would come from an API or database
const exercises = (t: TFunction): Exercise[] => [
  {
    id: 'jumping-jacks',
    name: t('activities.exercises.jumpingJacks.title'),
    description: t('activities.exercises.jumpingJacks.description'),
    difficulty: 'beginner',
    minAge: 5,
    maxAge: 12,
    instructions: t('activities.exercises.jumpingJacks.instructions', { returnObjects: true }) as string[],
    imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80',
    voicePrompts: [
      'Jump and raise your arms!',
      'Great job, keep going!',
      'Remember to fully extend your arms each time!'
    ]
  },  {
    id: 'squats',
    name: t('activities.exercises.squats.title'),
    description: t('activities.exercises.squats.description'),
    difficulty: 'intermediate',
    minAge: 6,
    maxAge: 12,
    instructions: t('activities.exercises.squats.instructions', { returnObjects: true }) as string[],
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80',
    voicePrompts: t('activities.exercises.squats.voicePrompts', { returnObjects: true }) as string[]
  }
];

const ExerciseDetailPage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchExercise = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        const foundExercise = exercises(t).find(ex => ex.id === exerciseId);
        
        if (foundExercise) {
          setExercise(foundExercise);
        } else {
          // Exercise not found
          console.error('Exercise not found:', exerciseId);
          // Navigate back to exercise list
          navigate('/exercises');
        }
      } catch (error) {
        console.error('Error fetching exercise:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercise();
  }, [exerciseId, navigate]);
  
  const handleExerciseComplete = () => {
    // In a real app, you might want to record completion status
    // For now, we'll just show a timed message
    setTimeout(() => {
      navigate('/activities');
    }, 3000);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {t('common.loading')}
        </Typography>
      </Container>
    );
  }
  
  if (!exercise) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>          <Typography variant="h5" color="error">
            {t('activities.exerciseNotFound')}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/exercises')}
            sx={{ mt: 2 }}
          >
            {t('common.backToExercises')}
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <MotionProvider>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          sx={{ mb: 3, mr: isRTL ? 'auto' : 0, ml: isRTL ? 0 : 'auto' }}
        >
          {t('common.back')}
        </Button>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Camera width={640} height={480} />
            <PoseAnalyzer exercise={exercise} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ExerciseGuidance 
              exercise={exercise} 
              onComplete={handleExerciseComplete} 
            />
          </Grid>
        </Grid>
        
        <EmergencyAlert />
      </Container>
    </MotionProvider>
  );
};

export default ExerciseDetailPage;
