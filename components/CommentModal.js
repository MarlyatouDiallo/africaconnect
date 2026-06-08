// components/CommentModal.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/zustand/useStore';
import { THEME } from '../utils/constants';
import { postService } from '../services/postService';
import { formatRelativeTime } from '../utils/helpers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function CommentModal({ visible, onClose, postId }) {
  const themeMode = useStore((state) => state.theme);
  const currentUser = useStore((state) => state.user);
  const colors = THEME[themeMode];
  
  const queryClient = useQueryClient();
  const [newCommentText, setNewCommentText] = useState('');

  // 1. Load Comments with React Query
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postService.getComments(postId),
    enabled: visible && !!postId
  });

  // 2. Add Comment Mutation
  const addCommentMutation = useMutation({
    mutationFn: (content) => {
      if (!currentUser) throw new Error("Vous devez être connecté.");
      return postService.addComment(postId, currentUser.id, content);
    },
    onSuccess: () => {
      // Invalidate comments list
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      // Invalidate posts feed to increment comment count immediately
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setNewCommentText('');
    }
  });

  const handleSubmitComment = () => {
    if (newCommentText.trim() === '') return;
    addCommentMutation.mutate(newCommentText.trim());
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Image
        source={{ uri: item.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContentWrapper}>
        <View style={styles.commentHeader}>
          <Text style={[styles.commentUsername, { color: colors.text }]}>@{item.user?.username || 'user'}</Text>
          <Text style={[styles.commentTime, { color: colors.textMuted }]}>{formatRelativeTime(item.created_at)}</Text>
        </View>
        <Text style={[styles.commentText, { color: colors.text }]}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={[styles.sheetContainer, { backgroundColor: colors.card }]}>
          {/* Handle */}
          <View style={[styles.notch, { backgroundColor: colors.border }]} />

          {/* Title / Close bar */}
          <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>Commentaires</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close-circle" size={28} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={renderCommentItem}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>Aucun commentaire pour le moment.</Text>
                  <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Soyez le premier à donner votre avis !</Text>
                </View>
              }
            />
          )}

          {/* Form Input at the bottom */}
          {currentUser ? (
            <View style={[styles.inputContainer, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
              <Image source={{ uri: currentUser.avatar }} style={styles.inputAvatar} />
              <TextInput
                placeholder="Ajouter un commentaire..."
                placeholderTextColor={colors.textMuted}
                style={[styles.inputField, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                value={newCommentText}
                onChangeText={setNewCommentText}
                multiline
              />
              <TouchableOpacity
                onPress={handleSubmitComment}
                disabled={newCommentText.trim() === '' || addCommentMutation.isPending}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: newCommentText.trim() === '' ? colors.border : colors.primary
                  }
                ]}
              >
                {addCommentMutation.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.loginPrompt, { borderTopColor: colors.border }]}>
              <Text style={{ color: colors.textMuted }}>Connectez-vous pour ajouter un commentaire.</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: '75%',
    width: '100%',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  notch: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContentWrapper: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUsername: {
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 8,
  },
  commentTime: {
    fontSize: 11,
  },
  commentText: {
    fontSize: 13.5,
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  inputAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13.5,
    maxHeight: 80,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  loginPrompt: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
  },
});
