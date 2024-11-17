import React, { useState, ChangeEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Direction = 'TB' | 'BT' | 'LR' | 'RL';

interface DirectionConfig {
  label: string;
  icon: React.ReactNode;
  value: Direction;
}

interface DiagramTypeSelectorProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const DIRECTIONS: DirectionConfig[] = [
  { label: 'Top to Bottom', icon: <ArrowDownwardIcon />, value: 'TB' },
  { label: 'Bottom to Top', icon: <ArrowUpwardIcon />, value: 'BT' },
  { label: 'Left to Right', icon: <ArrowForwardIcon />, value: 'LR' },
  { label: 'Right to Left', icon: <ArrowBackIcon />, value: 'RL' },
];

const DiagramTypeSelector: React.FC<DiagramTypeSelectorProps> = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const [firstLine, ...restOfCode] = value.split('\n');
  const [, currentDir] = firstLine.split(' ') as [string, Direction];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDirectionChange = (newDirection: Direction) => {
    const newFirstLine = `graph ${newDirection}`;
    const newCode = [newFirstLine, ...restOfCode].join('\n');
    
    const syntheticEvent = {
      target: {
        value: newCode
      }
    } as ChangeEvent<HTMLTextAreaElement>;
    
    onChange(syntheticEvent);
    handleClose();
  };

  const currentConfig = DIRECTIONS.find(dir => dir.value === currentDir) || DIRECTIONS[0];

  return (
    <>
      <Tooltip title="Chart direction">
        <IconButton
          size="small"
          onClick={handleClick}
        >
          {currentConfig.icon}
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {DIRECTIONS.map((direction) => (
          <MenuItem
            key={direction.value}
            onClick={() => handleDirectionChange(direction.value)}
            selected={currentDir === direction.value}
            sx={{ 
              gap: 1,
              minWidth: '150px'
            }}
          >
            {direction.icon} {direction.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DiagramTypeSelector;