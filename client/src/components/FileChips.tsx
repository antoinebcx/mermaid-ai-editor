import { Box, Chip, useTheme } from '@mui/material';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import { UploadedFile } from './chat-input/types';

interface FileChipsProps {
  files: UploadedFile[];
  onRemove: (file: UploadedFile) => void;
  isExtracting: boolean;
}

export const FileChips: React.FC<FileChipsProps> = ({ files, onRemove, isExtracting }) => {
  const theme = useTheme();
  
  if (files.length === 0 || isExtracting) return null;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 0.5, 
      mb: 1,
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      {files.map((file, index) => (
        <Chip
          key={index}
          icon={<InsertDriveFileOutlined fontSize="small" />}
          label={file.file.name}
          onDelete={() => onRemove(file)}
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