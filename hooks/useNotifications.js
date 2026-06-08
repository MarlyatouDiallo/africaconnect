// hooks/useNotifications.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { useStore } from '../store/zustand/useStore';

export function useNotifications() {
  const queryClient = useQueryClient();
  const currentUser = useStore((state) => state.user);
  const markAsRead = useStore((state) => state.markNotificationsAsRead);

  // Fetch notifications using React Query
  const notificationsQuery = useQuery({
    queryKey: ['notifications', currentUser?.id],
    queryFn: () => notificationService.getNotifications(currentUser?.id),
    enabled: !!currentUser?.id,
    refetchInterval: 10000, // Poll every 10 seconds for real-time simulation
  });

  const clearNotificationsMutation = useMutation({
    mutationFn: () => notificationService.clearNotifications(),
    onSuccess: () => {
      queryClient.setQueryData(['notifications', currentUser?.id], []);
    }
  });

  const unreadCount = (notificationsQuery.data || []).filter(n => !n.read).length;

  return {
    notifications: notificationsQuery.data || [],
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    markAsRead,
    clearNotifications: clearNotificationsMutation.mutate
  };
}
