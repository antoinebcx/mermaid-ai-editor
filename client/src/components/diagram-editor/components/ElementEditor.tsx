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
  ListItemIcon,
  Stack,
  Popper,
  ClickAwayListener,
  SelectChangeEvent
} from '@mui/material';
import {
  RectangleOutlined as RectangleIcon,
  Crop75Outlined as RoundIcon,
  DiamondOutlined as DiamondIcon,
  NoteOutlined as NoteIcon,
  CircleOutlined as ActionIcon,
  LoopOutlined as LoopIcon,
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
    onClose();
  };

  return (
    <Popper 
      id={id}
      open={open}
      anchorEl={anchorEl}
      placement="top"
      style={{
        transform: `scale(${1 / zoom})`,
        transformOrigin: 'top'
      }}
      sx={{
        zIndex: 1400
      }}
    >
      <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
        <Paper 
          elevation={0}
          sx={{ 
            p: 0,
            width: 70,
            borderRadius: 1,
            marginBottom: 1
          }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >

        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="element-type-label"></InputLabel>
            <Select
              labelId="element-type-label"
              value={element.type}
              label=""
              onChange={(e) => handleSelectChange(e, 'type')}
              onOpen={handleSelectOpen}
              onClose={handleSelectClose}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              MenuProps={{
                onClick: (e: React.MouseEvent) => e.stopPropagation(),
                PaperProps: {
                  onClick: (e: React.MouseEvent) => e.stopPropagation()
                },
                sx: {
                  zIndex: 1500
                }
              }}
              renderValue={(selected) => {
                const selectedIcon = {
                  default: <RectangleIcon fontSize="small" />,
                  participant: <RoundIcon fontSize="small" />,
                  decision: <DiamondIcon fontSize="small" />,
                  note: <NoteIcon fontSize="small" />,
                  action: <ActionIcon fontSize="small" />,
                  loop: <LoopIcon fontSize="small" />
                }[selected as ElementType];

                const selectedLabel = {
                  default: '',
                  participant: '',
                  decision: '',
                  note: '',
                  action: '',
                  loop: ''
                }[selected as ElementType];

                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedIcon}
                    {selectedLabel}
                  </Box>
                );
              }}
            >
              <MenuItem value="default">
                <ListItemIcon>
                  <RectangleIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem value="participant">
                <ListItemIcon>
                  <RoundIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem value="decision">
                <ListItemIcon>
                  <DiamondIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem value="note">
                <ListItemIcon>
                  <NoteIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem value="action">
                <ListItemIcon>
                  <ActionIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
              <MenuItem value="loop">
                <ListItemIcon>
                  <LoopIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>

        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};