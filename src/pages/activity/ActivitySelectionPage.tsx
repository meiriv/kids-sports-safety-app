import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardActionArea,
  CardContent,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

// Available activity types with improved descriptions and kid-friendly details
const activityTypes = [  {    id: 'freestyle',
    name: 'Freestyle Play',
    description: 'Move freely - run, jump, hop, and have tons of fun!',
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/freestyle-play.svg`,
    level: 'All levels',
    duration: '5-15 min',
    pointsEstimate: '50-150',
    emoji: '🏃‍♂️',
  },{    id: 'dance',
    name: 'Dance Party',
    description: 'Show off your coolest dance moves and grooves!',
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/dance-party.svg`,
    level: 'All levels',
    duration: '5-15 min',
    pointsEstimate: '50-200',
    emoji: '💃',
  },  {    id: 'sports',
    name: 'Sports Practice',
    description: 'Practice your favorite sports skills and movements',
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/sports-practice.svg`,
    level: 'All levels',
    duration: '5-15 min',
    pointsEstimate: '50-150',
    emoji: '⚽',
  }
];

const ActivitySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>      <Button
        variant="outlined"
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        {t('buttons.back')}
      </Button><Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          backgroundImage: 'linear-gradient(to right, #4CAF50 0%, #80E27E 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <Box 
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            zIndex: 1
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            bottom: -30,
            left: '30%',
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            zIndex: 1
          }}
        />
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={7}>
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Let's Get Moving! 🎮
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Choose your favorite activity and start recording with the camera.
                Jump, dance, and play to earn exciting points and rewards!
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                flexWrap: 'wrap'
              }}>
                <Box component="span" sx={{ fontSize: '24px' }}>🏃‍♀️</Box>
                <Box component="span" sx={{ fontSize: '24px' }}>🤸‍♂️</Box>
                <Box component="span" sx={{ fontSize: '24px' }}>⚽</Box>
                <Box component="span" sx={{ fontSize: '24px' }}>🏀</Box>
                <Box component="span" sx={{ fontSize: '24px' }}>💃</Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: 2,
              p: 2,
              position: 'relative',
              zIndex: 2
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Benefits:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ mr: 1, fontSize: '18px' }}>✅</Box>
                Have fun while staying active
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ mr: 1, fontSize: '18px' }}>✅</Box>
                Earn points and achievements
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ mr: 1, fontSize: '18px' }}>✅</Box>
                Track your progress and skills
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Select Activity Type:
      </Typography>
      
      <Grid container spacing={3}>
        {activityTypes.map(activity => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3, 
              overflow: 'hidden', 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.03)' }
            }}>
              <CardActionArea 
                onClick={() => navigate(`/activities/${activity.id}`)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={activity.imageUrl}
                  alt={activity.name}
                />                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography 
                      variant="h5" 
                      component="div" 
                      fontWeight="bold"
                      sx={{ mr: 1 }}
                    >
                      {activity.name}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {activity.emoji}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {activity.description}
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ mb: 1 }}>
                    <Grid item>
                      <Box 
                        sx={{ 
                          display: 'inline-block',
                          bgcolor: 'primary.light', 
                          color: 'white', 
                          px: 2, 
                          py: 0.5, 
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {activity.level}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box 
                        sx={{ 
                          display: 'inline-block',
                          bgcolor: 'secondary.light', 
                          color: 'white', 
                          px: 2, 
                          py: 0.5, 
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {activity.duration}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mt: 1.5,
                    bgcolor: 'success.light',
                    color: 'white',
                    py: 0.7,
                    px: 2,
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Earn:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {activity.pointsEstimate} points
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ActivitySelectionPage;
