import React from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Download, Image, ImageOutlined } from '@mui/icons-material';

interface DownloadButtonProps {
  onDownload: (options: { includeBackground: boolean; format: 'jpg' | 'png' | 'svg' }) => Promise<void>;
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  onDownload,
  isOpen,
  anchorEl,
  onClose
}) => {
  return (
    <>
      <IconButton
        onClick={(e) => e.currentTarget.focus()}
        aria-label="download diagram"
        size="small"
      >
        <Download />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          onDownload({ includeBackground: true, format: 'png' });
          onClose();
        }}>
          <ListItemIcon>
            <Image fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download PNG with background" />
        </MenuItem>
        <MenuItem onClick={() => {
          onDownload({ includeBackground: false, format: 'png' });
          onClose();
        }}>
          <ListItemIcon>
            <ImageOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Download PNG without background" />
        </MenuItem>
      </Menu>
    </>
  );
};