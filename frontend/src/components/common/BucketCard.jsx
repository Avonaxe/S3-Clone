import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export default function BucketCard({ bucket, onDelete, onNavigate }) {
  const [elevation, setElevation] = useState(1);

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await onDelete(bucket.name);
    } catch {
      // Error is surfaced by the parent via Alert / Toast
    }
  };

  return (
    <Card
      onClick={() => onNavigate?.(bucket.name)}
      onMouseEnter={() => setElevation(4)}
      onMouseLeave={() => setElevation(1)}
      elevation={elevation}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: (theme) =>
          `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: elevation === 4 ? 'translateY(-2px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: (theme) =>
            `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          opacity: elevation === 4 ? 1 : 0,
          transition: 'opacity 0.25s ease',
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                boxShadow: '0 2px 8px rgba(15, 76, 129, 0.2)',
              }}
            >
              <FolderIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                {bucket.name}
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Delete bucket" arrow>
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  backgroundColor: 'error.light',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Created {bucket.createdAt}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
