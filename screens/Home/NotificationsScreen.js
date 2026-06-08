// screens/Home/NotificationsScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useStore } from '../../store/zustand/useStore';
import { THEME } from '../../utils/constants';

export default function NotificationsScreen() {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];
  
  const notifications = useStore((state) => state.notifications);
  const markNotificationsAsRead = useStore((state) => state.markNotificationsAsRead);

  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  const renderNotification = ({ item }) => {
    let actionText = '';
    if (item.type === 'like') actionText = 'a aimé votre photo.';
    else if (item.type === 'comment') actionText = `a commenté : "${item.content}"`;
    else if (item.type === 'follow') actionText = 'a commencé à vous suivre.';

    return (
      <View style={[styles.notificationCard, { backgroundColor: item.read ? colors.card : colors.background, borderBottomColor: colors.border }]}>
        <Image source={{ uri: item.sender?.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={[styles.text, { color: colors.text }]}>
            <Text style={styles.username}>@{item.sender?.username} </Text>
            {actionText}
          </Text>
          <Text style={[styles.time, { color: colors.textMuted }]}>
            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {item.post_image && (
          <Image source={{ uri: item.post_image }} style={styles.postThumbnail} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Aucune notification</Text>
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
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  username: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
  postThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
  },
});
