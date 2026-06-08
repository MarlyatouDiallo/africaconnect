// components/StoryCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/zustand/useStore';
import { THEME } from '../utils/constants';

export default function StoryCard({ story, onPress, isCurrentUser }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];

  const username = isCurrentUser ? 'Ma Story' : `@${story.user?.username || 'user'}`;

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <LinearGradient
        colors={colors.activeStoryBorder}
        start={{ x: 0.0, y: 1.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradientBorder}
      >
        <View style={[styles.innerCircle, { backgroundColor: colors.background }]}>
          <Image
            source={{ uri: isCurrentUser ? useStore.getState().user?.avatar || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200' : story.user?.avatar }}
            style={styles.avatar}
          />
        </View>
      </LinearGradient>
      
      <Text style={[styles.usernameText, { color: colors.text }]} numberOfLines={1}>
        {username}
      </Text>
      
      {isCurrentUser && (
        <View style={[styles.plusBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.plusText}>+</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    position: 'relative',
    width: 76,
  },
  gradientBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  usernameText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
    width: '100%',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 20,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  plusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
});
