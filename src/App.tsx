import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { MotionProvider } from './context/MotionContext';
import './App.css';

// Pages
import HomePage from './pages/home/HomePage';
import AuthPage from './pages/auth/AuthPage';
import ExerciseDetailPage from './pages/exercise-detail/ExerciseDetailPage';
import ActivityPage from './pages/activity/ActivityPage';
import ActivitySelectionPage from './pages/activity/ActivitySelectionPage';
import SettingsPage from './pages/settings/SettingsPage';
import Layout from './components/layout/Layout';

// Create a custom theme with child-friendly colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Friendly green
      light: '#80E27E',
      dark: '#087f23',
    },
    secondary: {
      main: '#FF9800', // Cheerful orange
      light: '#FFB74D',
      dark: '#C66900',
    },
    error: {
      main: '#F44336', // Clear red for emergencies
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#2196F3',
    },
    background: {
      default: '#F5F5F5', // Light background
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // More modern approach without all-caps buttons
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8, // Softer corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rounded buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Rounded cards
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <GamificationProvider>
          <MotionProvider>
            <EmergencyProvider>
              <Router>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="exercises/:exerciseId" element={<ExerciseDetailPage />} />
                    <Route path="activities/new" element={<ActivitySelectionPage />} />
                    <Route path="activities/:activityId" element={<ActivityPage />} />
                    <Route path="activities" element={<Navigate to="/" />} />
                    <Route path="leaderboard" element={<Navigate to="/" />} />
                    <Route path="profile" element={<Navigate to="/" />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Router>
            </EmergencyProvider>
          </MotionProvider>
        </GamificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
