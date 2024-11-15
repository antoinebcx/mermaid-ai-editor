import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  LightModeOutlined,
  DarkModeOutlined,
  DescriptionOutlined,
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
        
        <Tooltip title="Mermaid documentation ↗">
          <IconButton
            color={theme.palette.mode === 'light' ? 'default' : 'inherit'}
            onClick={() => window.open('https://mermaid.js.org/intro/', '_blank')}
            sx={{ ml: 1 }}
          >
            <DescriptionOutlined />
          </IconButton>
        </Tooltip>

        <IconButton
          color={theme.palette.mode === 'light' ? 'default' : 'inherit'}
          onClick={onToggleTheme}
          sx={{ ml: 1 }}
        >
          {theme.palette.mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;