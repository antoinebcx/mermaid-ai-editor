import { IconButton, Tooltip, Typography, Box, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  CenterFocusStrongOutlined,
  UndoOutlined,
  RedoOutlined,
  DownloadOutlined,
  ImageOutlined,
  Image
} from '@mui/icons-material';

interface DownloadProps {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  onDownload: (options: { includeBackground: boolean; format: 'jpg' | 'png' }) => Promise<void>;
  onDownloadClick: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
}

interface DiagramControlsProps {
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onUndo: () => void;
  onRedo: () => void;
  downloadProps: DownloadProps;
}

export const DiagramControls = ({
  zoom,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onUndo,
  onRedo,
  downloadProps,
}: DiagramControlsProps) => (
  <>
    <Box
      sx={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '7px',
        padding: '7px',
        borderRadius: '8px',
      }}
    >
      <Tooltip title="Undo (Ctrl/⌘+Z)">
        <span>
          <IconButton onClick={onUndo} size="small" disabled={!canUndo}>
            <UndoOutlined />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Redo (Ctrl/⌘+Shift+Z or Ctrl/⌘+Y)">
        <span>
          <IconButton onClick={onRedo} size="small" disabled={!canRedo}>
            <RedoOutlined />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Download Diagram">
        <IconButton onClick={downloadProps.onDownloadClick} size="small">
          <DownloadOutlined />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={downloadProps.anchorEl}
        open={downloadProps.isOpen}
        onClose={downloadProps.onClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            downloadProps.onDownload({ includeBackground: true, format: 'png' });
            downloadProps.onClose();
          }}
        >
          <ListItemIcon>
            <Image fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="With background" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            downloadProps.onDownload({ includeBackground: false, format: 'png' });
            downloadProps.onClose();
          }}
        >
          <ListItemIcon>
            <ImageOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Without background" />
        </MenuItem>
      </Menu>
    </Box>

    <Box
      sx={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '7px',
        padding: '7px',
        borderRadius: '8px',
      }}
    >
      <Tooltip title="Zoom In">
        <IconButton onClick={onZoomIn} size="small">
          <ZoomInOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton onClick={onZoomOut} size="small">
          <ZoomOutOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Reset View">
        <IconButton onClick={onResetZoom} size="small">
          <CenterFocusStrongOutlined />
        </IconButton>
      </Tooltip>
      <Typography variant="body2" sx={{ minWidth: '45px', textAlign: 'center' }}>
        {Math.round(zoom * 100)}%
      </Typography>
    </Box>
  </>
);