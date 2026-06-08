// navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/zustand/useStore';
import { THEME } from '../utils/constants';

// Screens
import FeedScreen from '../screens/Home/FeedScreen';
import FriendsScreen from '../screens/Home/FriendsScreen';
import NotificationsScreen from '../screens/Home/NotificationsScreen';
import CreatePostScreen from '../screens/Upload/CreatePostScreen';
import CreateStoryScreen from '../screens/Upload/CreateStoryScreen';
import FavoritesScreen from '../screens/Home/FavoritesScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

import CustomTabBar from '../components/BottomTabs';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const MainStack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Favorites" component={FavoritesScreen} />
    </ProfileStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <MainStack.Screen name="MainTabs" component={TabNavigator} />
      <MainStack.Screen name="CreatePost" component={CreatePostScreen} />
      <MainStack.Screen name="CreateStory" component={CreateStoryScreen} />
    </MainStack.Navigator>
  );
}
