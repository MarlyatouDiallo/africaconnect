// screens/Upload/CreatePostScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/zustand/useStore';
import { THEME, CATEGORIES } from '../../utils/constants';
import { usePosts } from '../../hooks/usePosts';

const { width } = Dimensions.get('window');

export default function CreatePostScreen({ navigation }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];

  const { createPost } = usePosts();

  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('nature');
  const [privacy, setPrivacy] = useState('public');
  const [isUploading, setIsUploading] = useState(false);
  const [compressionLogs, setCompressionLogs] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setCompressionLogs(null);

    try {
      // Create post (automatically runs image compression inside!)
      const result = await createPost({
        description,
        category,
        imageUri: selectedImage,
        privacy
      });

      // Present the compression logs to demonstrate the Intelligent Compression feature!
      setCompressionLogs(result.compression);

      setTimeout(() => {
        setIsUploading(false);
        setCompressionLogs(null);
        setDescription('');
        // Navigate back to main Feed screen
        navigation.navigate('Feed');
      }, 3500); // Let the logs display for 3.5 seconds so the user can admire them!

    } catch (e) {
      setIsUploading(false);
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Créer un Post</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Partagez vos photos d'Afrique avec notre communauté
            </Text>
          </View>
        </View>

        {/* Selected Image Preview / Picker */}
        <TouchableOpacity 
          style={[styles.previewContainer, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          ) : (
            <View style={styles.emptyImagePlaceholder}>
              <Ionicons name="images-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
                Toucher pour choisir une photo
              </Text>
            </View>
          )}
          {selectedImage && (
            <View style={[styles.categoryOverlay, { backgroundColor: colors.secondary }]}>
              <Text style={styles.categoryOverlayText}>{category.toUpperCase()}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Categories Selection */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sélectionnez la catégorie</Text>
        <View style={styles.categoriesContainer}>
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
            const isActive = category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.8}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isActive ? colors.primary : colors.card,
                    borderColor: isActive ? colors.primary : colors.border
                  }
                ]}
              >
                <Text style={[styles.categoryText, { color: isActive ? '#fff' : colors.text }]}>
                  {cat.name.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Privacy Selection */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 10 }]}>Visibilité</Text>
        <View style={styles.privacyContainer}>
          <TouchableOpacity
            style={[
              styles.privacyChip,
              {
                backgroundColor: privacy === 'public' ? colors.primary : colors.card,
                borderColor: privacy === 'public' ? colors.primary : colors.border
              }
            ]}
            onPress={() => setPrivacy('public')}
            activeOpacity={0.8}
          >
            <Ionicons name="earth" size={16} color={privacy === 'public' ? '#fff' : colors.text} style={{marginRight: 6}} />
            <Text style={[styles.privacyText, { color: privacy === 'public' ? '#fff' : colors.text }]}>Public</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.privacyChip,
              {
                backgroundColor: privacy === 'private' ? colors.primary : colors.card,
                borderColor: privacy === 'private' ? colors.primary : colors.border
              }
            ]}
            onPress={() => setPrivacy('private')}
            activeOpacity={0.8}
          >
            <Ionicons name="people" size={16} color={privacy === 'private' ? '#fff' : colors.text} style={{marginRight: 6}} />
            <Text style={[styles.privacyText, { color: privacy === 'private' ? '#fff' : colors.text }]}>Amis uniquement</Text>
          </TouchableOpacity>
        </View>

        {/* Description Input Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Description</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <TextInput
              placeholder="Ex: Superbe robe Wax dessinée à Conakry #mode #wax #africa..."
              placeholderTextColor={colors.textMuted}
              style={[styles.inputField, { color: colors.text }]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleCreatePost}
            disabled={isUploading}
          >
            <Ionicons name="cloud-upload-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.submitText}>Publier la photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Uploading & Compression Log overlay */}
      {isUploading && (
        <View style={[styles.overlayContainer, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
          <View style={[styles.overlayCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {!compressionLogs ? (
              <View style={styles.overlayCentered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.overlayTitle, { color: colors.text }]}>Compression intelligente...</Text>
                <Text style={[styles.overlaySubtitle, { color: colors.textMuted }]}>
                  Optimisation de la photo pour réduire la consommation mobile
                </Text>
              </View>
            ) : (
              <View style={styles.overlayLogged}>
                <View style={[styles.successIconWrapper, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="checkmark-sharp" size={24} color="#fff" />
                </View>
                
                <Text style={[styles.overlayTitle, { color: colors.text }]}>Image Optimisée !</Text>
                
                <View style={[styles.logTable, { borderColor: colors.border }]}>
                  <View style={[styles.logRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.logLabel, { color: colors.textMuted }]}>Taille originale</Text>
                    <Text style={[styles.logValue, { color: colors.text }]}>{compressionLogs.originalSize}</Text>
                  </View>
                  <View style={[styles.logRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.logLabel, { color: colors.textMuted }]}>Taille compressée</Text>
                    <Text style={[styles.logValue, { color: colors.text }]}>{compressionLogs.compressedSize}</Text>
                  </View>
                  <View style={styles.logRow}>
                    <Text style={[styles.logLabel, { color: colors.textMuted }]}>Gain</Text>
                    <Text style={[styles.logValue, { color: colors.secondary, fontWeight: 'bold' }]}>{compressionLogs.ratio}</Text>
                  </View>
                </View>

                <Text style={[styles.overlaySubtext, { color: colors.textMuted }]}>
                  Mise en cache effectuée. Upload cloud en cours...
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 11.5,
    marginTop: 4,
  },
  previewContainer: {
    height: 220,
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryOverlayText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  galleryScroll: {
    paddingBottom: 16,
    gap: 8,
  },
  galleryCard: {
    width: 100,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 6,
  },
  galleryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  galleryBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  privacyContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  privacyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
  },
  privacyText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    height: 100,
  },
  inputField: {
    flex: 1,
    fontSize: 13.5,
    textAlignVertical: 'top',
    height: '100%',
  },
  submitButton: {
    flexDirection: 'row',
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100,
  },
  overlayCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  overlayCentered: {
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  overlaySubtitle: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  overlayLogged: {
    alignItems: 'center',
    width: '100%',
  },
  successIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logTable: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 16,
    overflow: 'hidden',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
  },
  logLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  logValue: {
    fontSize: 12,
  },
  overlaySubtext: {
    fontSize: 11,
    marginTop: 4,
  },
});
