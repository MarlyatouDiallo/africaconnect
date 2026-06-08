// screens/Upload/CreateStoryScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useStore } from '../../store/zustand/useStore';
import { THEME } from '../../utils/constants';
import { usePosts } from '../../hooks/usePosts';

const BG_COLORS = [
  '#FF5722', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
  '#2196F3', '#009688', '#4CAF50', '#FF9800', '#000000'
];

export default function CreateStoryScreen({ navigation }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];
  
  const { createStory } = usePosts();
  
  const [mode, setMode] = useState('text'); // 'text' or 'image'
  const [textContent, setTextContent] = useState('');
  const [bgColor, setBgColor] = useState(BG_COLORS[0]);
  const [imageUri, setImageUri] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setMode('image');
      }
    } catch (e) {
      console.error('Error picking story image:', e);
      alert('Erreur lors de la sélection de l\'image.');
    }
  };

  const handlePublish = async () => {
    if (mode === 'text' && !textContent.trim()) {
      alert('Veuillez écrire un statut.');
      return;
    }
    if (mode === 'image' && !imageUri) {
      alert('Veuillez sélectionner une image.');
      return;
    }

    setIsPublishing(true);
    try {
      if (mode === 'text') {
        await createStory({ textContent: textContent.trim(), bgColor });
      } else {
        await createStory({ imageUri });
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la publication du statut.');
    } finally {
      setIsPublishing(false);
    }
  };

  const cycleBgColor = () => {
    const currentIndex = BG_COLORS.indexOf(bgColor);
    const nextIndex = (currentIndex + 1) % BG_COLORS.length;
    setBgColor(BG_COLORS[nextIndex]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#000' }]}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            {mode === 'text' && (
              <TouchableOpacity onPress={cycleBgColor} style={styles.headerBtn}>
                <Ionicons name="color-palette" size={26} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handlePickImage} style={styles.headerBtn}>
              <Ionicons name="image" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Area */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.contentArea, mode === 'text' && { backgroundColor: bgColor }]}>
            {mode === 'text' ? (
              <TextInput
                style={styles.textInput}
                placeholder="Tapez un statut"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={textContent}
                onChangeText={setTextContent}
                multiline
                maxLength={300}
                textAlign="center"
                autoFocus
              />
            ) : (
              imageUri && (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              )
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* Footer */}
        <View style={styles.footer}>
          {mode === 'image' && (
            <TouchableOpacity onPress={() => { setMode('text'); setImageUri(null); }} style={styles.switchModeBtn}>
              <Ionicons name="text" size={24} color="#fff" />
              <Text style={styles.switchModeText}>Texte</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.publishBtn, (isPublishing || (mode === 'text' && !textContent.trim())) && { opacity: 0.5 }]} 
            onPress={handlePublish}
            disabled={isPublishing || (mode === 'text' && !textContent.trim())}
          >
            {isPublishing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" style={{ marginLeft: 4 }} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    marginLeft: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    width: '80%',
    maxHeight: '70%',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  publishBtn: {
    backgroundColor: THEME.dark.primary, // Using primary color directly for action
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    position: 'absolute',
    left: 16,
    bottom: 24,
  },
  switchModeText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  }
});
