// src/components/PokemonList.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

// Define types for our API responses
interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
}

// New interface for list items with sprites
interface PokemonListItem {
  name: string;
  url: string;
  sprite?: string;
  id?: number;
}

const BASE_URL = 'https://pokeapi.co/api/v2';

const PokemonList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  // Extract Pokemon ID from URL
  const extractPokemonId = (url: string): number => {
    const pattern = /\/pokemon\/(\d+)\//;
    const match = url.match(pattern);
    return match ? parseInt(match[1]) : 0;
  };

  // Get sprite URL from Pokemon ID
  const getSpriteUrl = (id: number): string => {
    // return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return `https://www.serebii.net/pokedex-sv/icon/${id}.png`;
  };

  const fetchPokemon = async (
    url = `${BASE_URL}/pokemon?limit=20&offset=0`
  ) => {
    try {
      const response = await axios.get<PokemonListResponse>(url);

      // Transform the results to include sprite URLs
      const enhancedResults = response.data.results.map((pokemon) => {
        const id = extractPokemonId(pokemon.url);
        return {
          ...pokemon,
          sprite: getSpriteUrl(id),
          id: id,
        };
      });

      if (url === `${BASE_URL}/pokemon?limit=20&offset=0`) {
        // Initial load
        setPokemonList(enhancedResults);
      } else {
        // Loading more
        setPokemonList((prevList) => [...prevList, ...enhancedResults]);
      }

      setNextUrl(response.data.next);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const handleLoadMore = () => {
    if (nextUrl && !loadingMore) {
      setLoadingMore(true);
      fetchPokemon(nextUrl);
    }
  };

  const handlePokemonSelect = async (name: string) => {
    setLoadingDetail(true);
    try {
      const response = await axios.get<PokemonDetail>(
        `${BASE_URL}/pokemon/${name}`
      );
      setSelectedPokemon(response.data);
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size='large'
          color='#0000ff'
        />
        <Text>Loading Pokémon...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handlePokemonSelect(item.name)}
          >
            <View style={styles.listItemContent}>
              <Image
                source={{ uri: item.sprite }}
                style={styles.listItemSprite}
              />
              <View style={styles.listItemDetails}>
                <Text style={styles.pokemonName}>{item.name}</Text>
                <Text style={styles.pokemonId}>
                  #{item.id?.toString().padStart(3, '0')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator
                size='small'
                color='#0000ff'
              />
              <Text>Loading more Pokémon...</Text>
            </View>
          ) : null
        }
      />

      {loadingDetail && (
        <View style={styles.detailLoader}>
          <ActivityIndicator
            size='small'
            color='#0000ff'
          />
        </View>
      )}

      {selectedPokemon && !loadingDetail && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailTitle}>{selectedPokemon.name}</Text>
          <Image
            source={{ uri: selectedPokemon.sprites.front_default }}
            style={styles.pokemonImage}
          />
          <Text>Height: {selectedPokemon.height / 10}m</Text>
          <Text>Weight: {selectedPokemon.weight / 10}kg</Text>
          <Text>
            Types: {selectedPokemon.types.map((t) => t.type.name).join(', ')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemSprite: {
    width: 50,
    height: 50,
  },
  listItemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  pokemonName: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: '500',
  },
  pokemonId: {
    color: '#666',
    fontSize: 14,
  },
  detailLoader: {
    margin: 20,
    alignItems: 'center',
  },
  detailContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  pokemonImage: {
    width: 150,
    height: 150,
  },
  footerLoader: {
    padding: 10,
    alignItems: 'center',
  },
});

export default PokemonList;
