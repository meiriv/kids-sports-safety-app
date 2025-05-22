import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Chip,
  LinearProgress,
  Avatar
} from '@mui/material';
import { useGamification } from '../../context/GamificationContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

const ActivityAchievements: React.FC = () => {
  const { 
    userPoints, 
    userAchievements, 
    personalBests,
    currentSession,
    leaderboards,
    getLeaderboardPositions
  } = useGamification();
  
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Get user's positions in various leaderboards
  const leaderboardPositions = getLeaderboardPositions();
  
  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
            {t('gamification.activityStats')}
          </Typography>
          <Chip 
            color="primary" 
            label={isRTL ? `${userPoints} נקודות` : `${userPoints} Points`}
            sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, px: 1 }}
          />
        </Box>
          {/* Current session info */}
        {currentSession && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" align={isRTL ? 'right' : 'left'}>
              {isRTL ? `פעילות נוכחית: ${currentSession.activityType}` : `Current Activity: ${currentSession.activityType}`}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" align={isRTL ? 'right' : 'left'}>
                {isRTL 
                  ? `משך זמן: ${Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000)} שניות` 
                  : `Duration: ${Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000)} seconds`}
              </Typography>
              <Typography variant="body2" align={isRTL ? 'right' : 'left'}>
                {isRTL ? `נקודות שהושגו: ${currentSession.points}` : `Points earned: ${currentSession.points}`}
              </Typography>
            </Box>
          </Box>
        )}
          {/* Level progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="textSecondary" align={isRTL ? 'right' : 'left'}>
              {isRTL ? 'התקדמות ברמה' : 'Level Progress'}
            </Typography>
            <Typography variant="body2" color="textSecondary" align={isRTL ? 'right' : 'left'}>
              {userPoints % 1000} / 1000
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(userPoints % 1000) / 10} 
            sx={{ height: 10, borderRadius: 5, mt: 1 }}
          />
          <Box sx={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', mt: 1 }}>
            <Chip 
              label={isRTL ? `רמה ${Math.floor(userPoints / 1000) + 1}` : `Level ${Math.floor(userPoints / 1000) + 1}`} 
              size="small" 
              color="secondary" 
            />
            <Chip 
              label={isRTL ? `רמה ${Math.floor(userPoints / 1000) + 2}` : `Level ${Math.floor(userPoints / 1000) + 2}`} 
              size="small" 
              variant="outlined" 
            />
          </Box>
        </Box>
          {/* Leaderboard positions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom align={isRTL ? 'right' : 'left'}>
            {isRTL ? 'הדירוגים שלך' : 'Your Rankings'}
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(leaderboardPositions).map(([boardId, position]) => {
              const board = leaderboards.find(b => b.id === boardId);
              if (!board) return null;
              
              return (
                <Grid item xs={6} key={boardId}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1.5, 
                      bgcolor: 'background.default', 
                      borderRadius: 1 
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        width: 36,
                        height: 36,
                        mr: 1.5
                      }}
                    >
                      {position}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {board.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Rank {position} of {board.entries.length}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        
        {/* Personal bests */}
        {Object.keys(personalBests).length > 0 && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Personal Bests
            </Typography>
            <Grid container spacing={1}>
              {Object.entries(personalBests).map(([activity, points]) => (
                <Grid item xs={6} key={activity}>
                  <Box 
                    sx={{ 
                      p: 1.5, 
                      bgcolor: 'background.default', 
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant="body2">
                      {activity}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {points} pts
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
      
      {/* Achievements */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Your Achievements
      </Typography>
      
      {userAchievements.length > 0 ? (
        <Grid container spacing={2}>
          {userAchievements.map(achievement => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card sx={{ display: 'flex', height: '100%' }}>                <CardMedia
                  component="img"
                  sx={{ width: 80 }}
                  image={achievement.iconUrl || `${process.env.PUBLIC_URL}/assets/achievements/${achievement.type || 'star'}-achievement.svg`}
                  alt={achievement.name}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <CardContent sx={{ py: 1, flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {achievement.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {achievement.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1, justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="textSecondary">
                      {achievement.dateEarned.toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label={`+${achievement.pointsAwarded}`} 
                      size="small" 
                      color="primary"
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="textSecondary">
            Complete activities to earn achievements!
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ActivityAchievements;
