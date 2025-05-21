import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types/models';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // This would normally connect to Firebase Auth or your auth service
    // For now, we'll just simulate a completed auth check
    const checkAuthStatus = async () => {
      try {
        // Simulate auth check with a mock user for testing
        setTimeout(() => {
          // Create a mock user so we can see the UI
          const mockUser: User = {
            id: '123',
            displayName: 'Test User',
            email: 'test@example.com',
            createdAt: new Date(),
            lastLogin: new Date(),
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
    try {
      // This would be a call to your auth service
      // For now, let's mock a successful login
      const mockUser: User = {
        id: '123',
        displayName: 'Test User',
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
        displayName: displayName,
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
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      // This would be a call to your auth service
      // For now, let's mock a successful logout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentUser(null);
    } catch (err) {
      setError('Failed to logout');
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
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
