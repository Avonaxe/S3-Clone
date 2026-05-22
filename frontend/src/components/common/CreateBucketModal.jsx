import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { CreateNewFolder as CreateNewFolderIcon } from '@mui/icons-material';

export default function CreateBucketModal({ open, onClose, onCreate }) {
  const [bucketName, setBucketName] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setBucketName('');
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    const trimmed = bucketName.trim();
    if (!trimmed) {
      setError('Bucket name is required');
      return;
    }
    if (!/^[a-z0-9][a-z0-9\-]{1,61}[a-z0-9]$/.test(trimmed)) {
      setError(
        'Bucket name must be 3–63 characters, lowercase letters, numbers, or hyphens. Must begin and end with a letter or number.'
      );
      return;
    }
    onCreate(trimmed);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CreateNewFolderIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Create Bucket
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter a unique name for your new storage bucket.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          label="Bucket Name"
          placeholder="e.g. my-project-assets"
          value={bucketName}
          onChange={(e) => {
            setBucketName(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error || '3–63 characters, lowercase letters, numbers, and hyphens only.'}
          margin="dense"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
