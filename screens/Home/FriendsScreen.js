// screens/Home/FriendsScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
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

  const [searchQuery, setSearchQuery] = useState('');

  const otherUsers = users.filter(u => u.id !== currentUser?.id);
  
  const filteredUsers = otherUsers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Rechercher un ami (nom ou prénom)..."
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.text }]}>Aucun utilisateur trouvé</Text>
          </View>
        }
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
