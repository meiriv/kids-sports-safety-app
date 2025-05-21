import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardMedia,
  CardActionArea,
  CircularProgress,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ActivityAchievements from '../../components/gamification/ActivityAchievements';
import EmergencyAlert from '../../components/emergency/EmergencyAlert';

// Helper component for stats card
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card elevation={3} sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      p: 2,
      position: 'relative'
    }}>
      <Avatar 
        sx={{ 
          bgcolor: color, 
          width: 48, 
          height: 48, 
          mb: 1 
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h5" component="div" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Box>
  </Card>
);

// Helper component for exercise card
interface ExerciseCardProps {
  id: string;
  title: string;
  difficulty: string;
  ageRange: string;
  imageUrl: string;
  onClick: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  id, 
  title,
  difficulty,
  ageRange,
  imageUrl, 
  onClick 
}) => (
  <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
    <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl || 'https://via.placeholder.com/300x140?text=Exercise+Image'}
        alt={title}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography 
            variant="caption" 
            color={
              difficulty === 'beginner' ? 'success.main' : 
              difficulty === 'intermediate' ? 'warning.main' : 
              'error.main'
            }
            sx={{ fontWeight: 'bold' }}
          >
            {difficulty}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ages {ageRange}
          </Typography>
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
);

const HomePage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Simulated data - in a real app this would be fetched from an API
  const recentActivities = [
    {
      id: 'act1',
      type: 'Jumping Jacks',
      date: '2023-05-19',
      duration: '10 minutes',
      points: 120
    },
    {
      id: 'act2',
      type: 'Squats',
      date: '2023-05-18',
      duration: '8 minutes',
      points: 95
    }
  ];
  
  const recommendedExercises = [
    {
      id: 'jumping-jacks',
      title: 'Jumping Jacks',
      difficulty: 'beginner',
      ageRange: '5-12',
      imageUrl: 'https://via.placeholder.com/300x140?text=Jumping+Jacks'
    },
    {
      id: 'squats',
      title: 'Squats',
      difficulty: 'intermediate',
      ageRange: '6-12',
      imageUrl: 'https://via.placeholder.com/300x140?text=Squats'
    },
    {
      id: 'arm-circles',
      title: 'Arm Circles',
      difficulty: 'beginner',
      ageRange: '5-10',
      imageUrl: 'https://via.placeholder.com/300x140?text=Arm+Circles'
    }
  ];
  
  useEffect(() => {
    // Simulating data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Redirect to auth page if not logged in
    if (!authLoading && !currentUser) {
      navigate('/auth');
    }
  }, [currentUser, authLoading, navigate]);
  
  if (authLoading || loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Welcome section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          backgroundImage: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
          color: 'white'
        }}
      >        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {currentUser?.displayName || 'Friend'}!
            </Typography>
            <Typography variant="body1">
              Ready for today's fun exercises? Let's get moving and earn some points!
            </Typography>
          </Grid>          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
                py: 1.5,
                px: 4,
                borderRadius: 3,
                fontWeight: 'bold'
              }}
              onClick={() => navigate('/activities/new')}
            >
              Start New Activity
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Stats row */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Your Activity Stats
      </Typography>      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Weekly Score"
            value="320"
            icon="🏆"
            color="#FFD700"
          />
        </Grid>        <Grid item xs={6} sm={3}>
          <StatCard
            title="Active Days"
            value="5"
            icon="📅"
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Exercises"
            value="12"
            icon="🏃"
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Perfect Form"
            value="87%"
            icon="⭐"
            color="#FF9800"
          />
        </Grid>      </Grid>
      
      {/* Quick Actions */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card 
            sx={{ 
              height: '100%', 
              borderRadius: 3, 
              bgcolor: 'primary.main',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <CardActionArea 
              onClick={() => navigate('/activities/freestyle')}
              sx={{ height: '100%', p: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ mr: 1, fontSize: '28px' }}>🏃‍♂️</Box>
                <Typography variant="h6" component="div" fontWeight="bold">
                  Quick Freestyle
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Start moving right away with freestyle activity
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card 
            sx={{ 
              height: '100%', 
              borderRadius: 3, 
              bgcolor: 'secondary.main',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <CardActionArea 
              onClick={() => navigate('/activities/dance')}
              sx={{ height: '100%', p: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ mr: 1, fontSize: '28px' }}>💃</Box>
                <Typography variant="h6" component="div" fontWeight="bold">
                  Dance Time!
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Start dancing to earn points and have fun
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card 
            sx={{ 
              height: '100%', 
              borderRadius: 3, 
              bgcolor: '#FF9800',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <CardActionArea 
              onClick={() => navigate('/activities/new')}
              sx={{ height: '100%', p: 2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box component="span" sx={{ mr: 1, fontSize: '28px' }}>🎯</Box>
                <Typography variant="h6" component="div" fontWeight="bold">
                  More Activities
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                See all available activity types
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent activities */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Recent Activities
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {recentActivities.length > 0 ? (
          recentActivities.map(activity => (          <Grid item xs={12} sm={6} md={4} key={activity.id}>
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardActionArea onClick={() => navigate(`/activities/${activity.id}`)}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {activity.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {new Date(activity.date).toLocaleDateString()} • {activity.duration}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: 'primary.light',
                      color: 'white',
                      borderRadius: 1,
                      px: 1.5,
                      py: 0.5,
                      width: 'fit-content'
                    }}>
                      <Typography variant="body2" fontWeight="bold">
                        {activity.points} points
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="body1" color="textSecondary">
                No recent activities found. Time to start a new one!
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/activities/new')}
              >
                Start an Activity
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Recommended exercises */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Recommended Exercises
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {recommendedExercises.map(exercise => (          <Grid item xs={12} sm={6} md={4} key={exercise.id}>
            <ExerciseCard
              id={exercise.id}
              title={exercise.title}
              difficulty={exercise.difficulty}
              ageRange={exercise.ageRange}
              imageUrl={exercise.imageUrl}
              onClick={() => navigate(`/exercises/${exercise.id}`)}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Achievements section */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Achievements & Rewards
      </Typography>
      <ActivityAchievements />
      
      {/* Emergency alert component */}
      <EmergencyAlert />
    </Container>
  );
};

export default HomePage;
