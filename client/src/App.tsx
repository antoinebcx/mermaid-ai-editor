import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './theme';
import MermaidEditor from './components/MermaidEditor';
import NavBar from './components/NavBar';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar onToggleTheme={toggleTheme} />
        <MermaidEditor />
      </Box>
    </ThemeProvider>
  );
}

export default App;