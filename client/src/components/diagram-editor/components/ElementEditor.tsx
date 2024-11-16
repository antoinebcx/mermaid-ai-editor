import React from 'react';
import {
  Paper,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Stack,
  Popper,
  ClickAwayListener
} from '@mui/material';
import {
  Edit as EditIcon,
  Category as CategoryIcon,
  Palette as PaletteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { MermaidElement, ElementType } from '../types';

interface ElementEditorProps {
  element: MermaidElement;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onUpdate: (updates: Partial<MermaidElement>) => void;
  zoom: number;
}

export const MermaidElementEditor = ({ element, anchorEl, onClose, onUpdate, zoom }: ElementEditorProps) => {
  const open = Boolean(anchorEl);
  const id = open ? 'element-popper' : undefined;

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    // Prevent closing when clicking inside select menus
    if ((event.target as HTMLElement).closest('.MuiSelect-root') ||
        (event.target as HTMLElement).closest('.MuiMenuItem-root')) {
      return;
    }
    onClose();
  };

  const handleSelectChange = (e: any, field: keyof MermaidElement) => {
    e.stopPropagation();
    onUpdate({ [field]: e.target.value });
  };

  return (
    <Popper 
      id={id}
      open={open}
      anchorEl={anchorEl}
      placement="right-start"
      style={{
        transform: `scale(${1 / zoom})`,
        transformOrigin: 'top left'
      }}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 2,
            width: 300,
            borderRadius: 1,
            zIndex: 1300
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">Edit Element</Typography>
            <IconButton size="small" onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="element-type-label">Type</InputLabel>
              <Select
                labelId="element-type-label"
                value={element.type}
                label="Type"
                onChange={(e) => handleSelectChange(e, 'type')}
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="participant">Participant</MenuItem>
                <MenuItem value="decision">Decision</MenuItem>
                <MenuItem value="note">Note</MenuItem>
                <MenuItem value="action">Action</MenuItem>
                <MenuItem value="loop">Loop</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <TextField
                label="Text"
                value={element.text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                size="small"
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="element-color-label">Color</InputLabel>
              <Select
                labelId="element-color-label"
                value={element.color || ''}
                label="Color"
                onChange={(e) => handleSelectChange(e, 'color')}
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="red">Red</MenuItem>
                <MenuItem value="green">Green</MenuItem>
                <MenuItem value="yellow">Yellow</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};