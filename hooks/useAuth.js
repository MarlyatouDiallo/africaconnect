// hooks/useAuth.js
import { useState, useCallback } from 'react';
import { useStore } from '../store/zustand/useStore';
import { authService } from '../services/authService';

export function useAuth() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signIn(email, password);
      setLoading(false);
      return result.user;
    } catch (err) {
      setLoading(false);
      setError(err.message || "Erreur de connexion.");
      throw err;
    }
  }, []);

  const register = useCallback(async (username, email, password, avatarUrl = '', bio = '') => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signUp(username, email, password, avatarUrl, bio);
      setLoading(false);
      return result.user;
    } catch (err) {
      setLoading(false);
      setError(err.message || "Erreur d'inscription.");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Erreur de déconnexion.");
    }
  }, []);

  const updateProfile = useCallback(async (username, bio, avatarUrl) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await authService.updateProfile(user.id, username, bio, avatarUrl);
      setLoading(false);
      return updatedUser;
    } catch (err) {
      setLoading(false);
      setError(err.message || "Erreur lors de la modification.");
      throw err;
    }
  }, [user]);

  const resetPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Erreur lors de la demande de réinitialisation.");
      throw err;
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    resetPassword
  };
}
