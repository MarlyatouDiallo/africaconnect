// components/BottomTabs.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/zustand/useStore';
import { THEME } from '../utils/constants';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];

  return (
    <View style={[styles.tabBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        let iconName;
        let tabLabel;
        let size = 22;

        if (route.name === 'Feed') {
          iconName = isFocused ? 'home' : 'home-outline';
          tabLabel = 'Accueil';
        } else if (route.name === 'Friends') {
          iconName = isFocused ? 'people' : 'people-outline';
          tabLabel = 'Amis';
        } else if (route.name === 'Notifications') {
          iconName = isFocused ? 'notifications' : 'notifications-outline';
          tabLabel = 'Notifications';
        } else if (route.name === 'ProfileTab') {
          iconName = isFocused ? 'person' : 'person-outline';
          tabLabel = 'Profil';
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName}
              size={size}
              color={isFocused ? colors.primary : colors.textMuted}
            />
            <Text 
              style={{ 
                fontSize: 10, 
                marginTop: 4, 
                color: isFocused ? colors.primary : colors.textMuted,
                fontWeight: isFocused ? 'bold' : 'normal'
              }}
            >
              {tabLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
