import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Key as KeyIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const API_KEYS = [
  { id: 1, name: 'Production Access', createdAt: 'May 10, 2026', status: 'Active' },
  { id: 2, name: 'CI/CD Deployer', createdAt: 'Apr 22, 2026', status: 'Active' },
  { id: 3, name: 'Local Dev Key', createdAt: 'Mar 15, 2026', status: 'Revoked' },
];

export default function SettingsPage() {
  const [tab, setTab] = useState(0);
  const [emailNotif, setEmailNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mfa, setMfa] = useState(false);
  const [keys, setKeys] = useState(API_KEYS);

  const handleRevoke = (id) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'Revoked' } : k))
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Settings
      </Typography>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="General" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label="Security & Access" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>

        {/* General Tab */}
        <TabPanel value={tab} index={0}>
          <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Preferences
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 480 }}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Email Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive alerts for bucket events and security issues.
                  </Typography>
                </Box>
                <Switch
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                />
              </Paper>

              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Dark Mode
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toggle dark theme for the console (placeholder).
                  </Typography>
                </Box>
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              </Paper>
            </Box>
          </Box>
        </TabPanel>

        {/* Security & Access Tab */}
        <TabPanel value={tab} index={1}>
          <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Authentication
            </Typography>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, maxWidth: 480 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SecurityIcon sx={{ color: mfa ? 'success.main' : 'text.secondary' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Multi-Factor Authentication
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Require an additional verification step at login.
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={mfa}
                onChange={(e) => setMfa(e.target.checked)}
              />
            </Paper>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Active API Keys
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Key Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Created Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <KeyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {key.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {key.createdAt}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={key.status}
                          size="small"
                          color={key.status === 'Active' ? 'success' : 'default'}
                          sx={{ fontWeight: 600, borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {key.status === 'Active' ? (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon fontSize="small" />}
                            onClick={() => handleRevoke(key.id)}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                          >
                            Revoke
                          </Button>
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}
