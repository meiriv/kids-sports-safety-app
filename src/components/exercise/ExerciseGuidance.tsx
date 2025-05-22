import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Button,
  Card,
  CardMedia
} from '@mui/material';
import { Exercise } from '../../types/models';
import { useGamification } from '../../context/GamificationContext';
import { useMotion } from '../../context/MotionContext';

interface ExerciseGuidanceProps {
  exercise: Exercise;
  onComplete?: () => void;
}

const ExerciseGuidance: React.FC<ExerciseGuidanceProps> = ({ 
  exercise,
  onComplete 
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { startActivitySession, endActivitySession, addPoints } = useGamification();
  const { isTracking } = useMotion();
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  
  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);
  
  // Start activity session when component mounts
  useEffect(() => {
    startActivitySession(exercise.name);
    
    // End session when component unmounts
    return () => {
      if (!isCompleted) {
        endActivitySession();
      }
    };
  }, [exercise.name, startActivitySession, endActivitySession, isCompleted]);
  
  // Speak instruction when active step changes
  useEffect(() => {
    if (speechSynthesis && activeStep < exercise.instructions.length) {
      const instruction = exercise.instructions[activeStep];
      speakInstruction(instruction);
    }
  }, [activeStep, exercise.instructions, speechSynthesis]);
  
  const speakInstruction = (text: string) => {
    if (!speechSynthesis) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.1; // Slightly higher pitch for child-friendly voice
    
    speechSynthesis.speak(utterance);
  };
  
  const handleNext = () => {
    if (activeStep < exercise.instructions.length - 1) {
      setActiveStep(prev => prev + 1);
      // Award points for progress through the exercise
      addPoints(5, 'Exercise progress');
    } else {
      // Exercise completed
      handleComplete();
    }
  };
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  const handleComplete = () => {
    setIsCompleted(true);
    endActivitySession();
    
    // Award completion points
    addPoints(50, 'Completed exercise');
    
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {exercise.name}
      </Typography>
      
      <Typography variant="body1" paragraph>
        {exercise.description}
      </Typography>
      
      {/* Exercise image or video */}
      {(exercise.imageUrl || exercise.videoUrl) && (
        <Card sx={{ mb: 3, overflow: 'hidden' }}>
          {exercise.videoUrl ? (
            <video
              controls
              width="100%"
              poster={exercise.imageUrl}
              style={{ maxHeight: 300, objectFit: 'cover' }}
            >
              <source src={exercise.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (            <CardMedia
              component="img"
              image={exercise.imageUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80'}
              alt={exercise.name}
              sx={{ maxHeight: 300, objectFit: 'cover' }}
            />
          )}
        </Card>
      )}
      
      {/* Difficulty indicator */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Typography variant="body2">
          <strong>Difficulty:</strong>
        </Typography>
        <Typography 
          variant="body2" 
          color={
            exercise.difficulty === 'beginner' ? 'success.main' :
            exercise.difficulty === 'intermediate' ? 'warning.main' :
            'error.main'
          }
        >
          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
        </Typography>
        
        <Typography variant="body2" sx={{ ml: 2 }}>
          <strong>Age Range:</strong> {exercise.minAge}-{exercise.maxAge} years
        </Typography>
      </Box>
      
      {/* Step-by-step instructions */}
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
        {exercise.instructions.map((instruction, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography variant="subtitle1">Step {index + 1}</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1">{instruction}</Typography>
              <Box sx={{ mb: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mr: 1 }}
                >
                  {index === exercise.instructions.length - 1 ? 'Finish' : 'Next'}
                </Button>
                {index > 0 && (
                  <Button
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
                
                {index < exercise.instructions.length - 1 && (
                  <Button
                    sx={{ ml: 2 }}
                    onClick={() => speakInstruction(instruction)}
                  >
                    Repeat
                  </Button>
                )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      
      {/* Completion message */}
      {isCompleted && (
        <Box sx={{ p: 3, bgcolor: 'success.light', borderRadius: 1, color: 'white' }}>
          <Typography variant="h6">
            Great job! Exercise completed!
          </Typography>
          <Typography variant="body2">
            You've earned points for completing this exercise.
          </Typography>
        </Box>
      )}
      
      {/* Tracking status warning */}
      {!isTracking && (
        <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, mt: 2 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Motion tracking is not active. Enable tracking for form analysis.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ExerciseGuidance;
