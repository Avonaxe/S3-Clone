import { Box, Typography, Avatar, Paper, LinearProgress, Chip, Grid } from '@mui/material';
import { Person as PersonIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';

export default function ProfilePage() {
  const user = {
    name: 'Shinei Nouzen',
    role: 'Administrator',
    email: 'shinei.nouzen@s3clone.local',
    usedGB: 45,
    limitGB: 100,
  };

  const percent = Math.round((user.usedGB / user.limitGB) * 100);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              background: (theme) =>
                `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
            }}
          >
            <Avatar
              sx={{
                width: 96,
                height: 96,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                fontWeight: 700,
                mb: 2,
                boxShadow: '0 4px 12px rgba(15, 76, 129, 0.25)',
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {user.name}
            </Typography>
            <Chip
              icon={<AdminIcon sx={{ fontSize: 16 }} />}
              label={user.role}
              size="small"
              sx={{
                mt: 1,
                fontWeight: 600,
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                borderRadius: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {user.email}
            </Typography>
          </Paper>
        </Grid>

        {/* Storage Quota */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <PersonIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Storage Quota
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You are currently using <strong>{user.usedGB} GB</strong> of your{' '}
              <strong>{user.limitGB} GB</strong> storage limit.
            </Typography>

            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {percent}% used
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.limitGB - user.usedGB} GB remaining
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  bgcolor: percent > 85 ? 'error.main' : percent > 60 ? 'warning.main' : 'success.main',
                },
              }}
            />

            <Box sx={{ mt: 4, display: 'flex', gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  12
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Buckets
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  1,297
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Objects
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  3
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active API Keys
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
