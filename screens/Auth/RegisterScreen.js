// screens/Auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../store/zustand/useStore';
import { THEME } from '../../utils/constants';
import { validateEmail, validateUsername, validatePassword } from '../../utils/validators';

export default function RegisterScreen({ navigation }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];

  const { register, loading, error: authError } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState('');

  const handleRegister = async () => {
    setInputError('');

    const usernameValidation = validateUsername(username);
    if (usernameValidation) {
      setInputError(usernameValidation);
      return;
    }

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setInputError(emailValidation);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setInputError(passwordValidation);
      return;
    }

    try {
      // Sign up, which will auto-login in mock or require email confirmation in Supabase real (with appropriate message!)
      await register(username.trim().toLowerCase(), email.trim(), password, '', bio.trim());
    } catch (e) {
      // Handled by hook
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: colors.text }]}>Créer un Compte</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Rejoignez la communauté AfricaConnect dès aujourd'hui
          </Text>
        </View>

        {/* Card Form */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Error display */}
          {(inputError !== '' || authError) && (
            <View style={styles.errorAlert}>
              <Ionicons name="alert-circle" size={16} color="#D32F2F" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{inputError || authError}</Text>
            </View>
          )}

          {/* Username */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Nom d'utilisateur</Text>
            <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} style={styles.fieldIcon} />
              <TextInput
                placeholder="Ex: marly_diallo"
                placeholderTextColor={colors.textMuted}
                style={[styles.inputField, { color: colors.text }]}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Adresse e-mail</Text>
            <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.fieldIcon} />
              <TextInput
                placeholder="Ex: diallo@universite.gn"
                placeholderTextColor={colors.textMuted}
                style={[styles.inputField, { color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Mot de passe</Text>
            <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.fieldIcon} />
              <TextInput
                placeholder="Minimum 6 caractères"
                placeholderTextColor={colors.textMuted}
                style={[styles.inputField, { color: colors.text }]}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Biography (Optional) */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Biographie (Optionnel)</Text>
            <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.background, height: 70 }]}>
              <Ionicons name="create-outline" size={18} color={colors.textMuted} style={[styles.fieldIcon, { marginTop: 10, alignSelf: 'flex-start' }]} />
              <TextInput
                placeholder="Parlez-nous un peu de vous..."
                placeholderTextColor={colors.textMuted}
                style={[styles.inputField, { color: colors.text, height: '100%', textAlignVertical: 'top', paddingTop: 10 }]}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Créer un compte</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Déjà inscrit ?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
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
  eyeIcon: {
    padding: 6,
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 13,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
