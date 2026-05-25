import { Box, Typography, Avatar, Paper } from '@mui/material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const username = user?.username || 'User';

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Account Overview
      </Typography>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 520,
          background: (theme) =>
            `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(15, 76, 129, 0.25)',
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {username}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Authenticated user
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                mt: 1.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: 'success.light',
                color: 'success.contrastText',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.dark',
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Active
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
