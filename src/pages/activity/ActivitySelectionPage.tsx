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
  CardMedia,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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
    duration: isRTL ? '5-15 דק\'' : '5-15 min',
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
  },  {
    id: 'stretching',
    name: t('activities.stretching.title'),
    description: t('activities.stretching.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/stretching.svg`,
    level: isRTL ? 'כל הרמות' : 'All levels',
    duration: isRTL ? '10-15 דק\'' : '10-15 min',
    pointsEstimate: '30-60',
    emoji: '🧘‍♂️',
  },
  {
    id: 'pushups',
    name: t('activities.pushups.title'),
    description: t('activities.pushups.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/push-ups.svg`,
    level: isRTL ? 'בינוני' : 'Intermediate',
    duration: isRTL ? '5-10 דק\'' : '5-10 min',
    pointsEstimate: '40-100',
    emoji: '💪',
  },
  {
    id: 'jumpingjacks',
    name: t('activities.jumpingjacks.title'),
    description: t('activities.jumpingjacks.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/jumping-jacks.svg`,
    level: isRTL ? 'מתחיל' : 'Beginner',
    duration: isRTL ? '5-10 דק\'' : '5-10 min',
    pointsEstimate: '40-80',
    emoji: '⭐',
  },  {
    id: 'plank',
    name: t('activities.plank.title'),
    description: t('activities.plank.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/plank.svg`,
    level: isRTL ? 'בינוני' : 'Intermediate',
    duration: isRTL ? '3-6 דק\'' : '3-6 min',
    pointsEstimate: '30-70',
    emoji: '🏋️‍♀️',
  },  {
    id: 'resistance',
    name: t('activities.resistance.title'),
    description: t('activities.resistance.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/resistance.svg`,
    level: isRTL ? 'כל הרמות' : 'All levels',
    duration: isRTL ? '10-15 דק\'' : '10-15 min',
    pointsEstimate: '40-100',
    emoji: '🔄',
  },
  {
    id: 'squats',
    name: t('activities.squats.title'),
    description: t('activities.squats.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/squats.svg`,
    level: isRTL ? 'מתחיל' : 'Beginner',
    duration: isRTL ? '5-10 דק\'' : '5-10 min',
    pointsEstimate: '30-70',
    emoji: '🦵',
  },  {
    id: 'yoga',
    name: t('activities.yoga.title'),
    description: t('activities.yoga.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/yoga.svg`,
    level: isRTL ? 'כל הרמות' : 'All levels',
    duration: isRTL ? '10-30 דק\'' : '10-30 min',
    pointsEstimate: '50-150',
    emoji: '🧘',
  },  {
    id: 'crunches',
    name: t('activities.crunches.title'),
    description: t('activities.crunches.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/crunches.svg`,
    level: isRTL ? 'בינוני' : 'Intermediate',
    duration: isRTL ? '5-10 דק\'' : '5-10 min',
    pointsEstimate: '30-80',
    emoji: '🦸‍♂️',
  },  {
    id: 'jumprope',
    name: t('activities.jumprope.title'),
    description: t('activities.jumprope.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/jumprope.svg`,
    level: isRTL ? 'מתחיל' : 'Beginner',
    duration: isRTL ? '5-15 דק\'' : '5-15 min',
    pointsEstimate: '50-120',
    emoji: '⏱️',
  },  {
    id: 'boxing',
    name: t('activities.boxing.title'),
    description: t('activities.boxing.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/boxing.svg`,
    level: isRTL ? 'בינוני' : 'Intermediate',
    duration: isRTL ? '10-20 דק\'' : '10-20 min',
    pointsEstimate: '60-150',
    emoji: '🥊',
  },  {
    id: 'stepups',
    name: t('activities.stepups.title'),
    description: t('activities.stepups.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/stepups.svg`,
    level: isRTL ? 'מתחיל' : 'Beginner',
    duration: isRTL ? '5-15 דק\'' : '5-15 min',
    pointsEstimate: '30-90',
    emoji: '🪜',
  },  {
    id: 'weightlifting',
    name: t('activities.weightlifting.title'),
    description: t('activities.weightlifting.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/weightlifting.svg`,
    level: isRTL ? 'מתקדם' : 'Advanced',
    duration: isRTL ? '15-30 דק\'' : '15-30 min',
    pointsEstimate: '70-180',
    emoji: '🏋️',
  },  {
    id: 'handstands',
    name: t('activities.handstands.title'),
    description: t('activities.handstands.description'),
    imageUrl: `${process.env.PUBLIC_URL}/assets/exercises/handstands.svg`,
    level: isRTL ? 'מתקדם' : 'Advanced',
    duration: isRTL ? '5-10 דק\'' : '5-10 min',
    pointsEstimate: '50-100',
    emoji: '🤸‍♂️',
  }
];

const ActivitySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const allActivityTypes = getActivityTypes(t, isRTL);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [difficultyFilter, setDifficultyFilter] = React.useState('all');
  
  // Filter activities based on search and difficulty filter
  const activityTypes = React.useMemo(() => {
    return allActivityTypes.filter(activity => {
      const matchesSearch = searchTerm === '' || 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDifficulty = difficultyFilter === 'all' || 
        activity.level.toLowerCase().includes(difficultyFilter.toLowerCase());
      
      return matchesSearch && matchesDifficulty;
    });
  }, [allActivityTypes, searchTerm, difficultyFilter]);
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>      <Button
        variant="outlined"
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
        startIcon={!isRTL && <Box component="span">←</Box>}
        endIcon={isRTL && <Box component="span">→</Box>}
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
      </Paper>        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ textAlign: isRTL ? 'right' : 'left' }}>
            {isRTL ? 'בחרו סוג פעילות:' : 'Select Activity Type:'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isRTL 
              ? `${activityTypes.length} מתוך ${allActivityTypes.length} פעילויות זמינות` 
              : `${activityTypes.length} of ${allActivityTypes.length} activities available`}
          </Typography>
        </Box>
        
        {/* Search and Filter */}
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 2, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box 
            component="input"
            placeholder={isRTL ? "חפשו פעילות..." : "Search activities..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              border: '1px solid #ddd',
              borderRadius: 1,
              p: 1.5,
              width: { xs: '100%', sm: '60%' },
              fontSize: '1rem',
              textAlign: isRTL ? 'right' : 'left',
              direction: isRTL ? 'rtl' : 'ltr',
              '&:focus': {
                outline: 'none',
                borderColor: 'primary.main'
              }
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {isRTL ? 'סנן לפי רמה:' : 'Filter by level:'}
            </Typography>
            
            <Box 
              component="select"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              sx={{
                border: '1px solid #ddd',
                borderRadius: 1,
                p: 1.5,
                fontSize: '0.9rem',
                textAlign: isRTL ? 'right' : 'left',
                direction: isRTL ? 'rtl' : 'ltr'
              }}
            >
              <Box component="option" value="all">{isRTL ? 'כל הרמות' : 'All Levels'}</Box>
              <Box component="option" value="beginner">{isRTL ? 'מתחיל' : 'Beginner'}</Box>
              <Box component="option" value="intermediate">{isRTL ? 'בינוני' : 'Intermediate'}</Box>
              <Box component="option" value="advanced">{isRTL ? 'מתקדם' : 'Advanced'}</Box>
            </Box>
          </Box>
        </Paper>      {activityTypes.length > 0 ? (
        <Grid container spacing={2}>
          {activityTypes.map(activity => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={activity.id}>
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
                    <Grid container spacing={1} sx={{ mb: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
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
      ) : (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.02)'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {isRTL ? 'לא נמצאו פעילויות התואמות לחיפוש שלך' : 'No activities match your search'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isRTL 
              ? 'נסו לשנות את מונחי החיפוש או את פילטר הרמה' 
              : 'Try changing your search terms or level filter'}
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchTerm('');
              setDifficultyFilter('all');
            }}
          >
            {isRTL ? 'נקה פילטרים' : 'Clear filters'}
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default ActivitySelectionPage;
