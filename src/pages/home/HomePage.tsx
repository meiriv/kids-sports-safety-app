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
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

// Helper component for stats card
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const { isRTL } = useLanguage();
  
  return (
    <Card elevation={3} sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: isRTL ? 'flex-end' : 'flex-start',
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
        <Typography variant="h5" component="div" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" align={isRTL ? 'right' : 'left'}>
          {isRTL ? 
            (title === "Weekly Score" ? "ניקוד שבועי" :
             title === "Active Days" ? "ימי פעילות" :
             title === "Exercises" ? "תרגילים" :
             title === "Perfect Form" ? "צורה מושלמת" : title) 
            : title}
        </Typography>
      </Box>
    </Card>
  );
};

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
}) => {
  const { isRTL } = useLanguage();
  
  // Localized difficulty text
  const getDifficultyText = (diff: string) => {
    if (isRTL) {
      return diff === 'beginner' ? 'מתחיל' : 
             diff === 'intermediate' ? 'בינוני' : 'מתקדם';
    }
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };
  
  return (
    <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>      <CardMedia
          component="img"
          height="140"
          image={imageUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=140&q=80'}
          alt={title}
        />      <CardContent>
        <Typography variant="h6" component="div" align={isRTL ? 'right' : 'left'}>
          {isRTL ? 
            (title === 'Jumping Jacks' ? 'קפיצות ג׳ק' :
             title === 'Squats' ? 'סקוואטים' : 
             title === 'Arm Circles' ? 'סיבובי ידיים' : title) 
            : title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', mt: 1 }}>
          <Typography 
            variant="caption" 
            color={
              difficulty === 'beginner' ? 'success.main' : 
              difficulty === 'intermediate' ? 'warning.main' : 
              'error.main'
            }
            sx={{ fontWeight: 'bold' }}
          >
            {getDifficultyText(difficulty)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isRTL ? `גילאים ${ageRange}` : `Ages ${ageRange}`}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  weeklyScore: number;
}

const mockFriends: Friend[] = [
  { id: '1', name: 'ירון', avatarUrl: '', weeklyScore: 410 },
  { id: '2', name: 'אייל', avatarUrl: '', weeklyScore: 350 },
  { id: '3', name: 'מאור', avatarUrl: '', weeklyScore: 290 },
];

const FriendsLeaderboard: React.FC<{ friends: Friend[] }> = ({ friends }) => {
  const { isRTL } = useLanguage();
  
  return (
  <Paper elevation={2} sx={{ p: 2, borderRadius: 3, mb: 4 }}>
    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }} align={isRTL ? 'right' : 'left'}>
      {isRTL ? 'טבלת חברים מובילים' : 'Friends Leaderboard'}
    </Typography>
    <Grid container spacing={2}>
      {friends.map(friend => (
        <Grid item xs={12} sm={4} key={friend.id}>          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }}>
            <Avatar src={friend.avatarUrl}>
              {friend.name[0]}
            </Avatar><Box>
              <Typography variant="subtitle1" fontWeight="bold" align={isRTL ? 'right' : 'left'}>{friend.name}</Typography>
              <Typography variant="body2" color="text.secondary" align={isRTL ? 'right' : 'left'}>
                {isRTL ? 'ניקוד שבועי: ' : 'Weekly Score: '}<b>{friend.weeklyScore}</b>
              </Typography>
            </Box>
          </Box>
        </Grid>      ))}
    </Grid>
  </Paper>
  );
};


const HomePage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
    // Simulated data - in a real app this would be fetched from an API
  const recentActivities = [
    {
      id: 'act1',
      type: isRTL ? t('activities.exercises.jumpingJacks.title') : 'Jumping Jacks',
      date: '2023-05-19',
      duration: isRTL ? '10 דקות' : '10 minutes',
      points: 120
    },
    {
      id: 'act2',
      type: isRTL ? t('activities.exercises.squats.title') : 'Squats',
      date: '2023-05-18',
      duration: isRTL ? '8 דקות' : '8 minutes',
      points: 95
    }
  ];    const recommendedExercises = [    {
      id: 'resistance',
      title: isRTL ? t('activities.resistance.title', 'פעילויות גומי') : 'Ring/Rubber Band Activities',
      difficulty: 'beginner',
      ageRange: '5-12',
      imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/resistance.png`
    },    {
      id: 'dance',
      title: isRTL ? t('activities.dance.title', 'ריקוד') : 'Dance',
      difficulty: 'beginner',
      ageRange: '5-12',
      imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/dance-party.jpeg`
    },
    {
      id: 'weightlifting',
      title: isRTL ? t('activities.weightlifting.title', 'הרמת משקולות') : 'Weightlifting',
      difficulty: 'intermediate',
      ageRange: '8-12',
      imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/weightlifting.png`
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
        }}      >        <Grid container spacing={3} alignItems="center" direction={isRTL ? 'row-reverse' : 'row'}>          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight="bold" gutterBottom align={isRTL ? 'right' : 'left'}>
              {t('home.welcome')}, {currentUser?.displayName || (isRTL ? 'חבר' : 'Friend')}!
            </Typography>
            <Typography variant="body1" align={isRTL ? 'right' : 'left'}>
              {t('home.subtitle')}
            </Typography>
          </Grid><Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
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
              {t('home.startActivity')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
        {/* Stats row */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: isRTL ? 'right' : 'left' }}>
        {t('home.stats')}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Weekly Score"
            value="320"
            icon="🏆"
            color="#FFD700"
          />
        </Grid>       
         <Grid item xs={6} sm={3}>
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
        </Grid>      
      </Grid>
       {/* Friends leaderboard */}
      <FriendsLeaderboard friends={mockFriends} />
        {/* Quick Actions */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: isRTL ? 'right' : 'left' }}>
        {isRTL ? 'פעולות מהירות' : 'Quick Actions'}
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
                <Box component="span" sx={{ mr: 1, fontSize: '28px' }}>🏃‍♂️</Box>                <Typography variant="h6" component="div" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
                  {isRTL ? 'פעילות חופשית' : 'Quick Freestyle'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }} align={isRTL ? 'right' : 'left'}>
                {isRTL ? 'התחל לזוז מיד עם פעילות חופשית' : 'Start moving right away with freestyle activity'}
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
                <Box component="span" sx={{ mr: 1, fontSize: '28px' }}>💃</Box>                <Typography variant="h6" component="div" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
                  {isRTL ? 'זמן ריקוד!' : 'Dance Time!'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }} align={isRTL ? 'right' : 'left'}>
                {isRTL ? 'התחל לרקוד כדי לצבור נקודות וליהנות' : 'Start dancing to earn points and have fun'}
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
                <Box component="span" sx={{ mr: 1, fontSize: '28px' }}>🎯</Box>                <Typography variant="h6" component="div" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
                  {isRTL ? 'פעילויות נוספות' : 'More Activities'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1 }} align={isRTL ? 'right' : 'left'}>
                {isRTL ? 'צפה בכל סוגי הפעילויות הזמינות' : 'See all available activity types'}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
        {/* Recent activities */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: isRTL ? 'right' : 'left' }}>
        {isRTL ? 'פעילויות אחרונות' : 'Recent Activities'}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {recentActivities.length > 0 ? (
          recentActivities.map(activity => (          <Grid item xs={12} sm={6} md={4} key={activity.id}>
              <Card elevation={2} sx={{ borderRadius: 2 }}>                <CardActionArea onClick={() => navigate(`/activities/${activity.id}`)}>                  <CardContent>
                    <Typography variant="h6" component="div" align={isRTL ? 'right' : 'left'}>
                      {activity.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} align={isRTL ? 'right' : 'left'}>
                      {new Date(activity.date).toLocaleDateString(isRTL ? 'he-IL' : 'en-US')} • {activity.duration}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: 'primary.light',
                      color: 'white',
                      borderRadius: 1,
                      px: 1.5,
                      py: 0.5,
                      width: 'fit-content',
                      marginLeft: isRTL ? 'auto' : 0,
                      marginRight: isRTL ? 0 : 'auto'
                    }}>
                      <Typography variant="body2" fontWeight="bold">
                        {activity.points} {isRTL ? 'נקודות' : 'points'}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>              <Typography variant="body1" color="textSecondary">
                {isRTL ? 'לא נמצאו פעילויות אחרונות. הגיע הזמן להתחיל אחת חדשה!' : 'No recent activities found. Time to start a new one!'}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/activities/new')}
              >
                {isRTL ? 'התחל פעילות' : 'Start an Activity'}
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
        {/* Recommended exercises */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: isRTL ? 'right' : 'left' }}>
        {t('home.recommendedExercises')}
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
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: isRTL ? 'right' : 'left' }}>
        {t('home.achievements')}
      </Typography>
      <ActivityAchievements />
      
      {/* Emergency alert component */}
      <EmergencyAlert />
    </Container>
  );
};

export default HomePage;
