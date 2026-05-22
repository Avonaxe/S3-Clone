import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken) {
      setToken(storedToken);
      setUser(storedUsername ? { username: storedUsername } : null);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token: jwtToken } = response.data;
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('username', username);
      setToken(jwtToken);
      setUser({ username });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Login failed. Please check your credentials and try again.';
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (username, password) => {
    try {
      await api.post('/auth/register', { username, password });
      return await login(username, password);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Registration failed. The username may already exist or the password is too short.';
      return { success: false, message };
    }
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
