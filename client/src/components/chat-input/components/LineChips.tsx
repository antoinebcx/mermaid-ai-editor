import { Box, Chip, useTheme } from '@mui/material';
import { CodeOutlined } from '@mui/icons-material';
import { LineChipsProps } from '../types'

export const LineChips: React.FC<LineChipsProps> = ({ lines, onRemove }) => {
  const theme = useTheme();

  if (lines.length === 0) return null;

  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 0.5,
      mb: 1,
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      {lines.map(line => (
        <Chip
          key={line.number}
          icon={<CodeOutlined fontSize="small" />}
          label={`Line ${line.number}`}
          onDelete={() => onRemove(line.number)}
          size="medium"
          sx={{
            backgroundColor: theme.palette.mode === 'light'
              ? 'rgba(235, 235, 235, 0.9)'
              : 'rgba(40, 40, 40, 0.9)',
          }}
        />
      ))}
    </Box>
  );
};