import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import BucketCard from '../../components/common/BucketCard';
import EmptyState from '../../components/common/EmptyState';
import CreateBucketModal from '../../components/common/CreateBucketModal';
import * as bucketService from '../../services/bucketService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [buckets, setBuckets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBuckets = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await bucketService.getBuckets();
      const mapped = response.data.map((b) => ({
        name: b.bucketName,
        createdAt: new Date(b.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      }));
      setBuckets(mapped);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load buckets. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuckets();
  }, [fetchBuckets]);

  const handleCreate = async (name) => {
    try {
      await bucketService.createBucket(name);
      await fetchBuckets();
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to create bucket. Please try again.';
      throw new Error(message);
    }
  };

  const handleDelete = async (name) => {
    try {
      await bucketService.deleteBucket(name);
      setBuckets((prev) => prev.filter((b) => b.name !== name));
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to delete bucket. Please try again.'
      );
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
          mb: 3.5,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            Storage Buckets
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {buckets.length} bucket{buckets.length !== 1 ? 's' : ''} total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          size="large"
        >
          Create Bucket
        </Button>
      </Box>

      {/* Error Banner */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Content */}
      {buckets.length === 0 ? (
        <EmptyState onCreate={() => setModalOpen(true)} />
      ) : (
        <Grid container spacing={3}>
          {buckets.map((bucket) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={bucket.name}>
              <BucketCard
                bucket={bucket}
                onDelete={handleDelete}
                onNavigate={(name) => navigate(`/buckets/${name}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Modal */}
      <CreateBucketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </Box>
  );
}
