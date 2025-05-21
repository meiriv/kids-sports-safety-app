import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  Grid,
  Link as MuiLink
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  
  const { login, register, resetPassword, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setForgotPassword(false);
    setResetEmailSent(false);
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await register(email, password, displayName);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (err) {
      console.error('Password reset error:', err);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main', 
              fontFamily: '"Comic Sans MS", cursive, sans-serif' 
            }}
          >
            Kids Sports Safety App
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            {tabIndex === 0 ? 'Sign in to your account' : 'Create a new account'}
          </Typography>
        </Box>
        
        {!forgotPassword ? (
          <>
            <Tabs 
              value={tabIndex} 
              onChange={handleTabChange} 
              variant="fullWidth" 
              sx={{ mb: 3 }}
            >
              <Tab label="Sign In" />
              <Tab label="Register" />
            </Tabs>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {tabIndex === 0 ? (
              <form onSubmit={handleLogin}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <MuiLink
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => setForgotPassword(true)}
                    sx={{ textDecoration: 'none' }}
                  >
                    Forgot password?
                  </MuiLink>
                </Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <TextField
                  label="Display Name"
                  fullWidth
                  margin="normal"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  disabled={loading}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  helperText="Password must be at least 8 characters"
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Register'}
                </Button>
                
                <Typography variant="body2" color="textSecondary" align="center">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </Typography>
              </form>
            )}
          </>
        ) : (
          <Box>
            {resetEmailSent ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset instructions have been sent to your email.
              </Alert>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Reset Your Password
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Enter your email address and we'll send you instructions to reset your password.
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <form onSubmit={handleResetPassword}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setForgotPassword(false)}
                      disabled={loading}
                    >
                      Back to Login
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                    </Button>
                  </Box>
                </form>
              </>
            )}
            
            {resetEmailSent && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setForgotPassword(false);
                  setResetEmailSent(false);
                }}
                sx={{ mt: 2 }}
              >
                Back to Login
              </Button>
            )}
          </Box>
        )}
      </Paper>
      
      {/* Bottom links */}
      <Grid container justifyContent="center" spacing={2} sx={{ mt: 3 }}>
        <Grid item>
          <MuiLink
            href="#"
            variant="body2"
            color="textSecondary"
            underline="hover"
          >
            Privacy Policy
          </MuiLink>
        </Grid>
        <Grid item>
          <MuiLink
            href="#"
            variant="body2"
            color="textSecondary"
            underline="hover"
          >
            Terms of Service
          </MuiLink>
        </Grid>
        <Grid item>
          <MuiLink
            href="#"
            variant="body2"
            color="textSecondary"
            underline="hover"
          >
            Help & Support
          </MuiLink>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthPage;
