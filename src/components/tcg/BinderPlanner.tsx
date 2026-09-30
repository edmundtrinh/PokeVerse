// src/components/tcg/BinderPlanner.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { searchCards, TCGCard, getFeaturedCards, getRecentSets, getCardsBySet, TCGSet } from '../../api/tcgApi';
import HoloCard from './HoloCard';
import { useUser, SavedBinder, BINDER_COLORS, SUGGESTED_TAGS } from '../../contexts/UserContext';

type GridSize = '2x2' | '3x3' | '4x3' | '4x4' | '5x5';

interface BinderCard {
  card: TCGCard | null;
  id: string;
  position: number;
  page: number;
}

const BinderPlanner: React.FC = () => {
  const { saveBinder, user } = useUser();
  const [gridSize, setGridSize] = useState<GridSize>('3x3');
  const [binderCards, setBinderCards] = useState<BinderCard[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(100); // Standard binder has ~100 pages
  const [availableCards, setAvailableCards] = useState<TCGCard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<TCGCard | null>(null);
  const [recentSets, setRecentSets] = useState<TCGSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCardPicker, setShowCardPicker] = useState<boolean>(false);
  const [selectedSlotPosition, setSelectedSlotPosition] = useState<number | null>(null);
  const [cardPickerLoading, setCardPickerLoading] = useState<boolean>(false);
  const [binderName, setBinderName] = useState<string>('My Binder');
  const [binderColor, setBinderColor] = useState<string>('red');
  const [binderTags, setBinderTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);

  const { width } = Dimensions.get('window');

  // Grid configurations
  const gridConfigs = {
    '2x2': { cols: 2, rows: 2, total: 4, name: '2×2' },
    '3x3': { cols: 3, rows: 3, total: 9, name: '3×3' },
    '4x3': { cols: 4, rows: 3, total: 12, name: '12-Pocket' },
    '4x4': { cols: 4, rows: 4, total: 16, name: '4×4' },
    '5x5': { cols: 5, rows: 5, total: 25, name: '5×5' },
  };

  const currentConfig = gridConfigs[gridSize];
  const cardWidth = (width - 60) / currentConfig.cols - 10; // Account for padding and margins

  // Initialize empty binder based on grid size and current page
  useEffect(() => {
    const emptyCards: BinderCard[] = Array.from({ length: currentConfig.total }, (_, index) => ({
      card: null,
      id: `page-${currentPage}-slot-${index}`,
      position: index,
      page: currentPage,
    }));
    setBinderCards(emptyCards);
  }, [gridSize, currentPage]);

  // Get cards for current page
  const getCurrentPageCards = () => {
    return binderCards.filter(card => card.page === currentPage);
  };

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Load recent sets and featured cards
  useEffect(() => {
    loadRecentSetsAndCards();
  }, []);

  const loadRecentSetsAndCards = async () => {
    setLoading(true);
    try {
      console.log('Loading cards...');

      // Try simple search first
      const popularCards = await searchCards('pikachu');
      console.log('Popular cards loaded:', popularCards.length);

      if (popularCards.length > 0) {
        setAvailableCards(popularCards.slice(0, 20));
      } else {
        // Use mock data if API fails
        setAvailableCards(getMockCards());
      }

      // Try to load recent sets (non-blocking)
      try {
        const sets = await getRecentSets();
        setRecentSets(sets.slice(0, 10));
        console.log('Recent sets loaded:', sets.length);
      } catch (setError) {
        console.log('Recent sets failed, using mock sets');
        setRecentSets([]);
      }

    } catch (error) {
      console.error('Error loading cards:', error);
      // Use mock data as final fallback
      setAvailableCards(getMockCards());
    } finally {
      setLoading(false);
    }
  };

  // Mock cards for testing when API is down
  const getMockCards = (): TCGCard[] => {
    return [
      {
        id: 'mock-1',
        name: 'Pikachu',
        supertype: 'Pokémon',
        subtypes: ['Basic'],
        rarity: 'Common',
        artist: 'Test Artist',
        number: '1',
        set: {
          id: 'mock-set',
          name: 'Mock Set',
          series: 'Mock Series',
          printedTotal: 100,
          total: 100,
          legalities: { unlimited: 'Legal' },
          releaseDate: '2024-01-01',
          updatedAt: '2024-01-01',
          images: {
            symbol: '',
            logo: ''
          }
        },
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/base1/25.png',
          large: 'https://images.pokemontcg.io/base1/25_hires.png'
        },
        hiResImage: 'https://images.pokemontcg.io/base1/25_hires.png'
      },
      {
        id: 'mock-2',
        name: 'Charizard',
        supertype: 'Pokémon',
        subtypes: ['Stage 2'],
        rarity: 'Rare Holo',
        artist: 'Test Artist',
        number: '6',
        set: {
          id: 'mock-set',
          name: 'Mock Set',
          series: 'Mock Series',
          printedTotal: 100,
          total: 100,
          legalities: { unlimited: 'Legal' },
          releaseDate: '2024-01-01',
          updatedAt: '2024-01-01',
          images: {
            symbol: '',
            logo: ''
          }
        },
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/base1/4.png',
          large: 'https://images.pokemontcg.io/base1/4_hires.png'
        },
        hiResImage: 'https://images.pokemontcg.io/base1/4_hires.png'
      },
      {
        id: 'mock-3',
        name: 'Blastoise',
        supertype: 'Pokémon',
        subtypes: ['Stage 2'],
        rarity: 'Rare Holo',
        artist: 'Test Artist',
        number: '2',
        set: {
          id: 'mock-set',
          name: 'Mock Set',
          series: 'Mock Series',
          printedTotal: 100,
          total: 100,
          legalities: { unlimited: 'Legal' },
          releaseDate: '2024-01-01',
          updatedAt: '2024-01-01',
          images: {
            symbol: '',
            logo: ''
          }
        },
        legalities: { unlimited: 'Legal' },
        images: {
          small: 'https://images.pokemontcg.io/base1/2.png',
          large: 'https://images.pokemontcg.io/base1/2_hires.png'
        },
        hiResImage: 'https://images.pokemontcg.io/base1/2_hires.png'
      }
    ];
  };

  const loadCardsFromSet = async (setId: string) => {
    setLoading(true);
    setSelectedSet(setId);
    try {
      const cards = await getCardsBySet(setId);
      setAvailableCards(cards.slice(0, 30)); // Show more cards from specific set
      setSelectedCard(null); // Clear selection when switching sets
    } catch (error) {
      console.error(`Error loading cards from set ${setId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadRecentSetsAndCards();
      return;
    }

    setCardPickerLoading(true);
    console.log('Searching for:', query);

    try {
      // Make search case-insensitive by using lowercase
      const results = await searchCards(query.toLowerCase());
      console.log('Search results for', query, ':', results.length, 'cards found');

      if (results.length > 0) {
        console.log('First few results:', results.slice(0, 3).map(c => c.name));
      }

      setAvailableCards(results.slice(0, 30));
      setSelectedSet(null); // Clear set selection when searching
      setSelectedCard(null);
    } catch (error) {
      console.error('Error searching cards:', error);
      setAvailableCards([]);
    } finally {
      setCardPickerLoading(false);
    }
  };

  // Handle card selection from picker
  const handleCardSelection = (card: TCGCard) => {
    if (selectedSlotPosition !== null) {
      placeCardInSlot(selectedSlotPosition, card);
    }
  };

  // Load cards when picker opens
  const handleCardPickerOpen = async () => {
    if (availableCards.length === 0) {
      setCardPickerLoading(true);
      try {
        await loadRecentSetsAndCards();
      } finally {
        setCardPickerLoading(false);
      }
    }
  };

  // Card picker modal
  const renderCardPicker = () => {
    if (!showCardPicker) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.cardPickerModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Choose a card for slot {(selectedSlotPosition || 0) + 1}
            </Text>
            <TouchableOpacity
              testID='close-button'
              style={styles.closeButton}
              onPress={() => {
                setShowCardPicker(false);
                setSelectedSlotPosition(null);
              }}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalSearchContainer}>
            <MaterialIcons name="search" size={20} color="#666" />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search for cards..."
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <MaterialIcons name="clear" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.modalCardsContainer}>
            {cardPickerLoading ? (
              <View style={styles.modalLoadingContainer}>
                <Text style={styles.modalLoadingText}>Loading cards...</Text>
              </View>
            ) : availableCards.length > 0 ? (
              <FlatList
                data={availableCards}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerCard}
                    onPress={() => handleCardSelection(item)}
                  >
                    <View style={styles.pickerCardImage}>
                      <HoloCard card={item} style={{ width: 100, height: 140 }} />
                    </View>
                    <Text style={styles.pickerCardName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.pickerCardSet} numberOfLines={1}>
                      {item.set.name} • {item.number}/{item.set.total}
                    </Text>
                    <Text style={styles.pickerCardRarity}>
                      {item.rarity || 'Common'}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.modalCardsGrid}
              />
            ) : (
              <View style={styles.modalEmptyContainer}>
                <MaterialIcons name="search-off" size={48} color="#ccc" />
                <Text style={styles.modalEmptyText}>
                  {searchQuery ? `No cards found for "${searchQuery}"` : 'No cards available'}
                </Text>
                <Text style={styles.modalEmptySubtext}>
                  Try searching for popular Pokemon like "pikachu" or "charizard"
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Place card in empty slot
  const placeCardInSlot = (position: number, card: TCGCard) => {
    setBinderCards(prev => {
      const existingCard = prev.find(slot => slot.position === position && slot.page === currentPage);
      if (existingCard) {
        // Update existing slot
        return prev.map(slot =>
          slot.position === position && slot.page === currentPage
            ? { ...slot, card }
            : slot
        );
      } else {
        // Add new slot if it doesn't exist
        const newSlot: BinderCard = {
          card,
          id: `page-${currentPage}-slot-${position}`,
          position,
          page: currentPage,
        };
        return [...prev, newSlot];
      }
    });

    // Close modal and reset states
    setShowCardPicker(false);
    setSelectedSlotPosition(null);
    setSelectedCard(null);
    console.log(`Placed ${card.name} in slot ${position}`);
  };

  // Remove card from slot
  const removeCardFromSlot = (position: number) => {
    setBinderCards(prev =>
      prev.map(slot =>
        slot.position === position && slot.page === currentPage
          ? { ...slot, card: null }
          : slot
      )
    );
  };

  // Render grid slot
  const renderGridSlot = ({ item }: { item: BinderCard }) => (
    <TouchableOpacity
      style={[
        styles.gridSlot,
        { width: cardWidth, height: cardWidth * 1.4 }, // TCG card ratio
        item.card ? styles.filledSlot : styles.emptySlot,
      ]}
      onPress={() => {
        if (item.card) {
          removeCardFromSlot(item.position);
        } else {
          // Open card picker modal for empty slots
          setSelectedSlotPosition(item.position);
          setShowCardPicker(true);
          console.log('Opening card picker for slot:', item.position);
        }
      }}
    >
      {item.card ? (
        <View style={styles.cardContainer}>
          <HoloCard
            card={item.card}
            style={{ width: cardWidth * 0.9, height: cardWidth * 1.26 }}
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeCardFromSlot(item.position)}
          >
            <MaterialIcons name="close" size={16} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptySlotContent}>
          <MaterialIcons name="add" size={24} color="#ccc" />
          <Text style={styles.emptySlotText}>Empty</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render available card
  const renderAvailableCard = ({ item }: { item: TCGCard }) => (
    <TouchableOpacity
      style={[
        styles.availableCard,
        selectedCard?.id === item.id && styles.selectedCard,
      ]}
      onPress={() => setSelectedCard(item)}
    >
      <HoloCard
        card={item}
        style={{ width: 80, height: 112 }}
      />
      <Text style={styles.cardName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Save binder functionality
  const handleSaveBinder = async () => {
    if (!user || !binderName.trim()) {
      Alert.alert('Error', 'Please enter a name for your binder');
      return;
    }

    const cardsToSave = binderCards
      .filter(slot => slot.card)
      .map(slot => ({
        position: slot.position,
        cardId: slot.card!.id,
        cardName: slot.card!.name,
        rarity: slot.card!.rarity || 'Common',
        dateAdded: new Date().toISOString(),
      }));

    const binderToSave: SavedBinder = {
      id: Date.now().toString(),
      name: binderName.trim(),
      color: binderColor,
      tags: binderTags,
      gridSize,
      cards: cardsToSave,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveBinder(binderToSave);
      Alert.alert('Success', `Binder "${binderName}" has been saved!`);
      setShowSaveDialog(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save binder. Please try again.');
    }
  };

  const renderSaveDialog = () => {
    if (!showSaveDialog) return null;

    const filledSlots = binderCards.filter(slot => slot.card).length;
    const totalSlots = currentConfig.total;
    const selectedColorInfo = BINDER_COLORS.find(c => c.id === binderColor);

    return (
      <KeyboardAvoidingView
        style={styles.saveDialogOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.saveDialog}>
          <Text style={styles.saveDialogTitle}>Save Binder</Text>

          {/* Scrollable body; title and buttons stay pinned so Save/Cancel are always reachable */}
          <ScrollView
            testID="save-dialog-scroll"
            style={styles.saveDialogScroll}
            keyboardShouldPersistTaps="handled"
          >

          {/* Binder Name */}
          <View style={styles.saveDialogSection}>
            <Text style={styles.saveDialogLabel}>Binder Name</Text>
            <TextInput
              style={styles.saveDialogInput}
              value={binderName}
              onChangeText={setBinderName}
              placeholder="Enter binder name"
              maxLength={50}
            />
          </View>

          {/* Color Selection */}
          <View style={styles.saveDialogSection}>
            <Text style={styles.saveDialogLabel}>Color Theme</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.colorSelector}
            >
              {BINDER_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.color },
                    binderColor === color.id && styles.selectedColor,
                  ]}
                  onPress={() => setBinderColor(color.id)}
                >
                  {binderColor === color.id && (
                    <MaterialIcons name="check" size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.selectedColorName}>{selectedColorInfo?.name}</Text>
          </View>

          {/* Tag Selection */}
          <View style={styles.saveDialogSection}>
            <Text style={styles.saveDialogLabel}>Tags (Optional)</Text>

            {/* Selected Tags */}
            {binderTags.length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {binderTags.map((tag, index) => (
                  <TouchableOpacity
                    key={`selected-${tag}`}
                    style={styles.selectedTag}
                    onPress={() => setBinderTags(prev => prev.filter(t => t !== tag))}
                  >
                    <Text style={styles.selectedTagText}>{tag}</Text>
                    <MaterialIcons name="close" size={16} color="#f44336" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Custom Tag Input */}
            <View style={styles.customTagContainer}>
              <TextInput
                style={styles.customTagInput}
                value={customTag}
                onChangeText={setCustomTag}
                placeholder="Add custom tag..."
                maxLength={20}
                onSubmitEditing={() => {
                  if (customTag.trim() && !binderTags.includes(customTag.trim())) {
                    setBinderTags(prev => [...prev, customTag.trim()]);
                    setCustomTag('');
                  }
                }}
              />
              {customTag.trim() && !binderTags.includes(customTag.trim()) && (
                <TouchableOpacity
                  style={styles.addTagButton}
                  onPress={() => {
                    setBinderTags(prev => [...prev, customTag.trim()]);
                    setCustomTag('');
                  }}
                >
                  <MaterialIcons name="add" size={20} color="#f44336" />
                </TouchableOpacity>
              )}
            </View>

            {/* Suggested Tags */}
            <Text style={styles.suggestedTagsLabel}>Suggested Tags:</Text>
            <View style={styles.suggestedTagsContainer}>
              {SUGGESTED_TAGS.filter(tag => !binderTags.includes(tag)).map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.suggestedTag}
                  onPress={() => setBinderTags(prev => [...prev, tag])}
                >
                  <Text style={styles.suggestedTagText}>{tag}</Text>
                  <MaterialIcons name="add" size={14} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.saveDialogSummary}>
            <Text style={styles.saveDialogInfo}>
              📋 {filledSlots}/{totalSlots} slots filled ({gridSize} grid)
            </Text>
            <Text style={styles.saveDialogInfo}>
              🎨 {selectedColorInfo?.name}{binderTags.length > 0 ? ` • 🏷️ ${binderTags.join(', ')}` : ''}
            </Text>
          </View>
          </ScrollView>

          <View style={styles.saveDialogButtons}>
            <TouchableOpacity
              style={styles.saveDialogCancelButton}
              onPress={() => setShowSaveDialog(false)}
            >
              <Text style={styles.saveDialogCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveDialogSaveButton, { backgroundColor: selectedColorInfo?.color }]}
              onPress={handleSaveBinder}
            >
              <Text style={styles.saveDialogSaveText}>Save Binder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Binder Planner</Text>
            {user && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setShowSaveDialog(true)}
              >
                <MaterialIcons name="save" size={20} color="white" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Grid Size Selector */}
          <View style={styles.gridSelector}>
            {Object.entries(gridConfigs).map(([size, config]) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.gridButton,
                  gridSize === size && styles.activeGridButton,
                ]}
                onPress={() => setGridSize(size as GridSize)}
              >
                <Text
                  style={[
                    styles.gridButtonText,
                    gridSize === size && styles.activeGridButtonText,
                  ]}
                >
                  {config.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Binder Grid */}
        <View style={styles.binderContainer}>
          {/* Page Header with Navigation */}
          <View style={styles.pageHeader}>
            <TouchableOpacity
              style={[
                styles.pageNavButton,
                currentPage <= 1 && styles.pageNavButtonDisabled,
              ]}
              testID='prev-page-button'
              onPress={goToPreviousPage}
              disabled={currentPage <= 1}
            >
              <MaterialIcons
                name="chevron-left"
                size={24}
                color={currentPage <= 1 ? '#ccc' : '#f44336'}
              />
            </TouchableOpacity>

            <View style={styles.pageInfo}>
              <Text style={styles.pageTitle}>
                Page {currentPage} of {totalPages}
              </Text>
              <Text style={styles.pageSubtitle}>
                ({getCurrentPageCards().filter(slot => slot.card).length}/{currentConfig.total} slots filled)
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.pageNavButton,
                currentPage >= totalPages && styles.pageNavButtonDisabled,
              ]}
              testID='next-page-button'
              onPress={goToNextPage}
              disabled={currentPage >= totalPages}
            >
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={currentPage >= totalPages ? '#ccc' : '#f44336'}
              />
            </TouchableOpacity>
          </View>

          {/* Page Jump Controls */}
          <View style={styles.pageJumpContainer}>
            <View style={styles.pageJumpButtons}>
              <TouchableOpacity
                style={styles.pageJumpButton}
                onPress={() => goToPage(1)}
              >
                <Text style={styles.pageJumpButtonText}>Page 1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pageJumpButton}
                onPress={() => goToPage(25)}
              >
                <Text style={styles.pageJumpButtonText}>Page 25</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pageJumpButton}
                onPress={() => goToPage(50)}
              >
                <Text style={styles.pageJumpButtonText}>Page 50</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pageJumpButton}
                onPress={() => goToPage(75)}
              >
                <Text style={styles.pageJumpButtonText}>Page 75</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pageJumpButton}
                onPress={() => goToPage(100)}
              >
                <Text style={styles.pageJumpButtonText}>Page 100</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.gridContainer}>
            <FlatList
              data={getCurrentPageCards()}
              renderItem={renderGridSlot}
              keyExtractor={(item) => item.id}
              numColumns={currentConfig.cols}
              key={`grid-${gridSize}-page-${currentPage}`}
              scrollEnabled={false}
              contentContainerStyle={styles.grid}
            />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to use:</Text>
          <Text style={styles.instructionText}>• Choose your page layout (2×2 to 12-Pocket)</Text>
          <Text style={styles.instructionText}>• Navigate between pages using arrows</Text>
          <Text style={styles.instructionText}>• Tap any empty slot (+) to choose a card</Text>
          <Text style={styles.instructionText}>• Tap the X on filled slots to remove cards</Text>
        </View>

      </ScrollView>

      {/* Card Picker Modal */}
      {renderCardPicker()}

      {/* Save Dialog */}
      {renderSaveDialog()}
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
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  gridSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  gridButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeGridButton: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
  gridButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeGridButtonText: {
    color: 'white',
  },
  binderContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  gridContainer: {
    alignItems: 'center',
  },
  grid: {
    gap: 5,
  },
  gridSlot: {
    margin: 2.5,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  emptySlot: {
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  filledSlot: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  emptySlotContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlotText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  cardContainer: {
    flex: 1,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    paddingVertical: 20,
  },
  availableCardsContainer: {
    gap: 10,
    paddingHorizontal: 5,
  },
  availableCard: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#f44336',
    backgroundColor: '#fff3f3',
  },
  cardName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 80,
    color: '#333',
  },
  instructionsContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  // Save Dialog Styles
  saveDialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  saveDialog: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 20,
    maxHeight: '90%',
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveDialogScroll: {
    flexShrink: 1,
  },
  saveDialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    color: '#333',
  },
  saveDialogSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  saveDialogLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  saveDialogInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  colorSelector: {
    marginBottom: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedColorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  selectedTagText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  customTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  customTagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  addTagButton: {
    backgroundColor: '#fff3f3',
    borderWidth: 1,
    borderColor: '#f44336',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestedTagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  suggestedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    maxHeight: 120,
    overflow: 'hidden',
  },
  suggestedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 4,
  },
  suggestedTagText: {
    fontSize: 13,
    color: '#666',
  },
  saveDialogSummary: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  saveDialogInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  saveDialogButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  saveDialogCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  saveDialogCancelText: {
    fontSize: 16,
    color: '#666',
  },
  saveDialogSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f44336',
    alignItems: 'center',
  },
  saveDialogSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  // Library Controls Styles
  libraryControls: {
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  setsContainer: {
    marginBottom: 8,
  },
  setsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  setsScrollContainer: {
    paddingRight: 20,
    gap: 8,
  },
  setButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  selectedSetButton: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
  setButtonText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedSetButtonText: {
    color: 'white',
  },
  // Card Picker Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  cardPickerModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 20,
    maxHeight: '85%',
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalSearchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  modalSetsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalSetsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  modalSetsScroll: {
    paddingRight: 20,
    gap: 8,
  },
  modalSetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
  },
  modalSetButtonText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalCardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalCardsGrid: {
    gap: 12,
  },
  modalLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  modalLoadingText: {
    fontSize: 16,
    color: '#666',
  },
  modalEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    paddingHorizontal: 20,
  },
  modalEmptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalEmptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  pickerCard: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 4,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerCardImage: {
    width: 100,
    height: 140,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  pickerCardName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 32,
  },
  pickerCardSet: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '500',
  },
  pickerCardRarity: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  // Page Navigation Styles
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  pageNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f44336',
  },
  pageNavButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  pageInfo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  pageJumpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  pageJumpButtons: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pageJumpButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 55,
  },
  pageJumpButtonText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BinderPlanner;