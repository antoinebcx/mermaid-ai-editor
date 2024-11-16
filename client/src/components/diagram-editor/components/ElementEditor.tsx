import React, { useState } from 'react';
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
  ClickAwayListener,
  SelectChangeEvent
} from '@mui/material';
import {
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
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (isSelectOpen) return;
    
    const target = event.target as HTMLElement;
    if (target.closest('.MuiSelect-root') || 
        target.closest('.MuiMenuItem-root') ||
        target.closest('.MuiPopover-root')) {
      return;
    }
    onClose();
  };

  const handleSelectOpen = () => {
    setIsSelectOpen(true);
  };

  const handleSelectClose = () => {
    setIsSelectOpen(false);
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, field: keyof MermaidElement) => {
    e.preventDefault();
    e.stopPropagation();
    onUpdate({ [field]: e.target.value as ElementType });
    handleSelectClose();
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
      sx={{
        zIndex: 1400
      }}
    >
      <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
        <Paper 
          elevation={3}
          sx={{ 
            p: 2,
            width: 300,
            borderRadius: 1
          }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">Edit Element</Typography>
            <IconButton 
              size="small" 
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onClose();
              }}
            >
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
                onOpen={handleSelectOpen}
                onClose={handleSelectClose}
                MenuProps={{
                  onClick: (e: React.MouseEvent) => e.stopPropagation(),
                  PaperProps: {
                    onClick: (e: React.MouseEvent) => e.stopPropagation()
                  },
                  sx: {
                    zIndex: 1500
                  }
                }}
              >
                <MenuItem value="default">Rectangle [text]</MenuItem>
                <MenuItem value="participant">Round (text)</MenuItem>
                <MenuItem value="decision">Diamond {'{text}'}</MenuItem>
                <MenuItem value="note">Note {'>'}text]</MenuItem>
                <MenuItem value="action">Action ((text))</MenuItem>
                <MenuItem value="loop">Loop [[text]]</MenuItem>
              </Select>
            </FormControl>
          </Stack>

        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};