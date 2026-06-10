// screens/Profile/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/zustand/useStore';
import { THEME } from '../../utils/constants';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import { formatRelativeTime } from '../../utils/helpers';
import ProfileHeader from '../../components/ProfileHeader';
import CommentModal from '../../components/CommentModal';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation, route }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];
  
  const currentUser = useStore((state) => state.user);
  const followers = useStore((state) => state.followers);

  const storeUsers = useStore((state) => state.users);

  // Target user profile (default to current logged in user)
  const routeUser = route?.params?.user || currentUser;
  const targetUser = storeUsers.find(u => u.id === routeUser?.id) || routeUser;
  const isOwnProfile = targetUser?.id === currentUser?.id;

  const { useUserPosts, useFavoritePosts, toggleFollow } = usePosts();
  const { data: userPosts = [], isLoading } = useUserPosts(targetUser?.id);
  const { logout: signOutUser } = useAuth();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'activity' or 'favorites'
  const [selectedPostId, setSelectedPostId] = useState(null);

  const isFollowing = followers.some(f => f.follower_id === currentUser?.id && f.following_id === targetUser?.id);
  const isFollower = followers.some(f => f.follower_id === targetUser?.id && f.following_id === currentUser?.id);
  const isFriend = isFollowing && isFollower;

  // Fetch favorites dynamically
  const { data: favoritePosts = [] } = useFavoritePosts();

  // Generate dynamic activity log
  const activityLog = [];
  userPosts.forEach(post => {
    activityLog.push({
      id: `act_p_${post.id}`,
      type: 'post',
      text: `Vous avez publié une nouvelle photo dans la catégorie "${post.category}".`,
      time: post.created_at
    });
  });
  favoritePosts.forEach(post => {
    activityLog.push({
      id: `act_f_${post.id}`,
      type: 'like',
      text: `Vous avez mis en favoris une photo de @${post.user?.username}.`,
      time: post.created_at // fallback, ideally we'd use the favorite's created_at
    });
  });
  activityLog.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  
  const formattedActivityLog = activityLog.map(act => ({
    ...act,
    time: formatRelativeTime(act.time)
  }));

  const handleLogout = async () => {
    await signOutUser();
  };

  const renderGridItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.9}
        onPress={() => setSelectedPostId(item.id)}
      >
        <Image source={{ uri: item.image_url }} style={styles.gridImage} />
        <View style={styles.gridOverlay}>
          <View style={styles.gridStat}>
            <Ionicons name="play-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.gridStatText}>{item.views_count || item.likes_count || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderActivityItem = ({ item: act }) => (
    <View style={[styles.activityItem, { borderBottomColor: colors.border }]}>
      <View style={[styles.activityIconWrapper, { backgroundColor: colors.background }]}>
        <Ionicons
          name={
            act.type === 'like' ? 'heart' :
            act.type === 'comment' ? 'chatbubble' :
            act.type === 'post' ? 'image' :
            act.type === 'follow' ? 'person-add' : 'sparkles'
          }
          size={16}
          color={colors.primary}
        />
      </View>
      <View style={styles.activityTextWrapper}>
        <Text style={[styles.activityText, { color: colors.text }]}>{act.text}</Text>
        <Text style={[styles.activityTime, { color: colors.textMuted }]}>{act.time}</Text>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Top Navbar */}
      <View style={styles.topBar}>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>Mon Espace</Text>
        {isOwnProfile && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutBtnText}>Déconnexion</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Header Stats */}
      <ProfileHeader
        user={{
          ...targetUser,
          posts_count: userPosts.length
        }}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        isFriend={isFriend}
        onFollow={() => toggleFollow(targetUser.id)}
        onEditPress={handleEditProfile}
      />

      {/* Custom Navigation Segments */}
      <View style={[styles.tabsRow, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'posts' && { borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab('posts')}
        >
          <Ionicons
            name={activeTab === 'posts' ? "grid" : "grid-outline"}
            size={18}
            color={activeTab === 'posts' ? colors.primary : colors.textMuted}
          />
          <Text style={[styles.tabText, { color: activeTab === 'posts' ? colors.text : colors.textMuted }]}>
            Photos
          </Text>
        </TouchableOpacity>

        {isOwnProfile && (
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'favorites' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('favorites')}
          >
            <Ionicons
              name={activeTab === 'favorites' ? "heart" : "heart-outline"}
              size={18}
              color={activeTab === 'favorites' ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.tabText, { color: activeTab === 'favorites' ? colors.text : colors.textMuted }]}>
              Favoris
            </Text>
          </TouchableOpacity>
        )}

        {isOwnProfile && (
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'activity' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('activity')}
          >
            <Ionicons
              name={activeTab === 'activity' ? "time" : "time-outline"}
              size={18}
              color={activeTab === 'activity' ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.tabText, { color: activeTab === 'activity' ? colors.text : colors.textMuted }]}>
              Activité
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const getEmptyComponent = () => {
    if (activeTab === 'posts') {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="camera-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.text }]}>Aucune photo publiée</Text>
        </View>
      );
    }
    if (activeTab === 'favorites') {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.text }]}>Aucun favori pour le moment</Text>
        </View>
      );
    }
    return null;
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <FlatList
        key={activeTab === 'activity' ? 'list' : 'grid3'}
        data={activeTab === 'posts' ? userPosts : activeTab === 'favorites' ? favoritePosts : formattedActivityLog}
        keyExtractor={(item) => item.id}
        renderItem={activeTab === 'activity' ? renderActivityItem : renderGridItem}
        numColumns={activeTab === 'activity' ? 1 : 3}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={activeTab === 'activity' ? styles.activityContainer : styles.gridContent}
        ListEmptyComponent={getEmptyComponent()}
      />

      {/* Comment Details modal sheets */}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 52,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    height: 48,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  gridContent: {
    padding: 1,
  },
  gridCard: {
    width: '33.33%',
    aspectRatio: 1 / 1.35,
    padding: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 36,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  gridStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridStatText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    width: '100%',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
  },
  activityContainer: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityTextWrapper: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 10.5,
    marginTop: 4,
  },
});
