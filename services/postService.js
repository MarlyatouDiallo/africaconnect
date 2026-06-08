// services/postService.js
import { supabase, isSupabaseConfigured } from './supabase';
import { useStore } from '../store/zustand/useStore';
import { simulateImageCompression } from '../utils/helpers';

export const postService = {
  // Supabase fonctionne pour la LECTURE (anon key OK avec RLS SELECT)
  shouldUseSupabaseForReads: () => isSupabaseConfigured,
  // Les ÉCRITURES passent par le store local (RLS bloque INSERT/UPDATE/DELETE sans auth)
  shouldUseSupabaseForWrites: () => false,
  /**
   * Fetches posts, optionally filtered by category
   */
  getPosts: async (category = 'all') => {
    if (false) { // Lecture locale — Supabase key bloquée côté browser
      console.log('postService.getPosts: fetching category', category);
      let query = supabase
        .from('posts')
        .select('*, users(*)');
      
      if (category !== 'all') {
        query = query.ilike('category', category);
      }
      
      // Order by latest
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      // Normalize user relations for frontend consistency
      return data.map(post => ({
        ...post,
        user: post.users // map PostgreSQL join 'users' to single 'user' key
      }));
    } else {
      // Simulation mode
      await new Promise(resolve => setTimeout(resolve, 500));
      const store = useStore.getState();
      
      const isPostVisible = (p) => {
        const privacy = p.privacy || 'public';
        if (privacy === 'public') return true;
        if (!store.user) return false;
        if (p.user_id === store.user.id) return true;
        const follows12 = store.followers.some(f => f.follower_id === store.user.id && f.following_id === p.user_id);
        const follows21 = store.followers.some(f => f.follower_id === p.user_id && f.following_id === store.user.id);
        return follows12 && follows21;
      };

      let filteredPosts = store.posts.filter(isPostVisible);
      if (category !== 'all') {
        filteredPosts = filteredPosts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
      }
      
      // Sort latest first
      filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      // Inject author user profile details
      return filteredPosts.map(post => ({
        ...post,
        user: store.users.find(u => u.id === post.user_id) || store.user
      }));
    }
  },

  /**
   * Creates a new post with automatic image compression
   */
  createPost: async (userId, imageUri, description, category, privacy = 'public') => {
    // 1. Intelligent Compression
    const compressionResult = await simulateImageCompression(imageUri);
    console.log("💾 Compression d'image réussie :", compressionResult);
    
    if (postService.shouldUseSupabaseForWrites()) {
      // 2a. Real Supabase Upload to Storage Bucket 'posts-images'
      const fileExtension = imageUri.split('.').pop() || 'jpg';
      const fileName = `${userId}/${Date.now()}.${fileExtension}`;
      
      // Convert image uri to Blob (mocked for react native web/mobile environments)
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts-images')
        .upload(fileName, blob, { contentType: `image/${fileExtension}` });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('posts-images')
        .getPublicUrl(fileName);

      const publicImageUrl = urlData.publicUrl;

      // 3a. Insert database record
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          image_url: publicImageUrl,
          description,
          category,
          privacy,
          likes_count: 0,
          comments_count: 0,
          views_count: 0
        })
        .select('*, users(*)')
        .single();

      if (error) throw error;
      
      const newPost = { ...data, user: data.users };
      // Push into local zustand copy
      useStore.getState().addPost(newPost);
      return { post: newPost, compression: compressionResult };
    } else {
      // Simulation mode
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newPost = {
        id: `p_${Date.now()}`,
        user_id: userId,
        image_url: imageUri,
        description,
        category,
        privacy,
        likes_count: 0,
        comments_count: 0,
        views_count: 1,
        created_at: new Date().toISOString()
      };

      const store = useStore.getState();
      const user = store.users.find(u => u.id === userId) || store.user;
      
      const postWithUser = {
        ...newPost,
        user
      };

      // Add to store
      store.addPost(newPost);
      
      return { post: postWithUser, compression: compressionResult };
    }
  },

  /**
   * Deletes a post
   */
  deletePost: async (postId) => {
    if (postService.shouldUseSupabaseForWrites()) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
    }
    
    // Sync local store
    useStore.getState().deletePost(postId);
  },

  /**
   * Likes or Unlikes a post
   */
  toggleLike: async (postId, userId) => {
    const store = useStore.getState();
    const isRealSupabase = postService.shouldUseSupabaseForWrites();
    
    const isLiked = isRealSupabase
      ? false // will be checked via DB in real mode
      : store.likes.some(l => l.post_id === postId && l.user_id === userId);

    if (isRealSupabase) {
      // Check if already liked in database
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingLike) {
        // Unlike: delete from likes table
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
        if (error) throw error;
        
        useStore.getState().unlikePostStore(postId, userId);
        return { liked: false };
      } else {
        // Like: insert record
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: userId });
        if (error) throw error;
        
        useStore.getState().likePostStore(postId, userId);
        return { liked: true };
      }
    } else {
      // Simulation mode
      if (isLiked) {
        store.unlikePostStore(postId, userId);
        return { liked: false };
      } else {
        store.likePostStore(postId, userId);
        return { liked: true };
      }
    }
  },

  /**
   * Favorites or Unfavorites a post
   */
  toggleFavorite: async (postId, userId) => {
    const store = useStore.getState();
    const isRealSupabase = postService.shouldUseSupabaseForWrites();

    const isFavorited = isRealSupabase
      ? false
      : store.favorites.some(f => f.post_id === postId && f.user_id === userId);

    if (isRealSupabase) {
      // Check database
      const { data: existingFav } = await supabase
        .from('favorites')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existingFav.id);
        if (error) throw error;
        
        useStore.getState().unfavoritePostStore(postId, userId);
        return { favorited: false };
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ post_id: postId, user_id: userId });
        if (error) throw error;
        
        useStore.getState().favoritePostStore(postId, userId);
        return { favorited: true };
      }
    } else {
      if (isFavorited) {
        store.unfavoritePostStore(postId, userId);
        return { favorited: false };
      } else {
        store.favoritePostStore(postId, userId);
        return { favorited: true };
      }
    }
  },

  /**
   * Fetches comments for a specific post
   */
  getComments: async (postId) => {
    if (false) { // Commentaires stockés localement, donc lecture locale
      const { data, error } = await supabase
        .from('comments')
        .select('*, users(*)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      
      return data.map(c => ({
        ...c,
        user: c.users
      }));
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      const store = useStore.getState();
      const filteredComments = store.comments.filter(c => c.post_id === postId);
      
      return filteredComments.map(c => ({
        ...c,
        user: store.users.find(u => u.id === c.user_id) || store.user
      }));
    }
  },

  /**
   * Adds a new comment
   */
  addComment: async (postId, userId, content) => {
    const isRealSupabase = postService.shouldUseSupabaseForWrites();

    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('comments')
        .insert({ post_id: postId, user_id: userId, content })
        .select('*, users(*)')
        .single();
      if (error) throw error;
      
      const newComment = { ...data, user: data.users };
      // Sync local copy
      useStore.getState().addCommentStore(postId, userId, content);
      return newComment;
    } else {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const store = useStore.getState();
      store.addCommentStore(postId, userId, content);
      
      const comments = store.comments;
      const latestComment = comments[comments.length - 1];
      
      return {
        ...latestComment,
        user: store.users.find(u => u.id === userId) || store.user
      };
    }
  },

  /**
   * Fetches favorite posts for a specific user
   */
  getFavorites: async (userId) => {
    if (false) { // Favoris stockés localement, donc lecture locale
      const { data, error } = await supabase
        .from('favorites')
        .select('*, posts(*, users(*))')
        .eq('user_id', userId);
      if (error) throw error;
      
      return data.map(f => ({
        ...f.posts,
        user: f.posts.users
      }));
    } else {
      const store = useStore.getState();
      
      const isPostVisible = (p) => {
        const privacy = p.privacy || 'public';
        if (privacy === 'public') return true;
        if (!store.user) return false;
        if (p.user_id === store.user.id) return true;
        const follows12 = store.followers.some(f => f.follower_id === store.user.id && f.following_id === p.user_id);
        const follows21 = store.followers.some(f => f.follower_id === p.user_id && f.following_id === store.user.id);
        return follows12 && follows21;
      };

      const favIds = store.favorites.filter(f => f.user_id === userId).map(f => f.post_id);
      const favPosts = store.posts.filter(p => favIds.includes(p.id) && isPostVisible(p));
      
      return favPosts.map(post => ({
        ...post,
        user: store.users.find(u => u.id === post.user_id) || store.user
      }));
    }
  },

  /**
   * Fetches posts created by a specific user
   */
  getUserPosts: async (userId) => {
    if (false) { // Lecture locale — Supabase key bloquée côté browser
      const { data, error } = await supabase
        .from('posts')
        .select('*, users(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      return data.map(p => ({
        ...p,
        user: p.users
      }));
    } else {
      const store = useStore.getState();

      const isPostVisible = (p) => {
        const privacy = p.privacy || 'public';
        if (privacy === 'public') return true;
        if (!store.user) return false;
        if (p.user_id === store.user.id) return true;
        const follows12 = store.followers.some(f => f.follower_id === store.user.id && f.following_id === p.user_id);
        const follows21 = store.followers.some(f => f.follower_id === p.user_id && f.following_id === store.user.id);
        return follows12 && follows21;
      };

      const userPosts = store.posts.filter(p => p.user_id === userId && isPostVisible(p));
      userPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      return userPosts.map(post => ({
        ...post,
        user: store.users.find(u => u.id === post.user_id) || store.user
      }));
    }
  },

  /**
   * Follows or unfollows a user
   */
  toggleFollow: async (followerId, followingId) => {
    const store = useStore.getState();
    const isRealSupabase = postService.shouldUseSupabaseForWrites();

    const isFollowing = isRealSupabase
      ? false
      : store.followers.some(f => f.follower_id === followerId && f.following_id === followingId);

    if (isRealSupabase) {
      // Check database
      const { data: existingFollow } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();

      if (existingFollow) {
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('id', existingFollow.id);
        if (error) throw error;
        
        useStore.getState().unfollowUserStore(followerId, followingId);
        return { following: false };
      } else {
        const { error } = await supabase
          .from('followers')
          .insert({ follower_id: followerId, following_id: followingId });
        if (error) throw error;
        
        useStore.getState().followUserStore(followerId, followingId);
        return { following: true };
      }
    } else {
      if (isFollowing) {
        store.unfollowUserStore(followerId, followingId);
        return { following: false };
      } else {
        store.followUserStore(followerId, followingId);
        return { following: true };
      }
    }
  },

  /**
   * Fetches stories
   */
  getStories: async () => {
    if (false) { // Lecture locale — Supabase key bloquée côté browser
      // Load active stories from the last 24 hours
      const timestamp24hAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('stories')
        .select('*, users(*)')
        .gt('created_at', timestamp24hAgo)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(s => ({
        ...s,
        user: s.users
      }));
    } else {
      const store = useStore.getState();
      const timestamp24hAgo = Date.now() - 24 * 60 * 60 * 1000;
      
      const activeStories = store.stories.filter(s => new Date(s.created_at).getTime() > timestamp24hAgo);
      
      return activeStories.map(story => ({
        ...story,
        user: store.users.find(u => u.id === story.user_id) || store.user
      }));
    }
  },

  /**
   * Creates a new story (image or text)
   */
  createStory: async (userId, { imageUri, textContent, bgColor }) => {
    if (postService.shouldUseSupabaseForWrites()) {
      let finalImageUrl = null;
      
      if (imageUri) {
        const fileExtension = imageUri.split('.').pop() || 'jpg';
        const fileName = `${userId}/${Date.now()}.${fileExtension}`;
        
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('stories-images')
          .upload(fileName, blob, { contentType: `image/${fileExtension}` });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('stories-images')
          .getPublicUrl(fileName);
          
        finalImageUrl = urlData.publicUrl;
      }

      const { data, error } = await supabase
        .from('stories')
        .insert({ 
          user_id: userId, 
          image_url: finalImageUrl,
          text_content: textContent || null,
          bg_color: bgColor || null
        })
        .select('*, users(*)')
        .single();

      if (error) throw error;
      
      const newStory = { ...data, user: data.users };
      useStore.getState().addStoryStore(newStory);
      return newStory;
    } else {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newStory = {
        id: `s_${Date.now()}`,
        user_id: userId,
        image_url: imageUri || null,
        text_content: textContent || null,
        bg_color: bgColor || null,
        created_at: new Date().toISOString()
      };
      
      const store = useStore.getState();
      store.addStoryStore(newStory);
      
      return {
        ...newStory,
        user: store.users.find(u => u.id === userId) || store.user
      };
    }
  }
};
