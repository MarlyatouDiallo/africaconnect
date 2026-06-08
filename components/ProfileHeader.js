// components/ProfileHeader.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/zustand/useStore';
import { THEME } from '../utils/constants';

export default function ProfileHeader({ user, isOwnProfile, isFollowing, isFriend, onFollow, onEditPress }) {
  const themeMode = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const colors = THEME[themeMode];

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      {/* Top action row */}
      <View style={styles.topRow}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          @{user?.username || 'profile'}
        </Text>
        
        <TouchableOpacity style={[styles.themeToggle, { backgroundColor: colors.background }]} onPress={toggleTheme}>
          <Ionicons
            name={themeMode === 'light' ? 'moon' : 'sunny'}
            size={18}
            color={themeMode === 'light' ? colors.primary : '#FFD700'}
          />
        </TouchableOpacity>
      </View>

      {/* Main Info Row */}
      <View style={styles.profileRow}>
        <Image
          source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' }}
          style={[styles.avatar, { borderColor: colors.border }]}
        />
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {user?.posts_count || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Photos</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {user?.followers_count || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Abonnés</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {user?.following_count || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Abonnements</Text>
          </View>
        </View>
      </View>

      {/* Biography and buttons */}
      <View style={styles.bioContainer}>
        <Text style={[styles.fullName, { color: colors.text }]}>
          {user?.username ? user.username.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Utilisateur'}
          <Ionicons name="checkmark-circle" size={14} color={colors.secondary} style={styles.verified} />
        </Text>
        
        <Text style={[styles.bioText, { color: colors.text }]}>
          {user?.bio || 'Pas encore de biographie.'}
        </Text>
        
        {/* Buttons */}
        {isOwnProfile ? (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
            onPress={onEditPress}
          >
            <Ionicons name="settings-outline" size={14} color={colors.text} style={styles.btnIcon} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Modifier mon profil</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: isFollowing ? 'transparent' : colors.primary,
                borderColor: isFollowing ? colors.border : colors.primary
              }
            ]}
            onPress={onFollow}
          >
            <Ionicons
              name={isFriend ? "people-outline" : (isFollowing ? "person-remove-outline" : "person-add-outline")}
              size={14}
              color={isFollowing ? colors.text : '#fff'}
              style={styles.btnIcon}
            />
            <Text style={[styles.actionButtonText, { color: isFollowing ? colors.text : '#fff' }]}>
              {isFriend ? 'Amis' : (isFollowing ? 'Se désabonner' : 'S\'abonner')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    paddingTop: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  themeToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  bioContainer: {
    marginTop: 14,
  },
  fullName: {
    fontSize: 14,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  verified: {
    marginLeft: 4,
  },
  bioText: {
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
  },
  btnIcon: {
    marginRight: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
