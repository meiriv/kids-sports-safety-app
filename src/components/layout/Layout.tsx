import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  Avatar,
  Button,
  Container,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '../../context/AuthContext';

// Navigation items for the drawer
const navItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Activities', icon: <FitnessCenterIcon />, path: '/activities' },
  { text: 'Leaderboard', icon: <EmojiEventsIcon />, path: '/leaderboard' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Layout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close drawer when route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [location]);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      handleProfileMenuClose();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top app bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              fontFamily: '"Comic Sans MS", cursive, sans-serif'
            }}
          >
            Kids Sports Safety
          </Typography>
          
          {currentUser ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={handleProfileMenuOpen}
                sx={{ p: 0, ml: 2 }}
              >
                <Avatar 
                  alt={currentUser.displayName} 
                  src={currentUser.avatarUrl || '/avatar-placeholder.png'}
                />
              </IconButton>
              <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={handleProfileMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Side navigation drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          {currentUser && (
            <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
              <Avatar
                alt={currentUser.displayName}
                src={currentUser.avatarUrl || '/avatar-placeholder.png'}
                sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {currentUser.displayName}
              </Typography>
              <Box sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                borderRadius: 1,
                py: 0.5,
                px: 1,
                mt: 1,
                display: 'inline-block'
              }}>
                <Typography variant="body2" fontWeight="bold">
                  320 Points
                </Typography>
              </Box>
            </Box>
          )}
          
          <Divider />
          
          <List>
            {navItems.map((item) => (              <ListItem 
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          
          <Divider />
          
          {/* Emergency button in the drawer */}
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={() => navigate('/emergency')}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              Emergency Help
            </Button>
          </Box>
        </Box>
      </Drawer>
      
      {/* Main content area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 0,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.background.default
        }}
      >
        <Toolbar /> {/* Spacer for app bar */}
        <Container maxWidth={false} disableGutters>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
