// src/components/tcg/DeckBuilder.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { searchCards, TCGCard } from '../../api/tcgApi';
import HoloCard from './HoloCard';

interface DeckCard extends TCGCard {
  count: number;
}

const DeckBuilder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TCGCard[]>([]);
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Search for cards
  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    setLoading(true);
    try {
      const results = await searchCards(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add card to deck
  const addCardToDeck = (card: TCGCard) => {
    setDeck((prevDeck) => {
      // Check if card is already in deck
      const existingCardIndex = prevDeck.findIndex((c) => c.id === card.id);

      if (existingCardIndex >= 0) {
        // Increase count for existing card
        const newDeck = [...prevDeck];
        newDeck[existingCardIndex] = {
          ...newDeck[existingCardIndex],
          count: newDeck[existingCardIndex].count + 1,
        };
        return newDeck;
      } else {
        // Add new card with count 1
        return [...prevDeck, { ...card, count: 1 }];
      }
    });
  };

  // Remove card from deck
  const removeCardFromDeck = (cardId: string) => {
    setDeck((prevDeck) => {
      const existingCardIndex = prevDeck.findIndex((c) => c.id === cardId);

      if (existingCardIndex >= 0) {
        const newDeck = [...prevDeck];
        if (newDeck[existingCardIndex].count > 1) {
          // Decrease count
          newDeck[existingCardIndex] = {
            ...newDeck[existingCardIndex],
            count: newDeck[existingCardIndex].count - 1,
          };
          return newDeck;
        } else {
          // Remove card entirely
          return prevDeck.filter((c) => c.id !== cardId);
        }
      }
      return prevDeck;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TCG Deck Builder</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder='Search for cards...'
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.sectionTitle}>Search Results</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cardItem}
                onPress={() => addCardToDeck(item)}
              >
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardSet}>{item.set.name}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addCardToDeck(item)}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Current Deck */}
      <View style={styles.deckContainer}>
        <Text style={styles.sectionTitle}>
          Your Deck ({deck.reduce((sum, card) => sum + card.count, 0)} cards)
        </Text>
        <FlatList
          data={deck}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.deckCard}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardCount}>x{item.count}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeCardFromDeck(item.id)}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  searchButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    padding: 15,
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
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
  },
  cardName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardSet: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckContainer: {
    maxHeight: 250,
    padding: 15,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  cardCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
    marginLeft: 'auto',
    marginRight: 15,
  },
  removeButton: {
    backgroundColor: '#f44336',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeckBuilder;
