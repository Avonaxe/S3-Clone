import { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import BucketCard from '../../components/common/BucketCard';
import EmptyState from '../../components/common/EmptyState';
import CreateBucketModal from '../../components/common/CreateBucketModal';

const INITIAL_BUCKETS = [
  { name: 'portfolio-assets', objectCount: 42, createdAt: 'May 18, 2026' },
  { name: 'backup-logs', objectCount: 1_247, createdAt: 'May 15, 2026' },
  { name: 'qa-bucket', objectCount: 8, createdAt: 'May 10, 2026' },
];

export default function DashboardPage() {
  const [buckets, setBuckets] = useState(INITIAL_BUCKETS);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (name) => {
    setBuckets((prev) => [
      {
        name,
        objectCount: 0,
        createdAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      },
      ...prev,
    ]);
  };

  const handleDelete = (name) => {
    setBuckets((prev) => prev.filter((b) => b.name !== name));
  };

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

      {/* Content */}
      {buckets.length === 0 ? (
        <EmptyState onCreate={() => setModalOpen(true)} />
      ) : (
        <Grid container spacing={3}>
          {buckets.map((bucket) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={bucket.name}>
              <BucketCard bucket={bucket} onDelete={handleDelete} />
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
