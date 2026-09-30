// src/components/tcg/SavedBinders.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser, SavedBinder, BINDER_COLORS } from '../../contexts/UserContext';

const { width } = Dimensions.get('window');

interface SavedBindersProps {
  onSelectBinder?: (binder: SavedBinder) => void;
}

const SavedBinders: React.FC<SavedBindersProps> = ({ onSelectBinder }) => {
  const { user, deleteBinder } = useUser();
  const [selectedSortBy, setSelectedSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [selectedFilterBy, setSelectedFilterBy] = useState<'all' | 'color' | 'tags'>('all');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const savedBinders = user?.savedBinders || [];

  // Get unique tags from all binders
  const uniqueTags = Array.from(
    new Set(savedBinders.flatMap(binder => binder.tags))
  ).sort();

  // Filter binders based on current filters
  const getFilteredBinders = () => {
    let filtered = [...savedBinders];

    if (selectedFilterBy === 'color' && selectedColor) {
      filtered = filtered.filter(binder => binder.color === selectedColor);
    }

    if (selectedFilterBy === 'tags' && selectedTag) {
      filtered = filtered.filter(binder => binder.tags.includes(selectedTag));
    }

    return filtered;
  };

  // Sort binders based on current sort option
  const getSortedBinders = () => {
    const filtered = getFilteredBinders();

    return filtered.sort((a, b) => {
      switch (selectedSortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'size':
          return b.cards.length - a.cards.length;
        default:
          return 0;
      }
    });
  };

  const handleDeleteBinder = (binder: SavedBinder) => {
    Alert.alert(
      'Delete Binder',
      `Are you sure you want to delete "${binder.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBinder(binder.id),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getBinderColorInfo = (colorId: string) => {
    return BINDER_COLORS.find(c => c.id === colorId) || BINDER_COLORS[0];
  };

  const getBinderStats = (binder: SavedBinder) => {
    const totalSlots = {
      '2x2': 4,
      '3x3': 9,
      '4x3': 12,
      '4x4': 16,
      '5x5': 25,
    }[binder.gridSize] || 9;

    const fillPercentage = Math.round((binder.cards.length / totalSlots) * 100);

    return {
      totalSlots,
      fillPercentage,
      filledSlots: binder.cards.length,
    };
  };

  const renderSortAndFilter = () => (
    <View style={styles.controlsContainer}>
      {/* Sort Options */}
      <View style={styles.controlSection}>
        <Text style={styles.controlLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortContainer}>
          {[
            { id: 'date', label: 'Recent', icon: 'access-time' },
            { id: 'name', label: 'Name', icon: 'sort-by-alpha' },
            { id: 'size', label: 'Cards', icon: 'view-module' },
          ].map(sort => (
            <TouchableOpacity
              key={sort.id}
              style={[
                styles.sortButton,
                selectedSortBy === sort.id && styles.activeSortButton,
              ]}
              onPress={() => setSelectedSortBy(sort.id as any)}
            >
              <MaterialIcons
                name={sort.icon as any}
                size={16}
                color={selectedSortBy === sort.id ? 'white' : '#666'}
              />
              <Text
                style={[
                  styles.sortButtonText,
                  selectedSortBy === sort.id && styles.activeSortButtonText,
                ]}
              >
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter Options */}
      <View style={styles.controlSection}>
        <Text style={styles.controlLabel}>Filter by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilterBy === 'all' && styles.activeFilterButton,
            ]}
            onPress={() => {
              setSelectedFilterBy('all');
              setSelectedColor('');
              setSelectedTag('');
            }}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilterBy === 'all' && styles.activeFilterButtonText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilterBy === 'color' && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilterBy('color')}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilterBy === 'color' && styles.activeFilterButtonText,
              ]}
            >
              Color
            </Text>
          </TouchableOpacity>

          {uniqueTags.length > 0 && (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilterBy === 'tags' && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedFilterBy('tags')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilterBy === 'tags' && styles.activeFilterButtonText,
                ]}
              >
                Tags
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Color Filter */}
      {selectedFilterBy === 'color' && (
        <View style={styles.controlSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorFilterContainer}>
            {BINDER_COLORS.map(color => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.colorFilterOption,
                  { backgroundColor: color.color },
                  selectedColor === color.id && styles.selectedColorFilter,
                ]}
                onPress={() => setSelectedColor(selectedColor === color.id ? '' : color.id)}
              >
                {selectedColor === color.id && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tag Filter */}
      {selectedFilterBy === 'tags' && uniqueTags.length > 0 && (
        <View style={styles.controlSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagFilterContainer}>
            {uniqueTags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagFilterOption,
                  selectedTag === tag && styles.selectedTagFilter,
                ]}
                onPress={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              >
                <Text
                  style={[
                    styles.tagFilterText,
                    selectedTag === tag && styles.selectedTagFilterText,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderBinderCard = ({ item: binder }: { item: SavedBinder }) => {
    const colorInfo = getBinderColorInfo(binder.color);
    const stats = getBinderStats(binder);

    return (
      <TouchableOpacity
        style={styles.binderCard}
        onPress={() => onSelectBinder?.(binder)}
        onLongPress={() => handleDeleteBinder(binder)}
      >
        {/* Header with color indicator */}
        <View style={[styles.binderHeader, { backgroundColor: colorInfo.color }]}>
          <View style={styles.binderTitleContainer}>
            <Text style={styles.binderTitle} numberOfLines={1}>
              {binder.name}
            </Text>
            <Text style={styles.binderGridSize}>{binder.gridSize}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteBinder(binder)}
          >
            <MaterialIcons name="delete" size={20} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.binderStats}>
          <View style={styles.statRow}>
            <MaterialIcons name="view-module" size={16} color="#666" />
            <Text style={styles.statText}>
              {stats.filledSlots}/{stats.totalSlots} cards ({stats.fillPercentage}%)
            </Text>
          </View>

          <View style={styles.statRow}>
            <MaterialIcons name="schedule" size={16} color="#666" />
            <Text style={styles.statText}>
              Updated {formatDate(binder.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Tags */}
        {binder.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {binder.tags.slice(0, 3).map((tag, index) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colorInfo.color + '20' }]}>
                <Text style={[styles.tagText, { color: colorInfo.color }]}>{tag}</Text>
              </View>
            ))}
            {binder.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{binder.tags.length - 3}</Text>
            )}
          </View>
        )}

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${stats.fillPercentage}%`, backgroundColor: colorInfo.color },
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="folder-open" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Saved Binders</Text>
      <Text style={styles.emptyStateText}>
        Create your first binder to start organizing your card collection!
      </Text>
    </View>
  );

  const sortedBinders = getSortedBinders();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Binders ({savedBinders.length})</Text>
        {sortedBinders.length !== savedBinders.length && (
          <Text style={styles.filterInfo}>
            Showing {sortedBinders.length} of {savedBinders.length}
          </Text>
        )}
      </View>

      {savedBinders.length > 0 && renderSortAndFilter()}

      <FlatList
        data={sortedBinders}
        renderItem={renderBinderCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.bindersList}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  filterInfo: {
    fontSize: 14,
    color: '#666',
  },
  controlsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  controlSection: {
    marginBottom: 15,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  sortContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeSortButton: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeSortButtonText: {
    color: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterButton: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  colorFilterContainer: {
    flexDirection: 'row',
    paddingTop: 4,
  },
  colorFilterOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorFilter: {
    borderColor: '#333',
  },
  tagFilterContainer: {
    flexDirection: 'row',
    paddingTop: 4,
  },
  tagFilterOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTagFilter: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
  tagFilterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedTagFilterText: {
    color: 'white',
  },
  bindersList: {
    padding: 15,
    paddingBottom: 30,
  },
  binderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  binderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  binderTitleContainer: {
    flex: 1,
  },
  binderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  binderGridSize: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  binderStats: {
    padding: 16,
    paddingTop: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  },
});

export default SavedBinders;