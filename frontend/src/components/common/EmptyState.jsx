import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon, Storage as StorageIcon } from '@mui/icons-material';

export default function EmptyState({ onCreate }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          color: 'grey.400',
          mb: 3,
        }}
      >
        <StorageIcon sx={{ fontSize: 44 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
        No buckets found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 3, lineHeight: 1.6 }}>
        Buckets are containers for your objects. Create a bucket to start uploading and organizing your files.
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate} size="large">
        Create Bucket
      </Button>
    </Box>
  );
}
