// hooks/usePosts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/postService';
import { useStore } from '../store/zustand/useStore';

export function usePosts(category = 'all') {
  const queryClient = useQueryClient();
  const currentUser = useStore((state) => state.user);

  // 1. Fetch Posts with React Query
  const postsQuery = useQuery({
    queryKey: ['posts', category],
    queryFn: () => postService.getPosts(category),
    staleTime: 1000 * 60 * 5, // 5 minutes cache stale
    refetchOnWindowFocus: true,
  });

  // 2. Fetch Stories
  const storiesQuery = useQuery({
    queryKey: ['stories'],
    queryFn: () => postService.getStories(),
    staleTime: 1000 * 60 * 10,
  });

  // 3. Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: ({ description, category, imageUri, privacy }) => {
      if (!currentUser) throw new Error("Vous devez être connecté.");
      return postService.createPost(currentUser.id, imageUri, description, category, privacy);
    },
    onSuccess: () => {
      // Invalidate the cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts', currentUser?.id] });
    }
  });

  // 4. Like/Unlike Mutation
  const toggleLikeMutation = useMutation({
    mutationFn: (postId) => {
      if (!currentUser) throw new Error("Vous devez être connecté.");
      return postService.toggleLike(postId, currentUser.id);
    },
    onSuccess: (_, postId) => {
      // Optimistic updates could be done here, or simpler cache invalidations:
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['favorites', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    }
  });

  // 5. Toggle Favorite Mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: (postId) => {
      if (!currentUser) throw new Error("Vous devez être connecté.");
      return postService.toggleFavorite(postId, currentUser.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['favorites', currentUser?.id] });
    }
  });

  // 6. User Specific Posts
  const useUserPosts = (userId) => {
    return useQuery({
      queryKey: ['user-posts', userId],
      queryFn: () => postService.getUserPosts(userId),
      enabled: !!userId
    });
  };

  // 7. Favorite Specific Posts
  const useFavoritePosts = () => {
    return useQuery({
      queryKey: ['favorites', currentUser?.id],
      queryFn: () => postService.getFavorites(currentUser?.id),
      enabled: !!currentUser?.id
    });
  };

  // 8. Follow Mutation
  const toggleFollowMutation = useMutation({
    mutationFn: (targetUserId) => {
      if (!currentUser) throw new Error("Vous devez être connecté.");
      return postService.toggleFollow(currentUser.id, targetUserId);
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts', targetUserId] });
    }
  });

  // 9. Create Story Mutation
  const createStoryMutation = useMutation({
    mutationFn: (storyData) => {
      if (!currentUser) throw new Error("Vous devez être connecté.");
      return postService.createStory(currentUser.id, storyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    }
  });

  return {
    posts: postsQuery.data || [],
    isLoadingPosts: postsQuery.isLoading,
    isRefetchingPosts: postsQuery.isRefetching,
    postsError: postsQuery.error,
    refetchPosts: postsQuery.refetch,
    
    stories: storiesQuery.data || [],
    isLoadingStories: storiesQuery.isLoading,
    
    createPost: createPostMutation.mutateAsync,
    isCreatingPost: createPostMutation.isPending,
    
    toggleLike: toggleLikeMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    
    useUserPosts,
    useFavoritePosts,
    
    toggleFollow: toggleFollowMutation.mutate,
    createStory: createStoryMutation.mutateAsync
  };
}
