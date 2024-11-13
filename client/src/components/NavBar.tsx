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
        color: theme.palette.mode === 'light' ? 'text.primary' : undefined,
        borderBottom: theme.palette.mode === 'light' ? '1px solid #f0f0f0' : '1px solid #282828',
      }}
    >
      <Toolbar>
        <Typography component="div" sx={{ 
            fontSize: '18px', fontWeight: 'bold', flexGrow: 1,
            color: theme.palette.mode === 'light' ? '#484848' : '#dddddd'
         }}>
            Naiad
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