import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const result = isLogin
      ? await login(form.username, form.password)
      : await register(form.username, form.password);

    setSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <CloudIcon sx={{ color: 'primary.main', fontSize: 36 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              S3 Clone
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isLogin
              ? 'Enter your credentials to access your storage console.'
              : 'Sign up to start managing your object storage.'}
          </Typography>

          <Collapse in={!!error}>
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          </Collapse>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting}
              sx={{ mt: 3, mb: 2, fontWeight: 700 }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Sign Up'
              )}
            </Button>
          </Box>

          <Typography variant="body2" align="center" color="text.secondary">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              {isLogin ? 'Register' : 'Log in'}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
