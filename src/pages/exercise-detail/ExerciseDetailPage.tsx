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
import Camera from '../../components/motion-tracking/Camera';
import PoseAnalyzer from '../../components/exercise/PoseAnalyzer';
import ExerciseGuidance from '../../components/exercise/ExerciseGuidance';
import EmergencyAlert from '../../components/emergency/EmergencyAlert';
import { Exercise } from '../../types/models';
import { MotionProvider } from '../../context/MotionContext';

// Mock exercises data - in a real app this would come from an API or database
const mockExercises: Exercise[] = [
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    description: 'A classic exercise that works your whole body while improving coordination.',
    difficulty: 'beginner',
    minAge: 5,
    maxAge: 12,
    instructions: [
      'Start by standing with your feet together and arms at your sides.',
      'Jump and spread your legs while raising your arms above your head.',
      'Jump again and return to the starting position.',
      'Repeat for 10-15 repetitions.'
    ],
    imageUrl: 'https://via.placeholder.com/600x300?text=Jumping+Jacks',
    motionKeypoints: [
      {
        id: 'arms-up',
        name: 'arms_extended',
        expectedPositions: [
          { x: 0.5, y: 0.2, confidence: 0.9 }
        ],
        toleranceRange: 0.2
      }
    ],
    voicePrompts: [
      'Jump and raise your arms!',
      'Great job, keep going!',
      'Remember to fully extend your arms each time!'
    ]
  },
  {
    id: 'squats',
    name: 'Squats',
    description: 'Builds lower body strength and stability.',
    difficulty: 'intermediate',
    minAge: 6,
    maxAge: 12,
    instructions: [
      'Stand with your feet shoulder-width apart.',
      'Lower your body as if sitting in an invisible chair.',
      'Keep your chest up and knees behind your toes.',
      'Push through your heels to stand back up.',
      'Repeat for 8-12 repetitions.'
    ],
    imageUrl: 'https://via.placeholder.com/600x300?text=Squats',
    motionKeypoints: [
      {
        id: 'knee-bend',
        name: 'knee_bend',
        expectedPositions: [
          { x: 0.5, y: 0.6, confidence: 0.9 }
        ],
        toleranceRange: 0.2
      }
    ],
    voicePrompts: [
      'Squat down slowly!',
      'Keep your back straight!',
      'Push through your heels to stand up!'
    ]
  }
];

const ExerciseDetailPage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchExercise = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        const foundExercise = mockExercises.find(ex => ex.id === exerciseId);
        
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
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading exercise details...
        </Typography>
      </Container>
    );
  }
  
  if (!exercise) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" color="error">
            Exercise not found
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/exercises')}
            sx={{ mt: 2 }}
          >
            Back to Exercises
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <MotionProvider>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
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
