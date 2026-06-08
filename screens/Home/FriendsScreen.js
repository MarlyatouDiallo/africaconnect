// screens/Home/FriendsScreen.js
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/zustand/useStore';
import { THEME } from '../../utils/constants';
import { usePosts } from '../../hooks/usePosts';

export default function FriendsScreen({ navigation }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];
  
  const currentUser = useStore((state) => state.user);
  const users = useStore((state) => state.users);
  const followers = useStore((state) => state.followers);
  
  const { toggleFollow } = usePosts();

  const otherUsers = users.filter(u => u.id !== currentUser?.id);

  const renderUser = ({ item }) => {
    const isFollowing = followers.some(f => f.follower_id === currentUser?.id && f.following_id === item.id);
    const isFollower = followers.some(f => f.follower_id === item.id && f.following_id === currentUser?.id);
    const isFriend = isFollowing && isFollower;

    return (
      <TouchableOpacity 
        style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('ProfileTab', { screen: 'ProfileMain', params: { user: item } })}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: colors.text }]}>@{item.username}</Text>
          <Text style={[styles.bio, { color: colors.textMuted }]} numberOfLines={2}>{item.bio}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.followButton, isFollowing ? { backgroundColor: colors.border } : { backgroundColor: colors.primary }]}
          onPress={() => toggleFollow(item.id)}
        >
          <Text style={[styles.followText, isFollowing ? { color: colors.text } : { color: '#fff' }]}>
            {isFriend ? 'Amis' : (isFollowing ? 'Abonné' : 'S\'abonner')}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Amis & Contacts</Text>
      </View>
      <FlatList
        data={otherUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bio: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
