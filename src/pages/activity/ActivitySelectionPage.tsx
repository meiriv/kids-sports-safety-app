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
import { TFunction } from 'i18next';
import { useLanguage } from '../../context/LanguageContext';

// Available activity types with translations
const getActivityTypes = (t: TFunction, isRTL: boolean) => [
  {
    id: 'freestyle',
    name: t('activities.freestyle.title'),
    description: t('activities.freestyle.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/freestyle-play.svg`,
    level: isRTL ? 'כל הרמות' : 'All levels',
    duration: '5-15 min',
    pointsEstimate: '50-150',
    emoji: '🏃‍♂️',
  },
  {
    id: 'dance',
    name: t('activities.dance.title'),
    description: t('activities.dance.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/dance-party.svg`,
    level: isRTL ? 'כל הרמות' : 'All levels',
    duration: isRTL ? '5-15 דק\'' : '5-15 min',
    pointsEstimate: '50-200',
    emoji: '💃',
  },
  {
    id: 'sports',
    name: t('activities.sports.title'),
    description: t('activities.sports.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/sports-practice.svg`,
    level: isRTL ? 'כל הרמות' : 'All levels',
    duration: isRTL ? '5-15 דק\'' : '5-15 min',
    pointsEstimate: '50-150',
    emoji: '⚽',
  }
];

const ActivitySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const activityTypes = getActivityTypes(t, isRTL);

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
            <Box sx={{ position: 'relative', zIndex: 2 }}>          <Typography variant="h4" fontWeight="bold" gutterBottom align={isRTL ? 'right' : 'left'}>
                {isRTL ? 'בואו נתחיל לזוז! 🎮' : 'Let\'s Get Moving! 🎮'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }} align={isRTL ? 'right' : 'left'}>
                {isRTL 
                  ? 'בחרו את הפעילות האהובה עליכם והתחילו להקליט עם המצלמה. קפצו, רקדו ושחקו כדי להרוויח נקודות ופרסים מרגשים!'
                  : 'Choose your favorite activity and start recording with the camera. Jump, dance, and play to earn exciting points and rewards!'}
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
            }}>              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }} align={isRTL ? 'right' : 'left'}>
                {isRTL ? 'יתרונות:' : 'Benefits:'}
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: 1, 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }} align={isRTL ? 'right' : 'left'}>
                <Box component="span" sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0, fontSize: '18px' }}>✅</Box>
                {isRTL ? 'תהנו תוך כדי פעילות גופנית' : 'Have fun while staying active'}
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: 1, 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }} align={isRTL ? 'right' : 'left'}>
                <Box component="span" sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0, fontSize: '18px' }}>✅</Box>
                {isRTL ? 'צברו נקודות והישגים' : 'Earn points and achievements'}
              </Typography>
              <Typography variant="body2" sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }} align={isRTL ? 'right' : 'left'}>
                <Box component="span" sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0, fontSize: '18px' }}>✅</Box>
                {isRTL ? 'עקבו אחר ההתקדמות והמיומנויות שלכם' : 'Track your progress and skills'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: isRTL ? 'right' : 'left' }}>
        {isRTL ? 'בחרו סוג פעילות:' : 'Select Activity Type:'}
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
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                  }}>
                    <Typography 
                      variant="h5" 
                      component="div" 
                      fontWeight="bold"
                      sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0 }}
                      align={isRTL ? 'right' : 'left'}
                    >
                      {activity.name}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {activity.emoji}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2 }}
                    align={isRTL ? 'right' : 'left'}
                  >
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
                    borderRadius: 2,
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                  }}>
                    <Typography variant="body2" sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0 }}>
                      {isRTL ? 'נקודות לצבירה:' : 'Earn:'}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {isRTL 
                        ? `${activity.pointsEstimate} נקודות`
                        : `${activity.pointsEstimate} points`
                      }
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
