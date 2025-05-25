import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types/models';
import googleAuthService from '../services/auth/GoogleAuthService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);  useEffect(() => {
    // Check for authentication status including Google auth
    const checkAuthStatus = async () => {
      try {
        // Check local storage for auth persistence info
        const authProvider = localStorage.getItem('auth_provider');
        
        // First check for Google authentication
        if (authProvider === 'google') {
          try {
            await googleAuthService.init();
            
            const isGoogleSignedIn = await googleAuthService.isSignedIn();
            if (isGoogleSignedIn) {
              const googleUser = await googleAuthService.getUserInfo();
              if (googleUser) {
                // In a production app, use the ID to fetch complete user data from your backend
                const user: User = {
                  id: googleUser.id,
                  displayName: googleUser.name,
                  email: googleUser.email,
                  photoURL: googleUser.picture,
                  // These dates would typically come from your database
                  createdAt: new Date(), 
                  lastLogin: new Date(),
                  provider: 'google'
                };
                
                setCurrentUser(user);
                setLoading(false);
                return;
              }
            } else if (authProvider === 'google') {
              // Clear invalid persistence data
              localStorage.removeItem('auth_provider');
              localStorage.removeItem('google_user_id');
            }
          } catch (googleError) {
            console.error('Error checking Google auth status:', googleError);
            // Clear invalid persistence data
            localStorage.removeItem('auth_provider');
            localStorage.removeItem('google_user_id');
          }
        }        // Fallback to traditional auth or mock for development
        setTimeout(() => {
          // Create a mock user so we can see the UI
          const mockUser: User = {
            id: '123',
            displayName: 'Meir',
            email: 'test@example.com',
            createdAt: new Date(),
            lastLogin: new Date(),
            provider: 'email'
          };
          setCurrentUser(mockUser);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to check authentication status');
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {      // This would be a call to your auth service
      // For now, let's mock a successful login
      const mockUser: User = {
        id: '123',
        displayName: 'Meir',
        email: email,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentUser(mockUser);
    } catch (err) {
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };
  const register = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      // This would be a call to your auth service
      // For now, let's mock a successful registration
      const mockUser: User = {
        id: '123',
        displayName: displayName || 'Meir',
        email: email,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentUser(mockUser);
    } catch (err) {
      setError('Failed to register');
    } finally {
      setLoading(false);
    }
  };  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      // Handle provider-specific logout
      if (currentUser?.provider === 'google') {
        await googleAuthService.signOut();
      } else {
        // Default logout logic
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Clear auth persistence data
      localStorage.removeItem('auth_provider');
      localStorage.removeItem('google_user_id');
      
      // Clear user from state
      setCurrentUser(null);
    } catch (err) {
      setError('Failed to logout');
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      // This would be a call to your auth service
      // For now, let's mock a successful password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      // Attempt to sign in with Google
      const googleUser = await googleAuthService.signIn();
      
      // Check if this user exists in our system (This would be a backend check in production)
      const userExists = await checkIfUserExists(googleUser.email);
      
      // Set up the user object with Google profile data
      const user: User = {
        id: googleUser.id,
        displayName: googleUser.name,
        email: googleUser.email,
        photoURL: googleUser.picture,
        createdAt: userExists ? new Date() : new Date(), // In production, this would come from your database
        lastLogin: new Date(),
        provider: 'google'
      };
      
      if (!userExists) {
        // For a new Google user, you might want to add additional logic here
        // such as creating a new user record in your database
        console.log('New Google user signed in, creating account');
        
        // In a real app, you would make an API call here to create the user
        // await createUserInDatabase(user);
      } else {
        console.log('Returning Google user signed in');
        // In a real app, you would update the last login time
        // await updateUserLastLogin(user.id);
      }
      
      // Set the current user in context to complete login
      setCurrentUser(user);
      
      // Store a session token or identifier for persistence
      localStorage.setItem('auth_provider', 'google');
      localStorage.setItem('google_user_id', user.id);
      
    } catch (err: any) {
      // Handle user cancellation gracefully
      if (err.message === 'Google sign-in was cancelled') {
        setError(null); // No need to show an error if the user cancelled
      } else {
        setError(`Google sign-in failed: ${err.message || 'Unknown error'}`);
        console.error('Google sign-in error:', err);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to check if a user with this email already exists
  // In a real app, this would be an API call to your backend
  const checkIfUserExists = async (email: string): Promise<boolean> => {
    // Mock implementation - in production this would check your user database
    console.log(`Checking if user exists: ${email}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // For demo purposes, let's assume the user doesn't exist
    // In a real app, this would query your database
    return false;
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
