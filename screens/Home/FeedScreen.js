// screens/Home/FeedScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Image,
  RefreshControl
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/zustand/useStore';
import { THEME, CATEGORIES } from '../../utils/constants';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../../components/PostCard';
import StoryCard from '../../components/StoryCard';
import CommentModal from '../../components/CommentModal';

export default function FeedScreen({ navigation }) {
  const themeMode = useStore((state) => state.theme);
  const currentUser = useStore((state) => state.user);
  const isOffline = useStore((state) => state.isOffline);
  const setOffline = useStore((state) => state.setOffline);
  const addStoryStore = useStore((state) => state.addStoryStore);
  
  const colors = THEME[themeMode];

  const [activeStory, setActiveStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  // 1. Fetch data via React Query
  const {
    posts,
    isLoadingPosts,
    isRefetchingPosts,
    refetchPosts,
    stories,
    toggleLike,
    toggleFavorite,
    toggleFollow,
    postsError,
    createStory
  } = usePosts(selectedCategory);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      if (navigation.isFocused()) {
        refetchPosts();
      }
    });
    return unsubscribe;
  }, [navigation, refetchPosts]);

  // Debug: log posts count and any error
  console.log('FeedScreen: posts count', posts?.length, 'error', postsError);

  const filteredPosts = posts;

  // Story playback timer
  useEffect(() => {
    let interval;
    if (activeStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setActiveStory(null);
            return 100;
          }
          return prev + 2;
        });
      }, 80);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  const handleCreateStory = () => {
    if (!currentUser) {
      alert('Vous devez être connecté pour publier un statut.');
      return;
    }

    navigation.navigate('CreateStory');
  };

  const renderStoryHeader = () => {
    return (
      <View>

        <View style={styles.categoriesBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === cat.id ? colors.primary : colors.card,
                    borderColor: selectedCategory === cat.id ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[styles.categoryText, { color: selectedCategory === cat.id ? '#fff' : colors.text }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.storySection, { borderBottomColor: colors.border }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storyScroll}
          >
            {/* Add story for current user */}
            <StoryCard
              isCurrentUser={true}
              onPress={handleCreateStory}
            />
            
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onPress={() => setActiveStory(story)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderPostItem = ({ item }) => (
    <PostCard
      post={item}
      onLike={toggleLike}
      onFavorite={toggleFavorite}
      onFollow={toggleFollow}
      onOpenComments={setActiveCommentPostId}
    />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={themeMode === 'light' ? 'dark-content' : 'light-content'} />
      
      {/* Top Header Bar */}
      <View style={[styles.navbar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.navBrand}>
          <Text style={[styles.navTitle, { color: colors.text }]}>AfricaConnect</Text>
          <View style={[styles.liveBadge, { backgroundColor: isOffline ? '#757575' : colors.secondary }]}>
            <Text style={styles.liveBadgeText}>{isOffline ? 'OFFLINE' : 'LIVE'}</Text>
          </View>
        </View>

        <View style={styles.navActions}>
          {/* Offline demo trigger */}
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: colors.background }]}
            onPress={() => setOffline(!isOffline)}
          >
            <Ionicons
              name={isOffline ? "wifi-off" : "wifi"}
              size={18}
              color={isOffline ? colors.textMuted : colors.secondary}
            />
          </TouchableOpacity>

          {/* Activity Logs indicator */}
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: colors.background }]}>
            <Ionicons name="notifications-outline" size={18} color={colors.text} />
            <View style={[styles.badgeIndicator, { backgroundColor: colors.primary }]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quoi de neuf (Sticky at the top) */}
      <TouchableOpacity 
        style={[styles.createPostBar, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Image source={{ uri: currentUser?.avatar }} style={styles.createPostAvatar} />
        <Text style={[styles.createPostPlaceholder, { color: colors.textMuted }]}>
          Quoi de neuf ?
        </Text>
        <Ionicons name="images" size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* Connection Offline Bar */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline" size={12} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.offlineText}>Mode hors ligne actif • Affichage du cache local</Text>
        </View>
      )}

      {/* Main feed list */}
      {isLoadingPosts && posts.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Chargement de votre flux...</Text>
        </View>
      ) : postsError ? (
        <View style={styles.loaderContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Erreur de chargement des posts: {postsError.message}</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          ListHeaderComponent={renderStoryHeader}
          contentContainerStyle={styles.feedScrollContent}
          
          // Performance Optimizations
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={5}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingPosts}
              onRefresh={refetchPosts}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={60} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun post trouvé</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Soyez le premier à partager une superbe photo dans cette catégorie !</Text>
            </View>
          }
        />
      )}

      {/* Story Fullscreen Viewer Modal */}
      <Modal
        visible={!!activeStory}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveStory(null)}
      >
        <View style={styles.storyModalContainer}>
          <TouchableOpacity style={styles.storyCloseBackdrop} activeOpacity={1} onPress={() => setActiveStory(null)} />
          
          <View style={styles.storyViewerBox}>
            {/* Progress indicator */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${storyProgress}%` }]} />
            </View>

            {/* Header info */}
            <View style={styles.storyModalHeader}>
              <Image source={{ uri: activeStory?.user?.avatar }} style={styles.storyModalAvatar} />
              <Text style={styles.storyModalUsername}>@{activeStory?.user?.username}</Text>
              <TouchableOpacity onPress={() => setActiveStory(null)} style={styles.storyModalCloseBtn}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Story Content */}
            {activeStory?.text_content ? (
              <View style={[styles.storyModalImg, { backgroundColor: activeStory.bg_color || '#000', justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>
                  {activeStory.text_content}
                </Text>
              </View>
            ) : (
              <Image source={{ uri: activeStory?.image_url }} style={styles.storyModalImg} />
            )}
          </View>
        </View>
      </Modal>

      {/* Comment Modal */}
      <CommentModal
        visible={!!activeCommentPostId}
        onClose={() => setActiveCommentPostId(null)}
        postId={activeCommentPostId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    elevation: 3,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  liveBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  navActions: {
    flexDirection: 'row',
    gap: 10,
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'hsl(24, 15%, 25%)',
    height: 24,
  },
  offlineText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  storySection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  storyScroll: {
    paddingHorizontal: 12,
  },
  feedScrollContent: {
    paddingBottom: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 12.5,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  storyModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyCloseBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  storyViewerBox: {
    width: '100%',
    height: '90%',
    position: 'relative',
  },
  progressBarBg: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
    marginTop: 40,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  storyModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  storyModalAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
  },
  storyModalUsername: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  storyModalCloseBtn: {
    padding: 4,
  },
  storyModalImg: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  createPostBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 24,
    borderWidth: 1,
  },
  createPostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  createPostPlaceholder: {
    flex: 1,
    fontSize: 14,
  },
  categoriesBar: {
    paddingVertical: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
