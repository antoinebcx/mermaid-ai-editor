import React, { useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './theme';
import MermaidEditor from './components/MermaidEditor';
import NavBar from './components/NavBar';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
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