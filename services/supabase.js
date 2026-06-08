// services/supabase.js
import { createClient } from '@supabase/supabase-js';

// Expo public environment variables (loaded from .env automatically by Expo CLI)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xhxrpeemkfofhxrewett.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_KSKKqSTUP-dQ3FAtUuizJA_9bDmBZya';

// Detect if real Supabase keys are provided
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '';

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ SUPABASE WARNING: Les clés EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY ne sont pas configurées. " +
    "L'application s'exécute en MODE DÉMO HORS-LIGNE avec persistance locale (Zustand + AsyncStorage). " +
    "Pour connecter votre base réelle, créez un fichier .env à la racine avec vos identifiants Supabase."
  );
}

// Custom storage helper for Supabase Auth — cross-platform
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageFallback = {
  getItem: async (key) => {
    if (Platform.OS === 'web') return window.localStorage.getItem(key);
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      window.localStorage.setItem(key, value);
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') {
      window.localStorage.removeItem(key);
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};

// Instantiate real client or export null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorageFallback,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
