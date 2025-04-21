// src/components/pokedex/PokedexView.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  getPokemons,
  getPokemonByName,
  PokemonDetail,
} from '../../api/pokeApi';

// Define available game versions for sprite selection
const gameVersions = [
  { label: 'Default', value: 'default' },
  { label: 'Red/Blue', value: 'red-blue' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Gold/Silver', value: 'gold-silver' },
  { label: 'Crystal', value: 'crystal' },
  // Add more versions as needed
];

const PokedexView: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<
    { name: string; url: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null
  );
  const [selectedVersion, setSelectedVersion] = useState<string>('default');
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async (offset = 0) => {
    setLoading(true);
    try {
      const response = await getPokemons(20, offset);
      setPokemonList((prev) =>
        offset === 0 ? response.results : [...prev, ...response.results]
      );
      setPage(Math.floor(offset / 20));
    } catch (error) {
      console.error('Error fetching Pokémon list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonSelect = async (name: string) => {
    try {
      const detail = await getPokemonByName(name);
      setSelectedPokemon(detail);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
  };

  // Get the appropriate sprite based on selected version
  const getSprite = (pokemon: PokemonDetail): string => {
    if (selectedVersion === 'default') {
      return pokemon.sprites.front_default;
    }

    // Example of accessing generation-specific sprites
    // In a real app, you'd need more complex logic to handle all generations
    if (
      selectedVersion === 'red-blue' &&
      pokemon.sprites.versions?.['generation-i']?.['red-blue']
    ) {
      return pokemon.sprites.versions['generation-i']['red-blue'].front_default;
    }

    // Fallback to default sprite if selected version isn't available
    return pokemon.sprites.front_default;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.versionSelector}>
        <Text style={styles.versionLabel}>Sprite Version:</Text>
        <Picker
          selectedValue={selectedVersion}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedVersion(itemValue)}
        >
          {gameVersions.map((version) => (
            <Picker.Item
              key={version.value}
              label={version.label}
              value={version.value}
            />
          ))}
        </Picker>
      </View>

      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.pokemonCard}
            onPress={() => handlePokemonSelect(item.name)}
          >
            <Text style={styles.pokemonName}>{item.name}</Text>
            {/* We could show a thumbnail here but would need to fetch each Pokémon */}
          </TouchableOpacity>
        )}
        onEndReached={() => fetchPokemons((page + 1) * 20)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size='large'
              color='#0000ff'
            />
          ) : null
        }
      />

      {/* Pokémon Detail Modal */}
      <Modal
        animationType='slide'
        transparent={false}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        {selectedPokemon ? (
          <SafeAreaView style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.pokemonTitle}>
                #{selectedPokemon.id} {selectedPokemon.name}
              </Text>

              {/* Display the selected sprite */}
              <Image
                source={{ uri: getSprite(selectedPokemon) }}
                style={styles.pokemonSprite}
                resizeMode='contain'
              />

              {/* Pokémon Type */}
              <View style={styles.typeContainer}>
                {selectedPokemon.types.map((typeInfo) => (
                  <View
                    key={typeInfo.slot}
                    style={[
                      styles.typeTag,
                      { backgroundColor: getTypeColor(typeInfo.type.name) },
                    ]}
                  >
                    <Text style={styles.typeText}>{typeInfo.type.name}</Text>
                  </View>
                ))}
              </View>

              {/* Basic Info */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Info</Text>
                <View style={styles.infoRow}>
                  <Text>Height: {selectedPokemon.height / 10}m</Text>
                  <Text>Weight: {selectedPokemon.weight / 10}kg</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Base Stats</Text>
                {selectedPokemon.stats.map((stat) => (
                  <View
                    key={stat.stat.name}
                    style={styles.statRow}
                  >
                    <Text style={styles.statName}>
                      {formatStatName(stat.stat.name)}
                    </Text>
                    <View style={styles.statBarContainer}>
                      <View
                        style={[
                          styles.statBar,
                          {
                            width: `${Math.min(
                              100,
                              (stat.base_stat / 255) * 100
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.statValue}>{stat.base_stat}</Text>
                  </View>
                ))}
              </View>

              {/* Abilities */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Abilities</Text>
                {selectedPokemon.abilities.map((ability, index) => (
                  <Text
                    key={index}
                    style={styles.abilityText}
                  >
                    {ability.ability.name}
                    {ability.is_hidden ? ' (Hidden)' : ''}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        ) : null}
      </Modal>
    </SafeAreaView>
  );
};

// Helper Functions
const formatStatName = (name: string): string => {
  const formattedNames: { [key: string]: string } = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  };

  return formattedNames[name] || name;
};

const getTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  return colors[type] || '#888888';
};

const styles = StyleSheet.create({
  // Style definitions here
  // (truncated for brevity)
});

export default PokedexView;
