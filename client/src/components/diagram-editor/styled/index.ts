import { styled, Box } from '@mui/material';

export const DiagramContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&:active': {
    cursor: 'grabbing',
  },
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : '#161616',
}));

export const TransformableArea = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transformOrigin: 'center center',
});