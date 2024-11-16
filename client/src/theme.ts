import { createTheme, ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#a0a0a0',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#141414',
      paper: mode === 'light' ? '#ffffff' : '#141414',
    },
    action: {
      active: mode === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.7)',
      hover: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace, "Georgia", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // borderRadius: 8,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.04)' 
              : 'rgba(255, 255, 255, 0.08)',
          },
          transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        }),
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => createTheme(getThemeOptions(mode));