// src/components/pokedex/PokedexView.tsx
import React, { useState, useEffect, useRef } from 'react';
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
  TextInput,
  RefreshControl,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle,
  withDelay 
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import {
  getPokemons,
  getPokemonByName,
  getPokemonSpecies,
  getEvolutionChain,
  PokemonDetail,
  PokemonSpecies,
  EvolutionChain,
  getSprite,
  getBestQualitySprite,
  getAlternativeSpriteSources,
  SpriteGeneration,
  SpriteGame,
  SpriteVariant,
  PokemonForm,
  PokemonFormsGroup,
  PokemonFormType,
  getPokemonForms,
  getPokemonFormById,
  hasMultipleForms,
  POKEMON_FORMS_DATABASE,
} from '../../api/pokeApi';

// All Pokemon types for filtering
const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

// Pokemon generations by ID ranges
const POKEMON_GENERATIONS = [
  { name: 'Gen I', label: 'Kanto', range: [1, 151], color: '#FF6B6B' },
  { name: 'Gen II', label: 'Johto', range: [152, 251], color: '#4ECDC4' },
  { name: 'Gen III', label: 'Hoenn', range: [252, 386], color: '#45B7D1' },
  { name: 'Gen IV', label: 'Sinnoh', range: [387, 493], color: '#96CEB4' },
  { name: 'Gen V', label: 'Unova', range: [494, 649], color: '#FFEAA7' },
  { name: 'Gen VI', label: 'Kalos', range: [650, 721], color: '#DDA0DD' },
  { name: 'Gen VII', label: 'Alola', range: [722, 809], color: '#F19CBB' },
  { name: 'Gen VIII', label: 'Galar', range: [810, 905], color: '#A29BFE' },
  { name: 'Gen IX', label: 'Paldea', range: [906, 1025], color: '#FD79A8' },
];

// Helper function to get Pokemon generation
const getPokemonGeneration = (pokemonId: number): string | null => {
  for (const gen of POKEMON_GENERATIONS) {
    if (pokemonId >= gen.range[0] && pokemonId <= gen.range[1]) {
      return gen.name;
    }
  }
  return null;
};

// Helper function to clean Pokemon display names
const cleanPokemonName = (name: string): string => {
  // Remove "-normal" suffix from base forms for cleaner display
  const cleanedName = name.replace(/-normal$/i, '');
  // Replace remaining hyphens with spaces and capitalize
  return cleanedName.replace('-', ' ');
};

// AsyncStorage key for favorites
const FAVORITES_STORAGE_KEY = '@pokemon_favorites';

// Helper functions for species data
const getEnglishDescription = (species: PokemonSpecies): string => {
  const englishEntry = species.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );
  return englishEntry 
    ? englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ').trim()
    : 'No description available.';
};

const getEnglishGenus = (species: PokemonSpecies): string => {
  const englishGenus = species.genera.find(
    genus => genus.language.name === 'en'
  );
  return englishGenus ? englishGenus.genus : 'Unknown Species';
};

// Helper functions for evolution chain data
const parseEvolutionChain = (chain: EvolutionChain): Array<{
  name: string;
  id: number;
  trigger?: string;
  level?: number;
  item?: string;
}> => {
  const evolutions: Array<{
    name: string;
    id: number;
    trigger?: string;
    level?: number;
    item?: string;
  }> = [];
  
  // Recursive function to traverse evolution chain
  const traverseChain = (chainNode: any) => {
    // Extract Pokemon ID from species URL
    const urlParts = chainNode.species.url.split('/');
    const pokemonId = parseInt(urlParts[urlParts.length - 2]);
    
    evolutions.push({
      name: chainNode.species.name,
      id: pokemonId
    });
    
    // Process evolution details for next stage
    if (chainNode.evolves_to && chainNode.evolves_to.length > 0) {
      chainNode.evolves_to.forEach((evolution: any) => {
        const urlParts = evolution.species.url.split('/');
        const evolvedId = parseInt(urlParts[urlParts.length - 2]);
        
        const evolutionDetails = evolution.evolution_details[0]; // Take first evolution method
        evolutions.push({
          name: evolution.species.name,
          id: evolvedId,
          trigger: evolutionDetails?.trigger?.name,
          level: evolutionDetails?.min_level,
          item: evolutionDetails?.item?.name
        });
        
        // Continue traversing for further evolutions
        traverseChain(evolution);
      });
    }
  };
  
  traverseChain(chain.chain);
  
  // Remove duplicates and return
  const uniqueEvolutions = evolutions.filter((evolution, index, self) => 
    index === self.findIndex(e => e.id === evolution.id)
  );
  
  return uniqueEvolutions.sort((a, b) => a.id - b.id);
};

// Stat color mapping for visual appeal
const getStatColor = (statName: string): string => {
  const colors: { [key: string]: string } = {
    'hp': '#ff5959',
    'attack': '#f5ac78', 
    'defense': '#fae078',
    'special-attack': '#9db7f5',
    'special-defense': '#a7db8d',
    'speed': '#fa92b2'
  };
  return colors[statName] || '#94a3b8';
};

// Animated Stat Bar Component
const AnimatedStatBar: React.FC<{
  statName: string;
  statValue: number;
  delay: number;
}> = ({ statName, statValue, delay }) => {
  const width = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const targetWidth = Math.min(100, (statValue / 255) * 100);
    width.value = withDelay(delay, withTiming(targetWidth, { duration: 800 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
  }, [statValue, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    opacity: opacity.value,
  }));

  return (
    <View style={styles.statBarContainer}>
      <View style={styles.statBarBackground}>
        <Animated.View
          style={[
            styles.statBar,
            { backgroundColor: getStatColor(statName) },
            animatedStyle
          ]}
        />
      </View>
    </View>
  );
};

// Animated Pokemon Card Component
const AnimatedPokemonCard: React.FC<{
  item: { name: string; url: string; id?: number };
  onPress: () => void;
  favorites: Set<number>;
  toggleFavorite: (id: number) => void;
  getMiniSpriteUrl: (id: number) => string;
}> = ({ item, onPress, favorites, toggleFavorite, getMiniSpriteUrl }) => {
  const scaleAnim = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }]
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.pokemonListCard,
          { 
            backgroundColor: getPokemonCardColor(item.name),
            borderColor: getPokemonBorderColor(item.name)
          }
        ]}
        onPressIn={() => {
          scaleAnim.value = withTiming(0.96, { duration: 100 });
        }}
        onPressOut={() => {
          scaleAnim.value = withTiming(1, { duration: 150 });
        }}
        onPress={() => {
          console.log(`🖱️ Card pressed: ${item.name}`);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, Pokemon number ${item.id}`}
        accessibilityHint="Opens detailed view with sprites and stats"
      >
        {/* Pokemon Number */}
        <Text style={styles.pokemonNumber}>
          #{String(item.id || 1).padStart(4, '0')}
        </Text>
        
        {/* Mini Pokemon Sprite */}
        <View style={styles.miniSpriteContainer}>
          <Image
            source={{ 
              uri: getMiniSpriteUrl(item.id || 1)
            }}
            style={styles.miniSprite}
            resizeMode="contain"
            onError={() => {
              // Fallback to regular sprite if current style fails
            }}
          />
        </View>
        
        {/* Pokemon Name */}
        <View style={styles.pokemonNameContainer}>
          <Text style={styles.pokemonListName}>
            {cleanPokemonName(item.name)}
          </Text>
        </View>
        
        {/* Favorite Heart */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation(); // Prevent card press when tapping heart
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleFavorite(item.id || 1);
          }}
          accessibilityRole="button"
          accessibilityLabel={favorites.has(item.id || 1) ? "Remove from favorites" : "Add to favorites"}
          accessibilityHint={`${favorites.has(item.id || 1) ? 'Remove' : 'Add'} ${item.name} ${favorites.has(item.id || 1) ? 'from' : 'to'} your favorites`}
        >
          <Ionicons
            name={favorites.has(item.id || 1) ? "heart" : "heart-outline"}
            size={24}
            color={favorites.has(item.id || 1) ? "#ef4444" : "#9ca3af"}
          />
        </TouchableOpacity>
        
        {/* Arrow indicator */}
        <Text style={styles.arrowIndicator}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Helper function to get Pokemon's primary type color
const getPokemonCardColor = (pokemonName: string): string => {
  const types = getPokemonTypes(pokemonName);
  if (types.length > 0) {
    const primaryType = types[0].type.name;
    const typeColor = getTypeColor(primaryType);
    // Return a very light tint of the type color for card background
    return typeColor + '15'; // Add 15% opacity
  }
  return '#ffffff'; // Default white background
};

// Helper function to get Pokemon's border color
const getPokemonBorderColor = (pokemonName: string): string => {
  const types = getPokemonTypes(pokemonName);
  if (types.length > 0) {
    const primaryType = types[0].type.name;
    const typeColor = getTypeColor(primaryType);
    // Return a more solid tint for border
    return typeColor + '40'; // Add 40% opacity
  }
  return '#e5e7eb'; // Default gray border
};

// Pokemon demo data helpers
const getPokemonTypes = (name: string) => {
  const typeMap: {[key: string]: any} = {
    'charizard': [
      { slot: 1, type: { name: 'fire', url: '' } },
      { slot: 2, type: { name: 'flying', url: '' } }
    ],
    'blastoise': [{ slot: 1, type: { name: 'water', url: '' } }],
    'venusaur': [
      { slot: 1, type: { name: 'grass', url: '' } },
      { slot: 2, type: { name: 'poison', url: '' } }
    ],
    'typhlosion': [{ slot: 1, type: { name: 'fire', url: '' } }],
    'alakazam': [{ slot: 1, type: { name: 'psychic', url: '' } }],
    'gengar': [
      { slot: 1, type: { name: 'ghost', url: '' } },
      { slot: 2, type: { name: 'poison', url: '' } }
    ],
    'dragonite': [
      { slot: 1, type: { name: 'dragon', url: '' } },
      { slot: 2, type: { name: 'flying', url: '' } }
    ],
    'mewtwo': [{ slot: 1, type: { name: 'psychic', url: '' } }],
    'mew': [{ slot: 1, type: { name: 'psychic', url: '' } }],
    'lugia': [
      { slot: 1, type: { name: 'psychic', url: '' } },
      { slot: 2, type: { name: 'flying', url: '' } }
    ],
    'ho-oh': [
      { slot: 1, type: { name: 'fire', url: '' } },
      { slot: 2, type: { name: 'flying', url: '' } }
    ]
  };
  return typeMap[name] || [{ slot: 1, type: { name: 'electric', url: '' } }]; // Default to Pikachu
};

const getPokemonStats = (name: string) => {
  const statsMap: {[key: string]: any} = {
    'charizard': [
      { base_stat: 78, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 84, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 78, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 109, effort: 3, stat: { name: 'special-attack', url: '' } },
      { base_stat: 85, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 100, effort: 0, stat: { name: 'speed', url: '' } }
    ],
    'blastoise': [
      { base_stat: 79, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 83, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 100, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 85, effort: 0, stat: { name: 'special-attack', url: '' } },
      { base_stat: 105, effort: 3, stat: { name: 'special-defense', url: '' } },
      { base_stat: 78, effort: 0, stat: { name: 'speed', url: '' } }
    ],
    'typhlosion': [
      { base_stat: 78, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 84, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 78, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 109, effort: 3, stat: { name: 'special-attack', url: '' } },
      { base_stat: 85, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 100, effort: 0, stat: { name: 'speed', url: '' } }
    ],
    'venusaur': [
      { base_stat: 80, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 82, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 83, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 100, effort: 3, stat: { name: 'special-attack', url: '' } },
      { base_stat: 100, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 80, effort: 0, stat: { name: 'speed', url: '' } }
    ],
    'alakazam': [
      { base_stat: 55, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: 50, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: 45, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: 135, effort: 3, stat: { name: 'special-attack', url: '' } },
      { base_stat: 95, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: 120, effort: 0, stat: { name: 'speed', url: '' } }
    ]
  };
  
  // Default to Pikachu stats
  return statsMap[name] || [
    { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
    { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
    { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: '' } },
    { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: '' } },
    { base_stat: 90, effort: 2, stat: { name: 'speed', url: '' } }
  ];
};

const getPokemonAbilities = (name: string) => {
  const abilityMap: {[key: string]: any} = {
    'charizard': [
      { ability: { name: 'blaze', url: '' }, is_hidden: false, slot: 1 },
      { ability: { name: 'solar-power', url: '' }, is_hidden: true, slot: 3 }
    ],
    'blastoise': [
      { ability: { name: 'torrent', url: '' }, is_hidden: false, slot: 1 },
      { ability: { name: 'rain-dish', url: '' }, is_hidden: true, slot: 3 }
    ],
    'typhlosion': [
      { ability: { name: 'blaze', url: '' }, is_hidden: false, slot: 1 },
      { ability: { name: 'flash-fire', url: '' }, is_hidden: true, slot: 3 }
    ],
    'venusaur': [
      { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 },
      { ability: { name: 'chlorophyll', url: '' }, is_hidden: true, slot: 3 }
    ],
    'alakazam': [
      { ability: { name: 'synchronize', url: '' }, is_hidden: false, slot: 1 },
      { ability: { name: 'magic-guard', url: '' }, is_hidden: true, slot: 3 }
    ]
  };
  
  // Default to Pikachu abilities
  return abilityMap[name] || [
    { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
    { ability: { name: 'lightning-rod', url: '' }, is_hidden: true, slot: 3 }
  ];
};

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
  { label: 'Gen VIII - Sword/Shield', value: 'sword-shield', generation: 'generation-viii' as SpriteGeneration },
  { label: 'Gen VIII - Brilliant Diamond/Shining Pearl', value: 'brilliant-diamond-shining-pearl', generation: 'generation-viii' as SpriteGeneration },
  { label: 'Gen VIII - Legends Arceus', value: 'legends-arceus', generation: 'generation-viii' as SpriteGeneration },
  { label: 'Gen IX - Scarlet/Violet', value: 'scarlet-violet', generation: 'generation-ix' as SpriteGeneration },
];

interface PokedexViewProps {
  settingsModalVisible: boolean;
  setSettingsModalVisible: (visible: boolean) => void;
}

const PokedexView: React.FC<PokedexViewProps> = ({
  settingsModalVisible,
  setSettingsModalVisible
}) => {
  const [pokemonList, setPokemonList] = useState<
    { name: string; url: string; id?: number }[]
  >([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<
    { name: string; url: string; id?: number }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null
  );
  const [pokemonSpecies, setPokemonSpecies] = useState<PokemonSpecies | null>(
    null
  );
  const [loadingSpecies, setLoadingSpecies] = useState<boolean>(false);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(
    null
  );
  const [loadingEvolution, setLoadingEvolution] = useState<boolean>(false);
  const [selectedVersion, setSelectedVersion] = useState<string>('best');
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [spriteStyle, setSpriteStyle] = useState<'party' | 'animated' | 'home' | 'gen9'>('home');
  const [page, setPage] = useState<number>(0);
  const [isShiny, setIsShiny] = useState<boolean>(false);
  const [showBack, setShowBack] = useState<boolean>(false);
  const [showFemale, setShowFemale] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
  
  // Pokemon Forms state
  const [selectedForm, setSelectedForm] = useState<PokemonForm | null>(null);
  const [availableForms, setAvailableForms] = useState<PokemonFormsGroup | null>(null);
  
  // FlatList ref for scroll-to-top functionality
  const flatListRef = useRef<FlatList>(null);

  // Load favorites from storage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const favoritesArray = JSON.parse(storedFavorites);
        setFavorites(new Set(favoritesArray));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Save favorites to storage
  const saveFavorites = async (newFavorites: Set<number>) => {
    try {
      const favoritesArray = Array.from(newFavorites);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (pokemonId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(pokemonId)) {
      newFavorites.delete(pokemonId);
    } else {
      newFavorites.add(pokemonId);
    }
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  // Refresh function for pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      // Re-fetch Pokemon data
      await fetchPokemons();
      
      // Re-load favorites in case they changed
      await loadFavorites();
      
      console.log('✅ Data refreshed successfully');
    } catch (error) {
      console.warn('❌ Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  // Handle scroll events to show/hide scroll-to-top button
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 500); // Show button after scrolling 500px
  };

  // Get sprite URL based on selected style
  const getMiniSpriteUrl = (pokemonId: number): string => {
    switch (spriteStyle) {
      case 'party':
        // Gen 3-8 party/box icons - using Diamond/Pearl style as representative
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/${pokemonId}.png`;
      case 'animated':
        // Gen 5 animated sprites (Black/White)
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`;
      case 'home':
        // Modern Pokémon HOME sprites
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`;
      case 'gen9':
        // Official artwork (Gen 9 style)
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
      default:
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`;
    }
  };

  // Check if Pokemon has different female sprites
  const hasFemaleSprites = (pokemon: PokemonDetail): boolean => {
    const pokemonId = pokemon.id;
    
    // Only these Pokemon IDs have confirmed gender differences:
    // 25 = Pikachu (tail shape), 130 = Gyarados (whisker color), 212 = Scizor (abdomen)
    const pokemonWithGenderDifferences = [25, 130, 212];
    
    return pokemonWithGenderDifferences.includes(pokemonId);
  };

  // Check what sprite options are available for the current version
  const getAvailableOptions = (version: string) => {
    const versionCapabilities = {
      // Generation I - No shiny, limited gender differences
      'red-blue': { shiny: false, back: true, female: false },
      'yellow': { shiny: false, back: true, female: false },
      
      // Generation II - First to have shiny sprites
      'gold': { shiny: true, back: true, female: false },
      'silver': { shiny: true, back: true, female: false },
      'crystal': { shiny: true, back: true, female: false },
      
      // Generation III+
      'ruby-sapphire': { shiny: true, back: true, female: false },
      'emerald': { shiny: true, back: true, female: false },
      'firered-leafgreen': { shiny: true, back: true, female: false },
      'diamond-pearl': { shiny: true, back: true, female: true },
      'platinum': { shiny: true, back: true, female: true },
      'heartgold-soulsilver': { shiny: true, back: true, female: true },
      'black-white': { shiny: true, back: true, female: true },
      'black-white-animated': { shiny: true, back: true, female: true },
      'x-y': { shiny: true, back: true, female: true },
      'omegaruby-alphasapphire': { shiny: true, back: true, female: true },
      'ultra-sun-ultra-moon': { shiny: true, back: true, female: true },
      'sword-shield': { shiny: true, back: true, female: true },
      'brilliant-diamond-shining-pearl': { shiny: true, back: true, female: true },
      'legends-arceus': { shiny: true, back: true, female: true },
      'scarlet-violet': { shiny: true, back: true, female: true },
      
      // Modern/Default
      'best': { shiny: true, back: true, female: true },
      'official-artwork': { shiny: true, back: false, female: false },
      'dream-world': { shiny: false, back: false, female: true },
      'home': { shiny: true, back: false, female: true },
      'showdown': { shiny: true, back: true, female: true },
    };

    return versionCapabilities[version as keyof typeof versionCapabilities] || 
           { shiny: true, back: true, female: true }; // Default to all options
  };
  // Removed useAlternativeSources - fallbacks now automatic
  const [showVersionPicker, setShowVersionPicker] = useState<boolean>(false);

  useEffect(() => {
    fetchPokemons();
    loadFavorites();
    
    // Test direct network connectivity on app start
    testNetworkConnectivity();
  }, []);

  // Filter Pokemon based on search query, selected types, and generations
  useEffect(() => {
    let filtered = pokemonList;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(pokemon => {
        const query = searchQuery.toLowerCase();
        const name = pokemon.name.toLowerCase();
        const id = pokemon.id?.toString() || '';
        
        return name.includes(query) || id.includes(query);
      });
    }
    
    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(pokemon => {
        const pokemonTypes = getPokemonTypes(pokemon.name);
        return selectedTypes.some(selectedType => 
          pokemonTypes.some((typeObj: any) => typeObj.type.name === selectedType)
        );
      });
    }
    
    // Apply generation filter
    if (selectedGenerations.length > 0) {
      filtered = filtered.filter(pokemon => {
        if (!pokemon.id) return false;
        const pokemonGeneration = getPokemonGeneration(pokemon.id);
        return selectedGenerations.includes(pokemonGeneration || '');
      });
    }
    
    // Apply favorites filter
    if (showOnlyFavorites) {
      filtered = filtered.filter(pokemon => {
        return favorites.has(pokemon.id || 0);
      });
    }
    
    setFilteredPokemonList(filtered);
  }, [pokemonList, searchQuery, selectedTypes, selectedGenerations, showOnlyFavorites, favorites]);

  // Reset options when version changes to invalid combinations
  useEffect(() => {
    if (selectedPokemon) {
      const availableOptions = getAvailableOptions(selectedVersion);
      
      // Reset shiny if not available for this version
      if (!availableOptions.shiny && isShiny) {
        setIsShiny(false);
      }
      
      // Reset back sprite if not available for this version
      if (!availableOptions.back && showBack) {
        setShowBack(false);
      }
      
      // Reset female if not available for this version or Pokemon
      if ((!availableOptions.female || !hasFemaleSprites(selectedPokemon)) && showFemale) {
        setShowFemale(false);
      }
    }
  }, [selectedVersion, selectedPokemon]);

  const testNetworkConnectivity = async () => {
    console.log('🌐 Testing network connectivity...');
    
    try {
      // Test a simple fetch request
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/1', {
        method: 'HEAD', // Just test connectivity
      });
      console.log('✅ Network test successful:', response.status);
    } catch (error: any) {
      console.warn('❌ Network test failed:', error.message);
      
      // Try alternative test
      try {
        await fetch('https://httpbin.org/status/200');
        console.log('✅ Alternative network test successful');
      } catch (altError) {
        console.warn('❌ All network tests failed - likely network/firewall issue');
      }
    }
  };

  // Expanded demo Pokemon list for offline experience
  const getDemoPokemons = () => [
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/', id: 3 },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/', id: 6 },
    { name: 'blastoise', url: 'https://pokeapi.co/api/v2/pokemon/9/', id: 9 },
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/', id: 25 },
    { name: 'alakazam', url: 'https://pokeapi.co/api/v2/pokemon/65/', id: 65 },
    { name: 'gengar', url: 'https://pokeapi.co/api/v2/pokemon/94/', id: 94 },
    { name: 'gyarados', url: 'https://pokeapi.co/api/v2/pokemon/130/', id: 130 },
    { name: 'dragonite', url: 'https://pokeapi.co/api/v2/pokemon/149/', id: 149 },
    { name: 'mewtwo', url: 'https://pokeapi.co/api/v2/pokemon/150/', id: 150 },
    { name: 'mew', url: 'https://pokeapi.co/api/v2/pokemon/151/', id: 151 },
    { name: 'typhlosion', url: 'https://pokeapi.co/api/v2/pokemon/157/', id: 157 },
    { name: 'scizor', url: 'https://pokeapi.co/api/v2/pokemon/212/', id: 212 },
    { name: 'tyranitar', url: 'https://pokeapi.co/api/v2/pokemon/248/', id: 248 },
    { name: 'lugia', url: 'https://pokeapi.co/api/v2/pokemon/249/', id: 249 },
    { name: 'ho-oh', url: 'https://pokeapi.co/api/v2/pokemon/250/', id: 250 },
    { name: 'celebi', url: 'https://pokeapi.co/api/v2/pokemon/251/', id: 251 },
    { name: 'blaziken', url: 'https://pokeapi.co/api/v2/pokemon/257/', id: 257 },
    { name: 'salamence', url: 'https://pokeapi.co/api/v2/pokemon/373/', id: 373 },
    { name: 'metagross', url: 'https://pokeapi.co/api/v2/pokemon/376/', id: 376 },
    { name: 'rayquaza', url: 'https://pokeapi.co/api/v2/pokemon/384/', id: 384 },
    { name: 'garchomp', url: 'https://pokeapi.co/api/v2/pokemon/445/', id: 445 },
    { name: 'lucario', url: 'https://pokeapi.co/api/v2/pokemon/448/', id: 448 },
    { name: 'dialga', url: 'https://pokeapi.co/api/v2/pokemon/483/', id: 483 },
    { name: 'giratina-origin', url: 'https://pokeapi.co/api/v2/pokemon/10007/', id: 487 },
    { name: 'reshiram', url: 'https://pokeapi.co/api/v2/pokemon/643/', id: 643 },
    { name: 'greninja', url: 'https://pokeapi.co/api/v2/pokemon/658/', id: 658 },
    { name: 'xerneas', url: 'https://pokeapi.co/api/v2/pokemon/716/', id: 716 },
    { name: 'yveltal', url: 'https://pokeapi.co/api/v2/pokemon/717/', id: 717 },
    { name: 'zygarde-complete', url: 'https://pokeapi.co/api/v2/pokemon/10118/', id: 718 },
    { name: 'decidueye', url: 'https://pokeapi.co/api/v2/pokemon/724/', id: 724 },
    { name: 'corviknight', url: 'https://pokeapi.co/api/v2/pokemon/823/', id: 823 },
    { name: 'dragapult', url: 'https://pokeapi.co/api/v2/pokemon/887/', id: 887 },
    { name: 'tandemaus', url: 'https://pokeapi.co/api/v2/pokemon/924/', id: 924 },
    { name: 'gholdengo', url: 'https://pokeapi.co/api/v2/pokemon/1000/', id: 1000 },
    { name: 'iron-valiant', url: 'https://pokeapi.co/api/v2/pokemon/1006/', id: 1006 }
  ];

  const fetchPokemons = async (offset = 0) => {
    setLoading(true);
    
    // Offline-first approach: use demo data immediately, then try network
    if (offset === 0) {
      const demoPokemons = getDemoPokemons();
      setPokemonList(demoPokemons);
      setLoading(false);
    }
    
    try {
      console.log(`Attempting to fetch Pokemon list from network (offset: ${offset})`);
      const response = await getPokemons(20, offset);
      console.log('Network fetch successful, updating with real data');
      
      setPokemonList((prev) =>
        offset === 0 ? response.results : [...prev, ...response.results]
      );
      setPage(Math.floor(offset / 20));
    } catch (error: any) {
      console.warn('Network unavailable, using offline demo data:', error.message);
      
      // Only add demo data if we don't already have it
      if (offset === 0 && pokemonList.length === 0) {
        const demoPokemons = getDemoPokemons();
        setPokemonList(demoPokemons);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonSelect = async (name: string) => {
    console.log(`🎯 Pokemon selected: ${name}`);
    
    try {
      const detail = await getPokemonByName(name);
      setSelectedPokemon(detail);
      
      // Load Pokemon forms if available
      const formsGroup = getPokemonForms(detail.id);
      if (formsGroup) {
        setAvailableForms(formsGroup);
        // Set default form to base form
        const baseForm = formsGroup.forms.find(f => f.formType === 'base') || formsGroup.forms[0];
        setSelectedForm(baseForm);
        console.log(`📋 Found ${formsGroup.forms.length} forms for ${name}:`, formsGroup.forms.map(f => f.displayName));
      } else {
        setAvailableForms(null);
        setSelectedForm(null);
        console.log(`📋 No additional forms found for ${name}`);
      }
      
      // Reset female toggle if new Pokemon doesn't have female sprites
      if (!hasFemaleSprites(detail)) {
        setShowFemale(false);
      }
      setDetailModalVisible(true);
      
      // Fetch species data for Pokédex information
      setLoadingSpecies(true);
      try {
        const species = await getPokemonSpecies(detail.id);
        setPokemonSpecies(species);
        
        // Fetch evolution chain if species data is available
        if (species && species.evolution_chain) {
          setLoadingEvolution(true);
          try {
            const evolutionData = await getEvolutionChain(species.evolution_chain.url);
            setEvolutionChain(evolutionData);
          } catch (evolutionError) {
            console.warn(`Failed to fetch evolution chain for ${name}:`, evolutionError);
            setEvolutionChain(null);
          } finally {
            setLoadingEvolution(false);
          }
        }
      } catch (speciesError) {
        console.warn(`Failed to fetch species data for ${name}:`, speciesError);
        setPokemonSpecies(null);
      } finally {
        setLoadingSpecies(false);
      }
    } catch (error) {
      // Simplified logging - this is expected behavior
      // Enhanced Pokemon ID mapping for better demo experience
      const pokemonIdMap: {[key: string]: number} = {
        'pikachu': 25, 'charizard': 6, 'blastoise': 9, 'venusaur': 3,
        'alakazam': 65, 'gengar': 94, 'gyarados': 130, 'dragonite': 149, 
        'mewtwo': 150, 'mew': 151, 'typhlosion': 157, 'scizor': 212, 'tyranitar': 248,
        'lugia': 249, 'ho-oh': 250, 'celebi': 251, 'blaziken': 257,
        'salamence': 373, 'metagross': 376, 'rayquaza': 384, 'garchomp': 445, 
        'lucario': 448, 'dialga': 483, 'reshiram': 643, 'greninja': 658,
        'xerneas': 716, 'yveltal': 717, 'decidueye': 724, 'corviknight': 823,
        'dragapult': 887, 'tandemaus': 924, 'gholdengo': 1000, 'iron-valiant': 1006,
        'giratina-origin': 10007, 'zygarde-complete': 10118
      };
      const pokemonId = pokemonIdMap[name] || 1;
      const demoDetail = {
        id: pokemonId,
        name: name,
        height: 40,
        weight: 60,
        sprites: {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
          back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`,
          front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`,
          back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${pokemonId}.png`,
          front_female: (pokemonId === 25 || pokemonId === 130 || pokemonId === 212) ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/female/${pokemonId}.png` : null,
          back_female: (pokemonId === 25 || pokemonId === 130 || pokemonId === 212) ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/female/${pokemonId}.png` : null,
          front_shiny_female: (pokemonId === 25 || pokemonId === 130 || pokemonId === 212) ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/female/${pokemonId}.png` : null,
          back_shiny_female: (pokemonId === 25 || pokemonId === 130 || pokemonId === 212) ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/female/${pokemonId}.png` : null,
          other: {
            'official-artwork': {
              front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
              front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonId}.png`
            },
            home: {
              front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`,
              front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`,
              front_female: (pokemonId === 25 || pokemonId === 130 || pokemonId === 212) ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/female/${pokemonId}.png` : null,
              front_shiny_female: (pokemonId === 25 || pokemonId === 130 || pokemonId === 212) ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/female/${pokemonId}.png` : null
            }
          },
          versions: {
            'generation-i': {
              'red-blue': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/${pokemonId}.png`,
                front_gray: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/${pokemonId}.png`,
                back_gray: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/gray/${pokemonId}.png`,
                front_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/${pokemonId}.png`,
                back_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/transparent/${pokemonId}.png`
              },
              yellow: {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/back/${pokemonId}.png`,
                front_gray: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/gray/${pokemonId}.png`,
                back_gray: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/back/gray/${pokemonId}.png`,
                front_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/${pokemonId}.png`,
                back_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/back/transparent/${pokemonId}.png`
              }
            },
            'generation-ii': {
              gold: {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/back/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/shiny/${pokemonId}.png`,
                back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/back/shiny/${pokemonId}.png`,
                front_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/transparent/${pokemonId}.png`
              },
              silver: {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/back/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/shiny/${pokemonId}.png`,
                back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/back/shiny/${pokemonId}.png`,
                front_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/transparent/${pokemonId}.png`
              },
              crystal: {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/shiny/${pokemonId}.png`,
                back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/shiny/${pokemonId}.png`,
                front_shiny_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/shiny/transparent/${pokemonId}.png`,
                back_shiny_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/shiny/transparent/${pokemonId}.png`,
                front_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/${pokemonId}.png`,
                back_transparent: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/transparent/${pokemonId}.png`
              }
            },
            'generation-iii': {
              'ruby-sapphire': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/back/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/shiny/${pokemonId}.png`,
                back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/back/shiny/${pokemonId}.png`
              },
              emerald: {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/shiny/${pokemonId}.png`
              },
              'firered-leafgreen': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/back/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/shiny/${pokemonId}.png`,
                back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/back/shiny/${pokemonId}.png`
              }
            },
            'generation-iv': {
              'diamond-pearl': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/shiny/${pokemonId}.png`,
                back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/shiny/${pokemonId}.png`,
                front_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/female/${pokemonId}.png`,
                back_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/female/${pokemonId}.png`,
                front_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/shiny/female/${pokemonId}.png`,
                back_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/shiny/female/${pokemonId}.png`
              },
              platinum: {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/shiny/${pokemonId}.png`,
                back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/shiny/${pokemonId}.png`,
                front_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/female/${pokemonId}.png`,
                back_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/female/${pokemonId}.png`,
                front_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/shiny/female/${pokemonId}.png`,
                back_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/shiny/female/${pokemonId}.png`
              },
              'heartgold-soulsilver': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/shiny/${pokemonId}.png`,
                back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/shiny/${pokemonId}.png`,
                front_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/female/${pokemonId}.png`,
                back_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/female/${pokemonId}.png`,
                front_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/shiny/female/${pokemonId}.png`,
                back_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/shiny/female/${pokemonId}.png`
              }
            },
            'generation-v': {
              'black-white': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${pokemonId}.png`,
                back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/shiny/${pokemonId}.png`,
                back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/shiny/${pokemonId}.png`,
                front_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/female/${pokemonId}.png`,
                back_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/female/${pokemonId}.png`,
                front_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/shiny/female/${pokemonId}.png`,
                back_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/shiny/female/${pokemonId}.png`,
                animated: {
                  front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemonId}.gif`,
                  back_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${pokemonId}.gif`,
                  front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${pokemonId}.gif`,
                  back_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/shiny/${pokemonId}.gif`,
                  front_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/female/${pokemonId}.gif`,
                  back_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/female/${pokemonId}.gif`,
                  front_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/female/${pokemonId}.gif`,
                  back_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/shiny/female/${pokemonId}.gif`
                }
              }
            },
            'generation-vi': {
              'x-y': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/shiny/${pokemonId}.png`,
                front_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/female/${pokemonId}.png`,
                front_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/shiny/female/${pokemonId}.png`
              },
              'omegaruby-alphasapphire': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/shiny/${pokemonId}.png`,
                front_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/female/${pokemonId}.png`,
                front_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/shiny/female/${pokemonId}.png`
              }
            },
            'generation-vii': {
              'ultra-sun-ultra-moon': {
                front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/${pokemonId}.png`,
                front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/shiny/${pokemonId}.png`,
                front_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/female/${pokemonId}.png`,
                front_shiny_female: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/shiny/female/${pokemonId}.png`
              }
            }
          }
        },
        types: getPokemonTypes(name),
        species: {
          name: name,
          url: `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`
        },
        stats: getPokemonStats(name),
        abilities: getPokemonAbilities(name)
      };
      
      console.log(`🎭 Created demo data for ${name} (ID: ${pokemonId})`);
      console.log(`🎯 Demo types:`, demoDetail.types);
      console.log(`📊 Demo stats:`, demoDetail.stats);
      
      try {
        setSelectedPokemon(demoDetail as any);
        // Reset female toggle if demo Pokemon doesn't have female sprites
        if (!hasFemaleSprites(demoDetail as any)) {
          setShowFemale(false);
        }
        setDetailModalVisible(true);
        console.log(`✅ Demo Pokemon ${name} loaded successfully, modal should be visible`);
      } catch (demoError) {
        console.error(`❌ Error setting demo Pokemon:`, demoError);
      }
    }
  };

  // Get the appropriate sprite based on all selected options
  const getCurrentSprite = (pokemon: PokemonDetail): string | null => {
    console.log('Getting sprite for:', pokemon.name, 'version:', selectedVersion);

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
    
    console.log('🔍 Sprite options:', {
      generation: selectedGameVersion.generation,
      game: selectedGameVersion.value,
      variant,
      animated: isAnimated
    });
    
    const sprite = getSprite(pokemon.sprites, {
      generation: selectedGameVersion.generation,
      game: selectedGameVersion.value as SpriteGame,
      variant,
      animated: isAnimated
    });
    
    console.log('📸 Found sprite:', sprite);
    
    // If no sprite found, try direct access to demo data structure
    if (!sprite && pokemon.sprites.versions) {
      console.log('🔧 Trying direct sprite access...');
      
      const generation = selectedGameVersion.generation;
      const game = selectedGameVersion.value;
      
      // Direct access to demo data versions
      if (generation && game && generation !== 'default' && pokemon.sprites.versions && pokemon.sprites.versions[generation as keyof typeof pokemon.sprites.versions]) {
        const genSprites = pokemon.sprites.versions[generation as keyof typeof pokemon.sprites.versions];
        if (genSprites && genSprites[game as keyof typeof genSprites]) {
          const gameSprites = genSprites[game as keyof typeof genSprites] as any;
          const directSprite = gameSprites?.[variant];
        
          console.log('🎯 Direct sprite found:', directSprite);
          if (directSprite) return directSprite;
        }
      }
    }
    
    // Final fallback with preference for generation-specific over modern
    if (!sprite) {
      console.log('⚠️ No generation sprite found, using fallback');
      
      // Try to get any sprite from the selected generation first
      if (pokemon.sprites.versions && selectedGameVersion.generation !== 'default') {
        const generation = selectedGameVersion.generation;
        if (!generation) return sprite;
        const genSprites = pokemon.sprites.versions[generation];
        if (genSprites) {
          const gameKeys = Object.keys(genSprites);
          for (const gameKey of gameKeys) {
            const gameSprites = (genSprites as any)[gameKey];
            if (gameSprites && gameSprites[variant]) {
              console.log(`🎲 Using ${gameKey} sprite as fallback`);
              return gameSprites[variant];
            }
          }
        }
      }
      
      // Ultimate fallback to basic sprites
      if (isShiny) {
        return showBack ? pokemon.sprites.back_shiny : pokemon.sprites.front_shiny;
      }
      return showBack ? pokemon.sprites.back_default : pokemon.sprites.front_default;
    }
    
    return sprite;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Pokémon by name or number..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          accessibilityLabel="Search Pokemon"
          accessibilityHint="Enter Pokemon name or number to filter the list"
        />
        {searchQuery.trim() && (
          <Text style={styles.searchResults}>
            {filteredPokemonList.length} Pokémon found
          </Text>
        )}
      </View>
      
      {/* Type Filters */}
      <View style={styles.typeFiltersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeFiltersContent}
        >
          {POKEMON_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeChip,
                selectedTypes.includes(type) && styles.typeChipSelected,
                { backgroundColor: getTypeColor(type) }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (selectedTypes.includes(type)) {
                  setSelectedTypes(selectedTypes.filter(t => t !== type));
                } else {
                  setSelectedTypes([...selectedTypes, type]);
                }
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedTypes.includes(type) }}
              accessibilityLabel={`${type} type filter`}
              accessibilityHint={`Filter Pokemon by ${type} type`}
            >
              <Text style={[
                styles.typeChipText,
                selectedTypes.includes(type) && styles.typeChipTextSelected
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {selectedTypes.length > 0 && (
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => setSelectedTypes([])}
            accessibilityRole="button"
            accessibilityLabel="Clear type filters"
          >
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Generation Filters */}
      <View style={styles.generationFiltersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.generationFiltersContent}
        >
          {/* Favorites Filter */}
          <TouchableOpacity
            style={[
              styles.generationChip,
              styles.favoritesChip,
              showOnlyFavorites && styles.generationChipSelected,
              { backgroundColor: showOnlyFavorites ? '#ef4444' : '#f3f4f6' }
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowOnlyFavorites(!showOnlyFavorites);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: showOnlyFavorites }}
            accessibilityLabel="Favorites filter"
            accessibilityHint="Show only your favorite Pokemon"
          >
            <Ionicons
              name="heart"
              size={16}
              color={showOnlyFavorites ? '#ffffff' : '#ef4444'}
              style={{ marginBottom: 2 }}
            />
            <Text style={[
              styles.generationChipText,
              { color: showOnlyFavorites ? '#ffffff' : '#374151' },
              showOnlyFavorites && styles.generationChipTextSelected
            ]}>
              Favorites
            </Text>
          </TouchableOpacity>
          {POKEMON_GENERATIONS.map(generation => (
            <TouchableOpacity
              key={generation.name}
              style={[
                styles.generationChip,
                selectedGenerations.includes(generation.name) && styles.generationChipSelected,
                { backgroundColor: generation.color }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (selectedGenerations.includes(generation.name)) {
                  setSelectedGenerations(selectedGenerations.filter(g => g !== generation.name));
                } else {
                  setSelectedGenerations([...selectedGenerations, generation.name]);
                }
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedGenerations.includes(generation.name) }}
              accessibilityLabel={`${generation.name} generation filter`}
              accessibilityHint={`Filter Pokemon from ${generation.label} region`}
            >
              <Text style={[
                styles.generationChipText,
                selectedGenerations.includes(generation.name) && styles.generationChipTextSelected
              ]}>
                {generation.name}
              </Text>
              <Text style={styles.generationChipSubtext}>
                {generation.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {selectedGenerations.length > 0 && (
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => setSelectedGenerations([])}
            accessibilityRole="button"
            accessibilityLabel="Clear generation filters"
          >
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        ref={flatListRef}
        data={filteredPokemonList}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        numColumns={1}
        style={{ flex: 1, paddingHorizontal: 16, backgroundColor: '#f9fafb' }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            title="Pull to refresh Pokemon data"
            titleColor="#6b7280"
          />
        }
        renderItem={({ item }) => (
          <AnimatedPokemonCard
            item={item}
            onPress={() => handlePokemonSelect(item.name)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            getMiniSpriteUrl={getMiniSpriteUrl}
          />
        )}
        onEndReached={() => fetchPokemons((page + 1) * 20)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size='large'
                color='#3b82f6'
              />
              <Text style={styles.loadingText}>Loading more Pokémon... ⚡</Text>
            </View>
          ) : null
        }
      />

      {/* Pokémon Detail Modal */}
      <Modal
        animationType='slide'
        transparent={false}
        visible={detailModalVisible}
        onRequestClose={() => {
          setDetailModalVisible(false);
          setPokemonSpecies(null);
          setEvolutionChain(null);
          setShowVersionPicker(false);
          setSelectedForm(null);
          setAvailableForms(null);
        }}
      >
        {selectedPokemon ? (
          <SafeAreaView style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setDetailModalVisible(false);
                setPokemonSpecies(null);
                setEvolutionChain(null);
                setShowVersionPicker(false);
                setSelectedForm(null);
                setAvailableForms(null);
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.pokemonTitle}>
                #{selectedPokemon.id} {selectedPokemon.name}
              </Text>

              {/* Pokemon Forms Selector */}
              {availableForms && availableForms.forms.length > 1 && (
                <View style={styles.formsSection}>
                  <Text style={styles.formsSectionTitle}>Available Forms</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.formsContainer}
                    style={{ maxHeight: 150 }}
                  >
                    {availableForms.forms.map((form) => (
                      <TouchableOpacity
                        key={form.id}
                        style={[
                          styles.formCard,
                          selectedForm?.id === form.id && styles.selectedFormCard
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setSelectedForm(form);
                          console.log(`🔄 Form changed to: ${form.displayName}`);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Switch to ${form.displayName}`}
                        accessibilityHint={`Changes to ${form.displayName} form with different stats and abilities`}
                      >
                        <Image
                          source={{ uri: form.spriteUrl || form.artworkUrl }}
                          style={styles.formSprite}
                          resizeMode="contain"
                        />
                        <Text style={[
                          styles.formName,
                          selectedForm?.id === form.id && styles.selectedFormName
                        ]}>
                          {form.displayName}
                        </Text>
                        <View style={styles.formTypeContainer}>
                          <Text style={styles.formType}>
                            {form.formType === 'base' ? 'Original' : 
                             form.formType === 'regional' ? form.region :
                             form.formType === 'mega' ? 'Mega' :
                             form.formType === 'gigantamax' ? 'G-Max' :
                             form.formType.charAt(0).toUpperCase() + form.formType.slice(1)}
                          </Text>
                          {form.introduced && (
                            <Text style={styles.formIntroduced}>{form.introduced}</Text>
                          )}
                        </View>
                        
                        {/* Type indicators */}
                        <View style={styles.formTypes}>
                          {form.types.map((type, index) => (
                            <View 
                              key={index}
                              style={[
                                styles.formTypeChip,
                                { backgroundColor: getTypeColor(type) }
                              ]}
                            >
                              <Text style={styles.formTypeText}>
                                {type.toUpperCase()}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Display the selected sprite */}
              <Image
                key={`${selectedPokemon.name}-${selectedForm?.id || 'base'}-${selectedVersion}-${isShiny}-${showBack}-${showFemale}`}
                source={{ 
                  uri: selectedForm?.spriteUrl || selectedForm?.artworkUrl || 
                       getCurrentSprite(selectedPokemon) || 
                       selectedPokemon.sprites.front_default || undefined 
                }}
                style={styles.pokemonSprite}
                resizeMode='contain'
                onError={() => {
                  console.log('🖼️ Image failed to load, will automatically try fallbacks on next render');
                  // The image component will automatically retry with fallback logic
                }}
                onLoad={() => {
                  console.log('✅ Image loaded successfully:', getCurrentSprite(selectedPokemon));
                }}
              />

              {/* Sprite Controls - Right in the modal! */}
              <View style={styles.spriteControls}>
                <Text style={styles.controlsTitle}>Sprite Options</Text>
                
                {/* Sprite Version Dropdown */}
                <View style={styles.dropdownSection}>
                  <Text style={styles.controlLabel}>Version:</Text>
                  <TouchableOpacity 
                    style={styles.customDropdown}
                    onPress={() => setShowVersionPicker(!showVersionPicker)}
                  >
                    <Text style={styles.dropdownText}>
                      {gameVersions.find(v => v.value === selectedVersion)?.label || 'Select Version'}
                    </Text>
                    <Text style={styles.dropdownArrow}>{showVersionPicker ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  
                  {showVersionPicker && (
                    <View style={styles.dropdownList}>
                      <ScrollView 
                        style={styles.dropdownScroll} 
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                      >
                        {gameVersions.map((version) => {
                          // Check if this version has available sprites for current Pokemon
                          const hasSprites = selectedPokemon && getSprite(selectedPokemon.sprites, {
                            generation: version.generation,
                            game: version.value as any,
                            variant: 'front_default'
                          });
                          
                          return (
                            <TouchableOpacity
                              key={version.value}
                              style={[
                                styles.dropdownItem,
                                selectedVersion === version.value && styles.selectedItem,
                                !hasSprites && version.value !== 'best' && styles.disabledItem
                              ]}
                              onPress={() => {
                                console.log(`🎮 Version selected: ${version.label} (${version.value})`);
                                setSelectedVersion(version.value);
                                setShowVersionPicker(false);
                                console.log(`📱 State updated, selectedVersion is now: ${version.value}`);
                              }}
                              disabled={!hasSprites && version.value !== 'best'}
                            >
                              <Text style={[
                                styles.dropdownItemText,
                                selectedVersion === version.value && styles.selectedItemText,
                                !hasSprites && version.value !== 'best' && styles.disabledItemText
                              ]}>
                                {version.label}
                                {!hasSprites && version.value !== 'best' && ' (N/A)'}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Toggle Controls */}
                <View style={styles.quickToggles}>
                  <Text style={styles.togglesTitle}>Display Options</Text>
                  {(() => {
                    const availableOptions = getAvailableOptions(selectedVersion);
                    const showShiny = availableOptions.shiny;
                    const showBackOption = availableOptions.back;
                    
                    // Create toggles array based on available options
                    const toggles = [];
                    
                    if (showShiny) {
                      toggles.push(
                        <View key="shiny" style={styles.toggleItem}>
                          <Text style={styles.toggleLabel}>✨ Shiny</Text>
                          <Switch
                            value={isShiny}
                            onValueChange={(value) => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setIsShiny(value);
                            }}
                            trackColor={{ false: '#ccc', true: '#FFD700' }}
                            thumbColor={isShiny ? '#FFA500' : '#f4f3f4'}
                          />
                        </View>
                      );
                    }
                    
                    if (showBackOption) {
                      toggles.push(
                        <View key="back" style={styles.toggleItem}>
                          <Text style={styles.toggleLabel}>🔄 Back</Text>
                          <Switch
                            value={showBack}
                            onValueChange={(value) => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              setShowBack(value);
                            }}
                            trackColor={{ false: '#ccc', true: '#4CAF50' }}
                            thumbColor={showBack ? '#2E7D32' : '#f4f3f4'}
                          />
                        </View>
                      );
                    }
                    
                    // Split toggles into rows of 2
                    const rows = [];
                    for (let i = 0; i < toggles.length; i += 2) {
                      rows.push(
                        <View key={i} style={styles.toggleRow}>
                          {toggles.slice(i, i + 2)}
                        </View>
                      );
                    }
                    
                    return rows;
                  })()}

                  {(() => {
                    const availableOptions = getAvailableOptions(selectedVersion);
                    const showFemaleOption = availableOptions.female && hasFemaleSprites(selectedPokemon);
                    
                    if (showFemaleOption) {
                      return (
                        <View style={styles.toggleRow}>
                          <View style={styles.toggleItem}>
                            <Text style={styles.toggleLabel}>♀️ Female</Text>
                            <Switch
                              value={showFemale}
                              onValueChange={(value) => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowFemale(value);
                              }}
                              trackColor={{ false: '#ccc', true: '#E91E63' }}
                              thumbColor={showFemale ? '#C2185B' : '#f4f3f4'}
                            />
                          </View>
                        </View>
                      );
                    }
                    return null;
                  })()}
                </View>
              </View>

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

              {/* Pokédex Information */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Pokédex Data</Text>
                
                {loadingSpecies ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text style={styles.loadingText}>Loading Pokédex data...</Text>
                  </View>
                ) : pokemonSpecies ? (
                  <>
                    {/* Species Category */}
                    <View style={styles.pokedexRow}>
                      <Text style={styles.pokedexLabel}>Species</Text>
                      <Text style={styles.pokedexValue}>
                        {getEnglishGenus(pokemonSpecies)}
                      </Text>
                    </View>
                    
                    {/* Habitat */}
                    {pokemonSpecies.habitat && (
                      <View style={styles.pokedexRow}>
                        <Text style={styles.pokedexLabel}>Habitat</Text>
                        <Text style={styles.pokedexValue}>
                          {pokemonSpecies.habitat.name.charAt(0).toUpperCase() + pokemonSpecies.habitat.name.slice(1)}
                        </Text>
                      </View>
                    )}
                    
                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.pokedexDescription}>
                        "{getEnglishDescription(pokemonSpecies)}"
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.noDataText}>Pokédex data unavailable</Text>
                )}
              </View>

              {/* Evolution Chain */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Evolution Chain</Text>
                
                {loadingEvolution ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text style={styles.loadingText}>Loading evolution data...</Text>
                  </View>
                ) : evolutionChain ? (() => {
                  const evolutions = parseEvolutionChain(evolutionChain);
                  return evolutions.length > 1 ? (
                    <View style={styles.evolutionContainer}>
                      {evolutions.map((evolution, index) => (
                        <React.Fragment key={evolution.id}>
                          <View style={styles.evolutionStage}>
                            <View style={styles.evolutionImageContainer}>
                              <Image
                                source={{
                                  uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`
                                }}
                                style={styles.evolutionImage}
                                resizeMode="contain"
                              />
                            </View>
                            <Text style={styles.evolutionName}>
                              {evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1)}
                            </Text>
                            <Text style={styles.evolutionId}>#{evolution.id}</Text>
                          </View>
                          
                          {index < evolutions.length - 1 && (
                            <View style={styles.evolutionArrow}>
                              <Ionicons name="arrow-forward" size={20} color="#6b7280" />
                              {evolution.level && (
                                <Text style={styles.evolutionTrigger}>Lv. {evolution.level}</Text>
                              )}
                              {evolution.item && (
                                <Text style={styles.evolutionTrigger}>
                                  {evolution.item.charAt(0).toUpperCase() + evolution.item.slice(1)}
                                </Text>
                              )}
                              {evolution.trigger && !evolution.level && !evolution.item && (
                                <Text style={styles.evolutionTrigger}>
                                  {evolution.trigger.charAt(0).toUpperCase() + evolution.trigger.slice(1)}
                                </Text>
                              )}
                            </View>
                          )}
                        </React.Fragment>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noDataText}>This Pokémon does not evolve</Text>
                  );
                })() : (
                  <Text style={styles.noDataText}>Evolution data unavailable</Text>
                )}
              </View>

              {/* Basic Info */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Physical Data</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.physicalDataText}>Height: {selectedPokemon.height / 10}m</Text>
                  <Text style={styles.physicalDataText}>Weight: {selectedPokemon.weight / 10}kg</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Base Stats</Text>
                {selectedPokemon.stats.map((stat, index) => (
                  <View
                    key={stat.stat.name}
                    style={styles.statRow}
                  >
                    <View style={styles.statNameContainer}>
                      <Text style={styles.statName}>
                        {formatStatName(stat.stat.name)}
                      </Text>
                      {stat.base_stat >= 100 && (
                        <Text style={styles.statRank}>★</Text>
                      )}
                    </View>
                    <AnimatedStatBar
                      statName={stat.stat.name}
                      statValue={stat.base_stat}
                      delay={index * 100}
                    />
                    <Text style={[
                      styles.statValue,
                      stat.base_stat >= 100 && styles.highStatValue
                    ]}>
                      {stat.base_stat}
                    </Text>
                  </View>
                ))}
                
                {/* Total Stats */}
                <View style={[styles.statRow, styles.totalStatRow]}>
                  <Text style={[styles.statName, styles.totalStatName]}>Total</Text>
                  <View style={styles.statBarContainer} />
                  <Text style={[styles.statValue, styles.totalStatValue]}>
                    {selectedPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                  </Text>
                </View>
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

      {/* Settings Modal */}
      <Modal
        animationType='slide'
        transparent={false}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSettingsModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.settingsModalContent}>
            <Text style={styles.settingsTitle}>Pokédex Settings</Text>
            
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Mini Sprite Style</Text>
              <Text style={styles.settingDescription}>
                Choose the sprite style for Pokemon in the list
              </Text>
              
              <View style={styles.spriteStyleOptions}>
                <TouchableOpacity
                  style={[
                    styles.spriteStyleOption,
                    spriteStyle === 'party' && styles.selectedSpriteStyle
                  ]}
                  onPress={() => setSpriteStyle('party')}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: spriteStyle === 'party' }}
                  accessibilityLabel="Party and Box icons style"
                  accessibilityHint="Classic party and PC box icons from Gen 3-8"
                >
                  <Text style={[
                    styles.spriteStyleText,
                    spriteStyle === 'party' && styles.selectedSpriteStyleText
                  ]}>📦 Party/Box Icons</Text>
                  <Text style={styles.spriteStyleSubtext}>Classic Gen 3-8 style</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.spriteStyleOption,
                    spriteStyle === 'animated' && styles.selectedSpriteStyle
                  ]}
                  onPress={() => setSpriteStyle('animated')}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: spriteStyle === 'animated' }}
                  accessibilityLabel="Animated Gen 5 style"
                  accessibilityHint="Animated pixel sprites from Black and White"
                >
                  <Text style={[
                    styles.spriteStyleText,
                    spriteStyle === 'animated' && styles.selectedSpriteStyleText
                  ]}>🕹️ Gen 5 Animated</Text>
                  <Text style={styles.spriteStyleSubtext}>Black/White pixel animations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.spriteStyleOption,
                    spriteStyle === 'home' && styles.selectedSpriteStyle
                  ]}
                  onPress={() => setSpriteStyle('home')}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: spriteStyle === 'home' }}
                  accessibilityLabel="Pokemon HOME style"
                  accessibilityHint="Modern HD sprites"
                >
                  <Text style={[
                    styles.spriteStyleText,
                    spriteStyle === 'home' && styles.selectedSpriteStyleText
                  ]}>🏠 Pokémon HOME</Text>
                  <Text style={styles.spriteStyleSubtext}>Modern HD sprites</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.spriteStyleOption,
                    spriteStyle === 'gen9' && styles.selectedSpriteStyle
                  ]}
                  onPress={() => setSpriteStyle('gen9')}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: spriteStyle === 'gen9' }}
                  accessibilityLabel="Official Artwork style"
                  accessibilityHint="High-quality illustrations"
                >
                  <Text style={[
                    styles.spriteStyleText,
                    spriteStyle === 'gen9' && styles.selectedSpriteStyleText
                  ]}>🎨 Official Artwork</Text>
                  <Text style={styles.spriteStyleSubtext}>High-quality illustrations</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Animated.View style={styles.scrollToTopButton}>
          <TouchableOpacity
            onPress={scrollToTop}
            style={styles.scrollToTopButtonInner}
            accessibilityRole="button"
            accessibilityLabel="Scroll to top"
            accessibilityHint="Scroll to the top of the Pokemon list"
          >
            <Ionicons name="chevron-up" size={24} color="#ffffff" />
          </TouchableOpacity>
        </Animated.View>
      )}
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
    backgroundColor: '#f9fafb',
  },
  // Search Bar Styles
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    height: 44,
    backgroundColor: '#f3f4f6',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  searchResults: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Type Filter Styles
  typeFiltersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  typeFiltersContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    opacity: 0.7,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeChipSelected: {
    opacity: 1,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeChipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  typeChipTextSelected: {
    fontWeight: '700',
  },
  clearFiltersButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearFiltersText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  // Generation Filter Styles
  generationFiltersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  generationFiltersContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  generationChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 16,
    opacity: 0.7,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
    alignItems: 'center',
  },
  generationChipSelected: {
    opacity: 1,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  generationChipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  generationChipTextSelected: {
    fontWeight: '800',
  },
  generationChipSubtext: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  favoritesChip: {
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  // New Pokemon List Styles
  pokemonListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  pokemonNumber: {
    color: '#9ca3af',
    fontWeight: 'bold',
    fontSize: 18,
    width: 64,
    textAlign: 'center',
  },
  miniSpriteContainer: {
    width: 64,
    height: 64,
    marginRight: 16,
    marginLeft: 8,
  },
  miniSprite: {
    width: '100%',
    height: '100%',
  },
  pokemonNameContainer: {
    flex: 1,
  },
  pokemonListName: {
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: 20,
    textTransform: 'capitalize',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  arrowIndicator: {
    color: '#9ca3af',
    fontSize: 24,
    fontWeight: '300',
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  spriteControls: {
    backgroundColor: 'transparent',
    marginVertical: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  controlsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  dropdownSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  customDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ced4da',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 46,
  },
  dropdownText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: '#ced4da',
    borderRadius: 10,
    backgroundColor: '#fff',
    maxHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#374151',
  },
  selectedItemText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  dropdownScroll: {
    maxHeight: 150,
  },
  disabledItem: {
    backgroundColor: '#f8f9fa',
    opacity: 0.6,
  },
  disabledItemText: {
    color: '#adb5bd',
    fontStyle: 'italic',
  },
  quickToggles: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  togglesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  toggleItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    minHeight: 56,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.2,
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
  statNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textTransform: 'capitalize',
  },
  statRank: {
    fontSize: 14,
    color: '#fbbf24',
    marginLeft: 4,
  },
  highStatValue: {
    color: '#059669',
    fontWeight: '700',
  },
  statBarContainer: {
    flex: 2,
    marginHorizontal: 10,
  },
  statBarBackground: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  totalStatRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalStatName: {
    fontWeight: '700',
    color: '#1f2937',
  },
  totalStatValue: {
    fontWeight: '700',
    color: '#1f2937',
  },
  // Pokédex Information Styles
  pokedexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  pokedexLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    flex: 1,
  },
  pokedexValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 2,
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  descriptionContainer: {
    marginTop: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  pokedexDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    fontStyle: 'italic',
  },
  noDataText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 8,
  },
  physicalDataText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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
  // Settings Modal Styles
  settingsModalContent: {
    padding: 20,
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  settingSection: {
    marginBottom: 30,
  },
  settingLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  spriteStyleOptions: {
    gap: 12,
  },
  spriteStyleOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  selectedSpriteStyle: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  spriteStyleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedSpriteStyleText: {
    color: '#1976d2',
  },
  spriteStyleSubtext: {
    fontSize: 14,
    color: '#666',
  },
  
  // Evolution Chain Styles
  evolutionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  evolutionStage: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  evolutionImageContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#f9fafb',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  evolutionImage: {
    width: 48,
    height: 48,
  },
  evolutionName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 2,
  },
  evolutionId: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  evolutionArrow: {
    alignItems: 'center',
    marginHorizontal: 4,
    paddingVertical: 8,
  },
  evolutionTrigger: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
  },
  
  // Scroll to Top Button Styles
  scrollToTopButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  scrollToTopButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Pokemon Forms Styles
  formsSection: {
    marginVertical: 16,
    paddingHorizontal: 16,
    maxHeight: 180,
  },
  formsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  formsContainer: {
    paddingHorizontal: 8,
  },
  formCard: {
    width: 140,
    maxHeight: 160,
    marginHorizontal: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedFormCard: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    elevation: 6,
  },
  formSprite: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  formName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
  },
  selectedFormName: {
    color: '#1d4ed8',
  },
  formTypeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  formType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    textAlign: 'center',
  },
  formIntroduced: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
    textAlign: 'center',
  },
  formTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  formTypeChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 35,
  },
  formTypeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default PokedexView;
