import React, { useEffect, Component } from 'react';
import { StyleSheet, View, Text, Platform, Dimensions, ScrollView } from 'react-native';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
          <Text style={{ color: 'red', fontSize: 18, fontWeight: 'bold' }}>Uncaught React Error:</Text>
          <Text style={{ color: 'black', marginTop: 10 }}>{this.state.error?.message || 'Unknown error'}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from './store/zustand/useStore';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { THEME } from './utils/constants';

const queryClient = new QueryClient();

function MainApp() {
  const user = useStore(state => state.user);
  const themeMode = useStore(state => state.theme);
  const colors = THEME[themeMode] || THEME.dark;

  const renderAppContent = () => (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );

  if (Platform.OS === 'web') {
    return (
      <QueryClientProvider client={queryClient}>
        <ScrollView contentContainerStyle={[styles.webWebBackground, { backgroundColor: themeMode === 'light' ? 'hsl(40, 20%, 94%)' : 'hsl(24, 15%, 5%)' }]}>
          <View style={[styles.glowCircle1, { backgroundColor: colors.primary }]} />
          <View style={[styles.glowCircle2, { backgroundColor: colors.secondary }]} />

          <View style={[styles.phoneShell, { backgroundColor: colors.background }]}>
            {/* Dynamic Island iPhone 16 */}
            <View style={styles.dynamicIsland}>
              <View style={styles.cameraLens} />
              <View style={styles.sensorDot} />
            </View>
            
            <View style={styles.screenWrapper}>
              {renderAppContent()}
            </View>

            {/* Home Indicator */}
            <View style={[styles.homeIndicator, { backgroundColor: themeMode === 'light' ? '#000' : '#fff' }]} />
          </View>
        </ScrollView>
      </QueryClientProvider>
    );
  }

  // Full-bleed rendering on actual mobile devices / simulators
  return (
    <QueryClientProvider client={queryClient}>
      {renderAppContent()}
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webWebBackground: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: Dimensions.get('window').height,
  },
  glowCircle1: {
    position: 'absolute',
    top: '10%',
    left: '20%',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.12,
  },
  glowCircle2: {
    position: 'absolute',
    bottom: '15%',
    right: '25%',
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.1,
  },
  phoneShell: {
    width: 393,
    height: 852, // Exact iPhone 16 Pro logical height
    borderRadius: 55, // Closer to iPhone 16 curves
    borderWidth: 12,
    borderColor: '#1c1c1e', // Dark Titanium edge
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
    zIndex: 10,
    marginVertical: 40, // Add margin in case of scrolling
  },
  dynamicIsland: {
    position: 'absolute',
    top: 11,
    alignSelf: 'center',
    width: 120,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#000',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  cameraLens: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#222',
    marginRight: 6,
  },
  sensorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 135,
    height: 5,
    borderRadius: 3,
    zIndex: 100,
  },
  screenWrapper: {
    flex: 1,
  },
});
