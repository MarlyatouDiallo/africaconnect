// screens/Auth/ForgotPassword.js
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
import { validateEmail } from '../../utils/validators';

export default function ForgotPassword({ navigation }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];

  const { resetPassword, loading, error: authError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [inputError, setInputError] = useState('');

  const handleReset = async () => {
    setInputError('');
    setSuccessMsg('');

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setInputError(emailValidation);
      return;
    }

    try {
      await resetPassword(email);
      setSuccessMsg("Un e-mail de réinitialisation de mot de passe a été envoyé avec succès à votre adresse !");
      setEmail('');
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
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Top Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: colors.text }]}>Mot de passe oublié</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Entrez votre adresse e-mail pour recevoir un lien de réinitialisation sécurisé
          </Text>
        </View>

        {/* Form Box */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Error alerts */}
          {(inputError !== '' || authError) && (
            <View style={styles.errorAlert}>
              <Ionicons name="alert-circle" size={16} color="#D32F2F" style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{inputError || authError}</Text>
            </View>
          )}

          {/* Success message */}
          {successMsg !== '' && (
            <View style={styles.successAlert}>
              <Ionicons name="checkmark-circle" size={16} color="#2E7D32" style={{ marginRight: 6 }} />
              <Text style={styles.successText}>{successMsg}</Text>
            </View>
          )}

          {/* Email input */}
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Votre adresse e-mail</Text>
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

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Envoyer le lien</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Back Link */}
        <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.loginLink, { color: colors.primary }]}>Retour à la connexion</Text>
        </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
    borderRadius: 12,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12.5,
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
  successAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    padding: 12,
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
  submitButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
    alignItems: 'center',
    marginTop: 32,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
