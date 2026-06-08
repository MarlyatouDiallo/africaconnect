// components/SearchBar.js
import React from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/zustand/useStore';
import { THEME, CATEGORIES } from '../utils/constants';

export default function SearchBar({ searchQuery, onChangeSearch, activeCategory, onSelectCategory }) {
  const themeMode = useStore((state) => state.theme);
  const colors = THEME[themeMode];

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Rechercher des utilisateurs, photos, mots-clés..."
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
          value={searchQuery}
          onChangeText={onChangeSearch}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => onChangeSearch('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          
          let categoryIconName;
          if (cat.id === 'all') categoryIconName = 'grid-outline';
          else if (cat.id === 'voyage') categoryIconName = 'compass-outline';
          else if (cat.id === 'cuisine') categoryIconName = 'restaurant-outline';
          else if (cat.id === 'mode') categoryIconName = 'shirt-outline';
          else if (cat.id === 'art') categoryIconName = 'color-palette-outline';
          else if (cat.id === 'tech') categoryIconName = 'hardware-chip-outline';

          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.8}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.card,
                  borderColor: isActive ? colors.primary : colors.border
                }
              ]}
            >
              <Ionicons
                name={categoryIconName}
                size={14}
                color={isActive ? '#fff' : colors.text}
                style={styles.chipIcon}
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: isActive ? '#fff' : colors.text,
                    fontWeight: isActive ? 'bold' : '500'
                  }
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    padding: 0, // Reset default padding
  },
  clearButton: {
    padding: 4,
  },
  categoriesScroll: {
    paddingVertical: 10,
    alignItems: 'center',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 6,
  },
  chipIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12.5,
  },
});
