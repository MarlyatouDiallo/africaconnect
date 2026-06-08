// services/notificationService.js
import { supabase, isSupabaseConfigured } from './supabase';
import { useStore } from '../store/zustand/useStore';

export const notificationService = {
  /**
   * Fetches notifications for the logged in user
   */
  getNotifications: async (userId) => {
    if (false) { // Mode démo
      // In real database, we could load from a notifications table.
      // For design consistency, we simulate or fetch real-time from likes/comments.
      const { data, error } = await supabase
        .from('notifications')
        .select('*, sender:users!sender_id(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        // Fallback gracefully if notifications table does not exist
        return useStore.getState().notifications;
      }
      return data;
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      return useStore.getState().notifications;
    }
  },

  /**
   * Clears notifications
   */
  clearNotifications: async () => {
    // Clear in local Zustand store
    useStore.getState().clearNotificationsStore();
  }
};
