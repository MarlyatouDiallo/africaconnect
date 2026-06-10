// screens/Profile/EditProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/zustand/useStore';
import { THEME } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';

export default function EditProfileScreen({ navigation }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];

  const { user, updateProfile, loading, error: authError } = useAuth();
  const { createPost } = usePosts();

  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [successMsg, setSuccessMsg] = useState('');
  const [inputError, setInputError] = useState('');

  const handleChooseAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setInputError('');
    setSuccessMsg('');

    if (username.trim().length < 3) {
      setInputError("Le nom d'utilisateur doit contenir au moins 3 caractères.");
      return;
    }

    try {
      await updateProfile(username.trim().toLowerCase(), bio.trim(), avatar);
      
      // If the avatar was changed, create a post automatically
      if (avatar !== user?.avatar) {
        try {
          await createPost({
            description: `J'ai mis à jour ma photo de profil ! 📸✨`,
            category: 'portrait',
            imageUri: avatar,
            privacy: 'public'
          });
        } catch (postError) {
          console.error("Erreur lors de la création du post de profil:", postError);
        }
      }

      setSuccessMsg("Votre profil a été mis à jour avec succès !");
      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    } catch (e) {
      // Error handled by hook
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Modifier le Profil</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Avatar Edit */}
          <View style={styles.avatarSection}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleChooseAvatar} style={styles.avatarWrapper}>
              <Image source={{ uri: avatar }} style={[styles.avatar, { borderColor: colors.border }]} />
              <View style={[styles.avatarCameraBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.avatarHint, { color: colors.textMuted }]}>
              Cliquez pour changer la photo de profil (Simulé)
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Input error alert */}
            {(inputError !== '' || authError) && (
              <View style={styles.errorAlert}>
                <Ionicons name="alert-circle" size={16} color="#D32F2F" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{inputError || authError}</Text>
              </View>
            )}

            {/* Success alert */}
            {successMsg !== '' && (
              <View style={styles.successAlert}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" style={{ marginRight: 6 }} />
                <Text style={styles.successText}>{successMsg}</Text>
              </View>
            )}

            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Nom d'utilisateur</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Ionicons name="person-outline" size={18} color={colors.textMuted} style={styles.fieldIcon} />
                <TextInput
                  placeholder="Nom d'utilisateur"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.inputField, { color: colors.text }]}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Bio Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Ma biographie</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background, height: 80 }]}>
                <Ionicons name="document-text-outline" size={18} color={colors.textMuted} style={[styles.fieldIcon, { marginTop: 10, alignSelf: 'flex-start' }]} />
                <TextInput
                  placeholder="Écrivez quelque chose sur vous..."
                  placeholderTextColor={colors.textMuted}
                  style={[styles.inputField, { color: colors.text, height: '100%', textAlignVertical: 'top', paddingTop: 10 }]}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarHint: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  successAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  fieldIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
