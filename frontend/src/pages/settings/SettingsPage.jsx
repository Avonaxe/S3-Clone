import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  Divider,
} from '@mui/material';
import { DarkMode as DarkModeIcon } from '@mui/icons-material';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Settings
      </Typography>

      <Paper sx={{ borderRadius: 3, p: { xs: 2, md: 4 }, maxWidth: 640 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          Appearance
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize how the console looks on your device.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DarkModeIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Dark Mode
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Switch between light and dark themes.
              </Typography>
            </Box>
          </Box>
          <Switch
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </Box>
      </Paper>
    </Box>
  );
}
