// screens/Home/ExploreScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/zustand/useStore';
import { THEME } from '../../utils/constants';
import { usePosts } from '../../hooks/usePosts';
import SearchBar from '../../components/SearchBar';
import { getRecommendedPosts } from '../../utils/helpers';
import CommentModal from '../../components/CommentModal';

export default function ExploreScreen() {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];
  
  const currentUser = useStore((state) => state.user);
  const likes = useStore((state) => state.likes);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPostIdForComments, setSelectedPostIdForComments] = useState(null);

  // 1. Fetch posts via React Query
  const { posts, isLoadingPosts } = usePosts(activeCategory);

  // 2. Filter posts in real-time based on query
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    // First, filter by search query (if any)
    let list = [...posts];
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.user?.username?.toLowerCase().includes(q)
      );
    }
    
    // Sort posts: if the user has liked some posts, let's run our intelligent recommendation engine to push the best recommendations at the top!
    const userLikedPostIds = likes
      .filter(l => l.user_id === currentUser?.id)
      .map(l => l.post_id);
    
    return getRecommendedPosts(list, userLikedPostIds, currentUser?.id);
  }, [posts, searchQuery, likes, currentUser]);

  const renderGridItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.9}
        onPress={() => setSelectedPostIdForComments(item.id)}
      >
        <Image source={{ uri: item.image_url }} style={styles.gridImage} />
        
        {/* HSL Gradient overlay on grid item bottom for text readability */}
        <View style={styles.gradientOverlay}>
          <View style={styles.gridCardHeader}>
            <Image source={{ uri: item.user?.avatar }} style={styles.gridAvatar} />
            <Text style={styles.gridAuthorName} numberOfLines={1}>@{item.user?.username}</Text>
          </View>
          <View style={styles.gridCardStats}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={10} color="#fff" style={{ marginRight: 2 }} />
              <Text style={styles.statCount}>{item.likes_count || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={10} color="#fff" style={{ marginRight: 2 }} />
              <Text style={styles.statCount}>{item.comments_count || 0}</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.categoryLabel, { backgroundColor: colors.secondary }]}>
          <Text style={styles.categoryLabelText}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Search Banner */}
      <View style={[styles.headerContainer, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Découverte</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>Explorez les tendances populaires de notre communauté</Text>
      </View>

      <SearchBar
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Grid Content */}
      {isLoadingPosts ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderGridItem}
          numColumns={3}
          contentContainerStyle={styles.gridScrollContent}
          
          // Highly optimized flatlist parameters as recommended
          initialNumToRender={12}
          maxToRenderPerBatch={6}
          windowSize={5}
          showsVerticalScrollIndicator={false}

          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.text }]}>Aucun résultat correspondant</Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Essayez de chercher une autre catégorie ou mot-clé comme "Wax" ou "Cuisine".</Text>
            </View>
          }
        />
      )}

      {/* Interactive Modal to view comment stats */}
      <CommentModal
        visible={!!selectedPostIdForComments}
        onClose={() => setSelectedPostIdForComments(null)}
        postId={selectedPostIdForComments}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 11.5,
    marginTop: 4,
    lineHeight: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridScrollContent: {
    padding: 1,
    paddingBottom: 24,
  },
  gridCard: {
    width: '33.33%',
    aspectRatio: 1 / 1.35,
    padding: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    padding: 8,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)', // transparent fallback
  },
  gridCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  gridAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  gridAuthorName: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
  },
  gridCardStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCount: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
  },
  categoryLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryLabelText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 12.5,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
