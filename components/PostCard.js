// components/PostCard.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/zustand/useStore';
import { THEME } from '../utils/constants';
import { formatRelativeTime } from '../utils/helpers';

export default function PostCard({ post, onLike, onFavorite, onFollow, onOpenComments }) {
  const themeMode = useStore((state) => state.theme);
  const currentUser = useStore((state) => state.user);
  const likes = useStore((state) => state.likes);
  const favorites = useStore((state) => state.favorites);
  const followers = useStore((state) => state.followers);
  const addPost = useStore((state) => state.addPost);
  
  const colors = THEME[themeMode];
  
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [lastPress, setLastPress] = useState(0);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  const isLiked = likes.some(l => l.post_id === post.id && l.user_id === currentUser?.id);
  const isFavorited = favorites.some(f => f.post_id === post.id && f.user_id === currentUser?.id);
  const isFollowing = followers.some(f => f.follower_id === currentUser?.id && f.following_id === post.user_id);
  const isOwnPost = post.user_id === currentUser?.id;

  // Double tap to like
  const handleImagePress = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastPress < DOUBLE_PRESS_DELAY) {
      if (!isLiked) {
        onLike(post.id);
      }
      setShowHeartOverlay(true);
      setTimeout(() => setShowHeartOverlay(false), 800);
    }
    setLastPress(now);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cette magnifique publication sur AfricaConnect : "${post.description}" par @${post.user?.username || 'user'}.`,
        url: post.image_url
      });
      
      // Repost sur le profil de l'utilisateur
      if (currentUser && !isOwnPost) {
        const newPost = {
          id: `p_repost_${Date.now()}`,
          user_id: currentUser.id,
          image_url: post.image_url,
          description: `🔁 Repost de @${post.user?.username || 'user'} : ${post.description || ''}`,
          category: post.category,
          likes_count: 0,
          comments_count: 0,
          views_count: 1,
          created_at: new Date().toISOString(),
          user: currentUser
        };
        addPost(newPost);
        if (Platform.OS === 'web') {
          window.alert("Publication partagée sur votre profil !");
        } else {
          alert("Publication partagée sur votre profil !");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderDescription = () => {
    if (!post.description) return null;

    const words = post.description.split(' ');
    return (
      <Text style={[styles.description, { color: colors.text }]}>
        <Text style={styles.usernameBold}>@{post.user?.username || 'user'} </Text>
        {words.map((word, index) => {
          if (word.startsWith('#')) {
            return (
              <Text key={index} style={[styles.hashtag, { color: colors.primary }]}>
                {word}{' '}
              </Text>
            );
          }
          return <Text key={index}>{word} </Text>;
        })}
      </Text>
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorContainer}>
          <Image
            source={{ uri: post.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' }}
            style={styles.avatar}
            {...(Platform.OS === 'web' ? { crossOrigin: 'anonymous' } : {})}
          />
          <View>
            <Text style={[styles.username, { color: colors.text }]}>@{post.user?.username || 'anonymous'}</Text>
            <Text style={[styles.time, { color: colors.textMuted }]}>{formatRelativeTime(post.created_at)}</Text>
          </View>
        </View>

        {!isOwnPost && currentUser && (
          <TouchableOpacity
            style={[
              styles.followButton,
              {
                borderColor: isFollowing ? colors.border : colors.primary,
                backgroundColor: isFollowing ? 'transparent' : colors.primary
              }
            ]}
            onPress={() => onFollow(post.user_id)}
          >
            <Text style={[styles.followText, { color: isFollowing ? colors.textMuted : '#fff' }]}>
              {isFollowing ? 'Abonné' : 'S\'abonner'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Image */}
      <TouchableOpacity activeOpacity={0.9} onPress={handleImagePress} style={styles.imageWrapper}>
        {Platform.OS === 'web' ? (
          // Sur le web : balise img HTML directe (pas de problème CORS)
          <img
            src={post.image_url}
            alt={post.description || 'Photo AfricaConnect'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop';
            }}
          />
        ) : (
          // Sur mobile : composant Image React Native
          <Image
            source={{ uri: post.image_url }}
            style={styles.postImage}
            onError={() => console.log('Erreur image:', post.image_url)}
          />
        )}
        
        {/* Category tag */}
        <View style={[styles.categoryBadge, { backgroundColor: colors.secondary }]}>
          <Text style={styles.categoryText}>{(post.category || 'photo').toUpperCase()}</Text>
        </View>

        {/* Double-tap heart overlay animation */}
        {showHeartOverlay && (
          <View style={styles.heartOverlay}>
            <Ionicons name="heart" size={100} color="rgba(255, 255, 255, 0.9)" />
          </View>
        )}
      </TouchableOpacity>

      {/* Action Bar */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => onLike(post.id)}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={26} color={isLiked ? colors.primary : colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => onOpenComments && onOpenComments(post.id)}>
            <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Ionicons name="paper-plane-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconButton} onPress={() => onFavorite(post.id)}>
          <Ionicons name={isFavorited ? "bookmark" : "bookmark-outline"} size={24} color={isFavorited ? colors.primary : colors.text} />
        </TouchableOpacity>
      </View>

      {/* Statistics and Description */}
      <View style={styles.content}>
        <Text style={[styles.likesCount, { color: colors.text }]}>
          {post.likes_count || 0} {post.likes_count === 1 ? 'like' : 'likes'} • {post.views_count || 1} {post.views_count === 1 ? 'vue' : 'vues'}
        </Text>
        
        {renderDescription()}

        {post.comments_count > 0 ? (
          <TouchableOpacity onPress={() => onOpenComments && onOpenComments(post.id)}>
            <Text style={[styles.viewComments, { color: colors.textMuted }]}>
              Voir les {post.comments_count} commentaires...
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onOpenComments && onOpenComments(post.id)}>
            <Text style={[styles.viewComments, { color: colors.textMuted }]}>
              Ajouter un commentaire...
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 10,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  time: {
    fontSize: 11,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
  },
  followText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageWrapper: {
    position: 'relative',
    height: 380,
    width: '100%',
  },
  postImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  heartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginRight: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  likesCount: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  usernameBold: {
    fontWeight: 'bold',
  },
  hashtag: {
    fontWeight: '600',
  },
  viewComments: {
    fontSize: 13,
    marginTop: 4,
  },
});
