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

const BASE_URL = 'https://pokeapi.co/api/v2';

const PokemonList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<
    { name: string; url: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const fetchPokemon = async (
    url = `${BASE_URL}/pokemon?limit=20&offset=0`
  ) => {
    try {
      const response = await axios.get<PokemonListResponse>(url);

      if (url === `${BASE_URL}/pokemon?limit=20&offset=0`) {
        // Initial load
        setPokemonList(response.data.results);
      } else {
        // Loading more
        setPokemonList((prevList) => [...prevList, ...response.data.results]);
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
            <Text style={styles.pokemonName}>{item.name}</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pokemonName: {
    textTransform: 'capitalize',
    fontSize: 16,
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
