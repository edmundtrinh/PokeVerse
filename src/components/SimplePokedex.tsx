import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const simplePokemon = [
  { id: 1, name: 'Bulbasaur' },
  { id: 2, name: 'Ivysaur' }, 
  { id: 3, name: 'Venusaur' },
  { id: 4, name: 'Charmander' },
  { id: 5, name: 'Charmeleon' },
  { id: 6, name: 'Charizard' },
  { id: 25, name: 'Pikachu' },
  { id: 150, name: 'Mewtwo' }
];

const SimplePokedex = () => {
  const renderPokemon = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.name}>#{item.id} {item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokeVerse - Simple Test</Text>
      <FlatList
        data={simplePokemon}
        renderItem={renderPokemon}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#f44336',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 18,
  },
});

export default SimplePokedex;