// services/authService.js
import { supabase, isSupabaseConfigured } from './supabase';
import { useStore } from '../store/zustand/useStore';

export const authService = {
  /**
   * Registers a new user
   */
  signUp: async (username, email, password, avatarUrl = '', bio = '') => {
    if (false) { // Mode démo — Supabase key bloquée côté browser
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            bio: bio || 'Bienvenue sur mon profil AfricaConnect ! 🌍✨'
          }
        }
      });
      if (error) throw error;
      
      // Real Supabase automatically runs PostgreSQL triggers to copy into public.users.
      // But we can check if it populated or return signup details.
      return data;
    } else {
      // Simulation mode
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network lag
      
      const store = useStore.getState();
      const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase());
      
      if (existingUser) {
        throw new Error("Cet e-mail ou ce nom d'utilisateur est déjà utilisé.");
      }

      const newUser = {
        id: `u_${Date.now()}`,
        username,
        email,
        avatar: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        bio: bio || 'Bienvenue sur mon profil AfricaConnect ! 🌍✨',
        followers_count: 0,
        following_count: 0,
        created_at: new Date().toISOString()
      };

      // Add to simulated PostgreSQL
      useStore.setState((state) => ({
        users: [...state.users, newUser],
        user: newUser // Auto sign-in
      }));

      return { user: newUser };
    }
  },

  /**
   * Signs in a user
   */
  signIn: async (email, password) => {
    if (false) { // Mode démo — Supabase key bloquée côté browser
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;

      // Fetch public user details
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;

      // Set global Zustand user session
      useStore.getState().setUser(profile);
      return { user: profile };
    } else {
      // Simulation mode
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const store = useStore.getState();
      // Support login via email or username
      const foundUser = store.users.find(
        u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase()
      );
      
      if (!foundUser) {
        throw new Error("Identifiants incorrects ou utilisateur inexistant.");
      }

      // In mock, we accept any password since it's demo mode!
      useStore.getState().setUser(foundUser);
      return { user: foundUser };
    }
  },

  /**
   * Signs out the user
   */
  signOut: async () => {
    if (false) { // Mode démo
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    
    // Clear Zustand session
    useStore.getState().setUser(null);
  },

  /**
   * Resets password
   */
  resetPassword: async (email) => {
    if (false) { // Mode démo
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } else {
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 600));
      const store = useStore.getState();
      const userExists = store.users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (!userExists) {
        throw new Error("Aucun utilisateur n'est associé à cette adresse e-mail.");
      }
    }
  },

  /**
   * Updates user profile
   */
  updateProfile: async (userId, username, bio, avatarUrl) => {
    if (false) { // Mode démo
      const { data, error } = await supabase
        .from('users')
        .update({ username, bio, avatar: avatarUrl })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      
      useStore.getState().setUser(data);
      return data;
    } else {
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 600));
      useStore.getState().updateUserProfile(userId, { username, bio, avatar: avatarUrl });
      return useStore.getState().user;
    }
  }
};
