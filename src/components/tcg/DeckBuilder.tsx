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
  // Deck builder styles
});

export default DeckBuilder;
