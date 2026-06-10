// store/zustand/useStore.js
import { Platform } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_COMMENTS, INITIAL_STORIES } from '../../utils/constants';

// Storage cross-plateforme : localStorage sur Web, AsyncStorage sur mobile
const storage = Platform.OS === 'web'
  ? createJSONStorage(() => window.localStorage)
  : createJSONStorage(() => AsyncStorage);

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      theme: 'dark', // Default to Dark mode for premium stunning aesthetics
      user: null, // Logged in user (null by default)
      isOffline: false, // Network mode
      
      // DB simulation cache for hybrid / offline mode
      users: INITIAL_USERS,
      posts: INITIAL_POSTS,
      comments: INITIAL_COMMENTS,
      stories: INITIAL_STORIES,
      likes: [], // Relations: { id, user_id, post_id, created_at }
      favorites: [], // Relations: { id, user_id, post_id, created_at }
      followers: [], // Relations: { id, follower_id, following_id, created_at }
      notifications: [
        {
          id: 'n1',
          type: 'like',
          sender: INITIAL_USERS[1], // ibrahim_lens
          post_image: INITIAL_POSTS[3].image_url, // marly's post
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
          read: false
        },
        {
          id: 'n2',
          type: 'comment',
          sender: INITIAL_USERS[2], // fatou_wax_design
          post_image: INITIAL_POSTS[3].image_url,
          content: 'Super projet Marly ! Hâte de voir la version finale sur l\'App Store !🚀🔥',
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
          read: false
        }
      ],

      // Actions
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user }),
      setOffline: (isOffline) => set({ isOffline }),
      
      // Database Operations
      // User Profile Update
      updateUserProfile: (userId, updates) => set((state) => {
        const updatedUsers = state.users.map(u => u.id === userId ? { ...u, ...updates } : u);
        const updatedUser = state.user && state.user.id === userId ? { ...state.user, ...updates } : state.user;
        return { users: updatedUsers, user: updatedUser };
      }),

      // Posts CRUD
      setPosts: (posts) => set({ posts }),
      addPost: (post) => set((state) => {
        const sender = state.users.find(u => u.id === post.user_id) || state.user;
        const followers = state.followers.filter(f => f.following_id === post.user_id);
        const newNotifs = followers.map(f => ({
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          type: 'post',
          sender,
          post_image: post.image_url,
          created_at: new Date().toISOString(),
          read: false
        }));
        
        return {
          posts: [post, ...state.posts],
          notifications: [...newNotifs, ...state.notifications]
        };
      }),
      deletePost: (postId) => set((state) => ({
        posts: state.posts.filter(p => p.id !== postId),
        comments: state.comments.filter(c => c.post_id !== postId),
        likes: state.likes.filter(l => l.post_id !== postId),
        favorites: state.favorites.filter(f => f.post_id !== postId)
      })),

      // Likes Toggle
      likePostStore: (postId, userId) => set((state) => {
        const alreadyLiked = state.likes.some(l => l.post_id === postId && l.user_id === userId);
        if (alreadyLiked) return {}; // safeguard

        const newLike = {
          id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          user_id: userId,
          post_id: postId,
          created_at: new Date().toISOString()
        };

        const updatedPosts = state.posts.map(p => 
          p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p
        );

        // Add internal app notification if this post belongs to someone else
        const targetPost = state.posts.find(p => p.id === postId);
        let newNotifications = [...state.notifications];
        if (targetPost && targetPost.user_id !== userId) {
          const sender = state.users.find(u => u.id === userId) || state.user;
          const newNotif = {
            id: `notif_${Date.now()}`,
            type: 'like',
            sender,
            post_image: targetPost.image_url,
            created_at: new Date().toISOString(),
            read: false
          };
          newNotifications = [newNotif, ...newNotifications];
        }

        return {
          likes: [...state.likes, newLike],
          posts: updatedPosts,
          notifications: newNotifications
        };
      }),

      unlikePostStore: (postId, userId) => set((state) => {
        const updatedLikes = state.likes.filter(l => !(l.post_id === postId && l.user_id === userId));
        const updatedPosts = state.posts.map(p => 
          p.id === postId ? { ...p, likes_count: Math.max(0, (p.likes_count || 1) - 1) } : p
        );
        return {
          likes: updatedLikes,
          posts: updatedPosts
        };
      }),

      // Favorites Toggle
      favoritePostStore: (postId, userId) => set((state) => {
        const alreadyFav = state.favorites.some(f => f.post_id === postId && f.user_id === userId);
        if (alreadyFav) return {}; // safeguard

        const newFav = {
          id: `fav_${Date.now()}`,
          user_id: userId,
          post_id: postId,
          created_at: new Date().toISOString()
        };

        // Add internal app notification if this post belongs to someone else
        const targetPost = state.posts.find(p => p.id === postId);
        let newNotifications = [...state.notifications];
        if (targetPost && targetPost.user_id !== userId) {
          const sender = state.users.find(u => u.id === userId) || state.user;
          const newNotif = {
            id: `notif_${Date.now()}`,
            type: 'favorite',
            sender,
            post_image: targetPost.image_url,
            created_at: new Date().toISOString(),
            read: false
          };
          newNotifications = [newNotif, ...newNotifications];
        }

        return { 
          favorites: [...state.favorites, newFav],
          notifications: newNotifications
        };
      }),

      unfavoritePostStore: (postId, userId) => set((state) => ({
        favorites: state.favorites.filter(f => !(f.post_id === postId && f.user_id === userId))
      })),

      // Comments
      addCommentStore: (postId, userId, content) => set((state) => {
        const newComment = {
          id: `comment_${Date.now()}`,
          post_id: postId,
          user_id: userId,
          content,
          created_at: new Date().toISOString()
        };

        const updatedPosts = state.posts.map(p => 
          p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p
        );

        // Add internal app notification if this post belongs to someone else
        const targetPost = state.posts.find(p => p.id === postId);
        let newNotifications = [...state.notifications];
        if (targetPost && targetPost.user_id !== userId) {
          const sender = state.users.find(u => u.id === userId) || state.user;
          const newNotif = {
            id: `notif_${Date.now()}`,
            type: 'comment',
            sender,
            post_image: targetPost.image_url,
            content,
            created_at: new Date().toISOString(),
            read: false
          };
          newNotifications = [newNotif, ...newNotifications];
        }

        return {
          comments: [...state.comments, newComment],
          posts: updatedPosts,
          notifications: newNotifications
        };
      }),

      // Stories
      addStoryStore: (story) => set((state) => ({
        stories: [story, ...state.stories]
      })),

      // Followers
      followUserStore: (followerId, followingId) => set((state) => {
        const alreadyFollowing = state.followers.some(f => f.follower_id === followerId && f.following_id === followingId);
        if (alreadyFollowing) return {};

        const newFollow = {
          id: `follow_${Date.now()}`,
          follower_id: followerId,
          following_id: followingId,
          created_at: new Date().toISOString()
        };

        const updatedUsers = state.users.map(u => {
          if (u.id === followerId) return { ...u, following_count: (u.following_count || 0) + 1 };
          if (u.id === followingId) return { ...u, followers_count: (u.followers_count || 0) + 1 };
          return u;
        });

        // Sync local user copy
        const updatedCurrentUser = state.user && state.user.id === followerId 
          ? { ...state.user, following_count: (state.user.following_count || 0) + 1 } 
          : state.user;

        // Add notification
        const sender = state.users.find(u => u.id === followerId) || state.user;
        const newNotif = {
          id: `notif_${Date.now()}`,
          type: 'follow',
          sender,
          created_at: new Date().toISOString(),
          read: false
        };

        return {
          followers: [...state.followers, newFollow],
          users: updatedUsers,
          user: updatedCurrentUser,
          notifications: [newNotif, ...state.notifications]
        };
      }),

      unfollowUserStore: (followerId, followingId) => set((state) => {
        const updatedFollowers = state.followers.filter(f => !(f.follower_id === followerId && f.following_id === followingId));
        
        const updatedUsers = state.users.map(u => {
          if (u.id === followerId) return { ...u, following_count: Math.max(0, (u.following_count || 1) - 1) };
          if (u.id === followingId) return { ...u, followers_count: Math.max(0, (u.followers_count || 1) - 1) };
          return u;
        });

        // Sync local user copy
        const updatedCurrentUser = state.user && state.user.id === followerId 
          ? { ...state.user, following_count: Math.max(0, (state.user.following_count || 1) - 1) } 
          : state.user;

        return {
          followers: updatedFollowers,
          users: updatedUsers,
          user: updatedCurrentUser
        };
      }),

      // Notifications Management
      markNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      
      clearNotificationsStore: () => set({ notifications: [] })
    }),
    {
      name: 'africaconnect-app-storage',
      version: 4, // Bumped: support text stories with bg_color
      storage,
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        users: state.users,
        posts: state.posts,
        comments: state.comments,
        likes: state.likes,
        favorites: state.favorites,
        followers: state.followers,
        stories: state.stories,
        notifications: state.notifications
      })
    }
  )
);
