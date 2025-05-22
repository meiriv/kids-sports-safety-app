import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

// Define language options
export type LanguageOption = 'en' | 'he';

interface LanguageContextType {
  currentLanguage: LanguageOption;
  changeLanguage: (language: LanguageOption) => void;
  isRTL: boolean;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define props for provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Create RTL cache for RTL languages
const cacheRTL = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create LTR cache for LTR languages
const cacheLTR = createCache({
  key: 'mui',
});

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>('en');
  const [isRTL, setIsRTL] = useState<boolean>(false);
    // Create theme with direction and child-friendly colors
  const theme = createTheme({
    direction: isRTL ? 'rtl' : 'ltr',
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

  // Change language function
  const changeLanguage = (language: LanguageOption) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
    setIsRTL(language === 'he'); // Hebrew is RTL
    
    // Set HTML dir attribute
    document.documentElement.setAttribute('dir', language === 'he' ? 'rtl' : 'ltr');
    
    // Store language preference in local storage
    localStorage.setItem('language', language);
  };

  // Initialize language from localStorage or browser setting on first load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageOption;
    if (savedLanguage) {
      changeLanguage(savedLanguage);
    } else {
      // Get browser language
      const browserLang = navigator.language.split('-')[0] as LanguageOption;
      // Only set to Hebrew if explicitly Hebrew, otherwise default to English
      const initialLang = browserLang === 'he' ? 'he' : 'en';
      changeLanguage(initialLang);
    }
  }, []);

  // Provide context value
  const value = {
    currentLanguage,
    changeLanguage,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      <CacheProvider value={isRTL ? cacheRTL : cacheLTR}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </CacheProvider>
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
