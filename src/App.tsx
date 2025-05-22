import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { MotionProvider } from './context/MotionContext';
import { LanguageProvider } from './context/LanguageContext';
import './i18n/i18n'; // Import i18n configuration
import './App.css';

// Pages
import HomePage from './pages/home/HomePage';
import AuthPage from './pages/auth/AuthPage';
import ExerciseDetailPage from './pages/exercise-detail/ExerciseDetailPage';
import ActivityPage from './pages/activity/ActivityPage';
import ActivitySelectionPage from './pages/activity/ActivitySelectionPage';
import SettingsPage from './pages/settings/SettingsPage';
import Layout from './components/layout/Layout';

// Theme creation is now handled by LanguageContext to support RTL

function App() {
  return (
    <LanguageProvider>
      {/* Theme provider is now inside LanguageProvider because LanguageContext provides its own ThemeProvider */}
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
    </LanguageProvider>
  );
}

export default App;
