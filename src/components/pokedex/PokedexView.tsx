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
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  getPokemons,
  getPokemonByName,
  PokemonDetail,
  getSprite,
  getBestQualitySprite,
  getAlternativeSpriteSources,
  SpriteGeneration,
  SpriteGame,
  SpriteVariant,
} from '../../api/pokeApi';

// Define available game versions for sprite selection
const gameVersions = [
  { label: 'Best Quality', value: 'best' },
  { label: 'Official Artwork', value: 'official-artwork', generation: 'default' as SpriteGeneration },
  { label: 'Pokemon Home', value: 'home', generation: 'default' as SpriteGeneration },
  { label: 'Dream World', value: 'dream-world', generation: 'default' as SpriteGeneration },
  { label: 'Showdown', value: 'showdown', generation: 'default' as SpriteGeneration },
  { label: 'Gen I - Red/Blue', value: 'red-blue', generation: 'generation-i' as SpriteGeneration },
  { label: 'Gen I - Yellow', value: 'yellow', generation: 'generation-i' as SpriteGeneration },
  { label: 'Gen II - Gold', value: 'gold', generation: 'generation-ii' as SpriteGeneration },
  { label: 'Gen II - Silver', value: 'silver', generation: 'generation-ii' as SpriteGeneration },
  { label: 'Gen II - Crystal', value: 'crystal', generation: 'generation-ii' as SpriteGeneration },
  { label: 'Gen III - Ruby/Sapphire', value: 'ruby-sapphire', generation: 'generation-iii' as SpriteGeneration },
  { label: 'Gen III - Emerald', value: 'emerald', generation: 'generation-iii' as SpriteGeneration },
  { label: 'Gen III - FireRed/LeafGreen', value: 'firered-leafgreen', generation: 'generation-iii' as SpriteGeneration },
  { label: 'Gen IV - Diamond/Pearl', value: 'diamond-pearl', generation: 'generation-iv' as SpriteGeneration },
  { label: 'Gen IV - Platinum', value: 'platinum', generation: 'generation-iv' as SpriteGeneration },
  { label: 'Gen IV - HeartGold/SoulSilver', value: 'heartgold-soulsilver', generation: 'generation-iv' as SpriteGeneration },
  { label: 'Gen V - Black/White', value: 'black-white', generation: 'generation-v' as SpriteGeneration },
  { label: 'Gen V - Black/White (Animated)', value: 'black-white-animated', generation: 'generation-v' as SpriteGeneration },
  { label: 'Gen VI - X/Y', value: 'x-y', generation: 'generation-vi' as SpriteGeneration },
  { label: 'Gen VI - Omega Ruby/Alpha Sapphire', value: 'omegaruby-alphasapphire', generation: 'generation-vi' as SpriteGeneration },
  { label: 'Gen VII - Ultra Sun/Ultra Moon', value: 'ultra-sun-ultra-moon', generation: 'generation-vii' as SpriteGeneration },
];

const PokedexView: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<
    { name: string; url: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null
  );
  const [selectedVersion, setSelectedVersion] = useState<string>('best');
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [isShiny, setIsShiny] = useState<boolean>(false);
  const [showBack, setShowBack] = useState<boolean>(false);
  const [showFemale, setShowFemale] = useState<boolean>(false);
  const [useAlternativeSources, setUseAlternativeSources] = useState<boolean>(false);

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
      // Fallback to demo data for testing
      const demoPokemons = [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
        { name: 'blastoise', url: 'https://pokeapi.co/api/v2/pokemon/9/' },
        { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
        { name: 'mewtwo', url: 'https://pokeapi.co/api/v2/pokemon/150/' },
        { name: 'mew', url: 'https://pokeapi.co/api/v2/pokemon/151/' },
        { name: 'dragonite', url: 'https://pokeapi.co/api/v2/pokemon/149/' },
        { name: 'snorlax', url: 'https://pokeapi.co/api/v2/pokemon/143/' }
      ];
      setPokemonList(offset === 0 ? demoPokemons : [...pokemonList, ...demoPokemons]);
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
      // Fallback demo data for testing sprite features
      const demoDetail = {
        id: name === 'pikachu' ? 25 : name === 'charizard' ? 6 : 1,
        name: name,
        height: 40,
        weight: 60,
        sprites: {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${name === 'pikachu' ? '25' : name === 'charizard' ? '6' : '1'}.png`,
          back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${name === 'pikachu' ? '25' : name === 'charizard' ? '6' : '1'}.png`,
          front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${name === 'pikachu' ? '25' : name === 'charizard' ? '6' : '1'}.png`,
          back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${name === 'pikachu' ? '25' : name === 'charizard' ? '6' : '1'}.png`,
          front_female: null,
          back_female: null,
          front_shiny_female: null,
          back_shiny_female: null,
          other: {
            'official-artwork': {
              front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${name === 'pikachu' ? '25' : name === 'charizard' ? '6' : '1'}.png`,
              front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${name === 'pikachu' ? '25' : name === 'charizard' ? '6' : '1'}.png`
            }
          }
        },
        types: [{ slot: 1, type: { name: 'electric', url: '' } }],
        stats: [
          { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
          { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
          { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
          { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: '' } },
          { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: '' } },
          { base_stat: 90, effort: 2, stat: { name: 'speed', url: '' } }
        ],
        abilities: [
          { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
          { ability: { name: 'lightning-rod', url: '' }, is_hidden: true, slot: 3 }
        ]
      };
      setSelectedPokemon(demoDetail as any);
      setDetailModalVisible(true);
    }
  };

  // Get the appropriate sprite based on all selected options
  const getCurrentSprite = (pokemon: PokemonDetail): string | null => {
    if (useAlternativeSources) {
      const altSources = getAlternativeSpriteSources(pokemon.id, pokemon.name);
      if (isShiny) {
        return altSources.pokemondb.shiny || altSources.serebii.sprite;
      }
      return altSources.pokemondb.sprite || altSources.serebii.sprite || altSources.pokeres.artwork;
    }

    if (selectedVersion === 'best') {
      return getBestQualitySprite(pokemon.sprites, isShiny, !showBack);
    }

    const selectedGameVersion = gameVersions.find(v => v.value === selectedVersion);
    if (!selectedGameVersion) {
      return getBestQualitySprite(pokemon.sprites, isShiny, !showBack);
    }

    // Construct the variant based on user preferences
    let variant: SpriteVariant = 'front_default';
    
    if (showBack && isShiny && showFemale) {
      variant = 'back_shiny_female';
    } else if (showBack && isShiny) {
      variant = 'back_shiny';
    } else if (showBack && showFemale) {
      variant = 'back_female';
    } else if (showBack) {
      variant = 'back_default';
    } else if (isShiny && showFemale) {
      variant = 'front_shiny_female';
    } else if (isShiny) {
      variant = 'front_shiny';
    } else if (showFemale) {
      variant = 'front_female';
    }

    const isAnimated = selectedVersion === 'black-white-animated';
    
    return getSprite(pokemon.sprites, {
      generation: selectedGameVersion.generation,
      game: selectedGameVersion.value as SpriteGame,
      variant,
      animated: isAnimated
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.controlsContainer}>
        {/* Sprite Version Dropdown */}
        <View style={styles.dropdownSection}>
          <Text style={styles.sectionTitle}>Sprite Version</Text>
          <View style={styles.pickerContainer}>
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
        </View>

        {/* Toggle Controls */}
        <View style={styles.toggleSection}>
          <Text style={styles.sectionTitle}>Options</Text>
          <View style={styles.toggleGrid}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>✨ Shiny</Text>
                <Switch
                  value={isShiny}
                  onValueChange={setIsShiny}
                  trackColor={{ false: '#ccc', true: '#FFD700' }}
                  thumbColor={isShiny ? '#FFA500' : '#f4f3f4'}
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>🔄 Back View</Text>
                <Switch
                  value={showBack}
                  onValueChange={setShowBack}
                  trackColor={{ false: '#ccc', true: '#4CAF50' }}
                  thumbColor={showBack ? '#2E7D32' : '#f4f3f4'}
                />
              </View>
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>♀️ Female</Text>
                <Switch
                  value={showFemale}
                  onValueChange={setShowFemale}
                  trackColor={{ false: '#ccc', true: '#E91E63' }}
                  thumbColor={showFemale ? '#C2185B' : '#f4f3f4'}
                />
              </View>

              <View style={styles.toggleItem}>
                <Text style={styles.toggleLabel}>🌐 Alt Sources</Text>
                <Switch
                  value={useAlternativeSources}
                  onValueChange={setUseAlternativeSources}
                  trackColor={{ false: '#ccc', true: '#2196F3' }}
                  thumbColor={useAlternativeSources ? '#1976D2' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={pokemonList}
        keyExtractor={(item, index) => `${item.name}-${index}`}
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
                source={{ uri: getCurrentSprite(selectedPokemon) || selectedPokemon.sprites.front_default || undefined }}
                style={styles.pokemonSprite}
                resizeMode='contain'
                onError={() => {
                  // Fallback to alternative sources if main sprite fails
                  if (!useAlternativeSources) {
                    setUseAlternativeSources(true);
                  }
                }}
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  controlsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  toggleSection: {
    marginBottom: 10,
  },
  toggleGrid: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  toggleItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  pokemonCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    textAlign: 'center',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 15,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  pokemonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  pokemonSprite: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 4,
  },
  typeText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  infoSection: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statBarContainer: {
    flex: 2,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  statBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  statValue: {
    flex: 0.5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#333',
  },
  abilityText: {
    fontSize: 16,
    textTransform: 'capitalize',
    marginBottom: 5,
    color: '#555',
  },
});

export default PokedexView;
