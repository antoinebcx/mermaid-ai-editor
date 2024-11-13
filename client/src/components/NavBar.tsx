import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
} from '@mui/icons-material';

interface NavBarProps {
  onToggleTheme: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onToggleTheme }) => {
  const theme = useTheme();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.mode === 'light' ? 'white' : undefined,
        color: theme.palette.mode === 'light' ? 'text.primary' : undefined
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mermaid board
        </Typography>
        <IconButton 
          color={theme.palette.mode === 'light' ? 'default' : 'inherit'}
          onClick={onToggleTheme}
          sx={{ ml: 2 }}
        >
          {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;