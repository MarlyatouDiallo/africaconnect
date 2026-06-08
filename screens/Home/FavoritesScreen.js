// screens/Home/FavoritesScreen.js
import React, { useState } from 'react';
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
import CommentModal from '../../components/CommentModal';

export default function FavoritesScreen() {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];
  
  const { useFavoritePosts } = usePosts();
  const { data: favoritePosts = [], isLoading } = useFavoritePosts();

  const [selectedPostId, setSelectedPostId] = useState(null);

  const renderGridItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.9}
        onPress={() => setSelectedPostId(item.id)}
      >
        <Image source={{ uri: item.image_url }} style={styles.gridImage} />
        
        {/* Overlay info */}
        <View style={styles.overlay}>
          <Text style={styles.authorText} numberOfLines={1}>@{item.user?.username}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="heart" size={10} color="#fff" style={{ marginRight: 2 }} />
              <Text style={styles.statNum}>{item.likes_count || 0}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="chatbubble" size={10} color="#fff" style={{ marginRight: 2 }} />
              <Text style={styles.statNum}>{item.comments_count || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="heart-circle" size={24} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Mes Favoris</Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Retrouvez les photos inspirantes que vous avez enregistrées
        </Text>
      </View>

      {/* Main Grid */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={favoritePosts}
          keyExtractor={(item) => item.id}
          renderItem={renderGridItem}
          numColumns={3}
          contentContainerStyle={styles.gridScrollContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={64} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun favori pour l'instant</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                Cliquez sur l'icône de signet sur une publication pour la retrouver ici en mode hors-ligne.
              </Text>
            </View>
          }
        />
      )}

      {/* Dynamic Comment Details Sheet */}
      <CommentModal
        visible={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
        postId={selectedPostId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 11.5,
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridScrollContent: {
    padding: 1,
  },
  gridCard: {
    width: '33.33%',
    aspectRatio: 1 / 1.35,
    padding: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    padding: 8,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  authorText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNum: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
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
});
