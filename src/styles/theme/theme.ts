import { createTheme } from '@mui/material/styles';

const commonThemeOptions = {
  typography: {
    fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        },
      },
    },
  },
};

const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1', // Modern indigo
      dark: '#4F46E5',
      light: '#818CF8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#EC4899', // Vibrant pink
      dark: '#DB2777',
      light: '#F472B6',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(99, 102, 241, 0.08)',
    },
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0px 30px 60px -15px rgba(0, 0, 0, 0.3)',
    '0px 35px 70px -15px rgba(0, 0, 0, 0.35)',
    '0px 2px 4px rgba(0,0,0,0.1)',
    '0px 4px 8px rgba(0,0,0,0.12)',
    '0px 8px 16px rgba(0,0,0,0.15)',
    '0px 12px 24px rgba(0,0,0,0.18)',
    '0px 16px 32px rgba(0,0,0,0.20)',
    '0px 20px 40px rgba(0,0,0,0.22)',
    '0px 24px 48px rgba(0,0,0,0.24)',
    '0px 28px 56px rgba(0,0,0,0.26)',
    '0px 32px 64px rgba(0,0,0,0.28)',
    '0px 36px 72px rgba(0,0,0,0.30)',
    '0px 40px 80px rgba(0,0,0,0.32)',
    '0px 44px 88px rgba(0,0,0,0.34)',
    '0px 48px 96px rgba(0,0,0,0.36)',
    '0px 52px 104px rgba(0,0,0,0.38)',
    '0px 56px 112px rgba(0,0,0,0.40)',
    '0px 60px 120px rgba(0,0,0,0.42)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(99, 102, 241, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});

const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#818CF8', // Lighter indigo for dark mode
      dark: '#6366F1',
      light: '#A5B4FC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F472B6', // Lighter pink for dark mode
      dark: '#EC4899',
      light: '#F9A8D4',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    action: {
      hover: 'rgba(255, 255, 255, 0.05)',
      selected: 'rgba(129, 140, 248, 0.12)',
    },
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.3)',
    '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.4), 0px 2px 4px -1px rgba(0, 0, 0, 0.24)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.4), 0px 4px 6px -2px rgba(0, 0, 0, 0.2)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.4), 0px 10px 10px -5px rgba(0, 0, 0, 0.16)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '0px 30px 60px -15px rgba(0, 0, 0, 0.6)',
    '0px 35px 70px -15px rgba(0, 0, 0, 0.7)',
    '0px 2px 4px rgba(0,0,0,0.3)',
    '0px 4px 8px rgba(0,0,0,0.35)',
    '0px 8px 16px rgba(0,0,0,0.4)',
    '0px 12px 24px rgba(0,0,0,0.45)',
    '0px 16px 32px rgba(0,0,0,0.5)',
    '0px 20px 40px rgba(0,0,0,0.55)',
    '0px 24px 48px rgba(0,0,0,0.6)',
    '0px 28px 56px rgba(0,0,0,0.65)',
    '0px 32px 64px rgba(0,0,0,0.7)',
    '0px 36px 72px rgba(0,0,0,0.75)',
    '0px 40px 80px rgba(0,0,0,0.8)',
    '0px 44px 88px rgba(0,0,0,0.85)',
    '0px 48px 96px rgba(0,0,0,0.9)',
    '0px 52px 104px rgba(0,0,0,0.95)',
    '0px 56px 112px rgba(0,0,0,1.0)',
    '0px 60px 120px rgba(0,0,0,1.0)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(129, 140, 248, 0.2)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(129, 140, 248, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.24)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
