// App.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, View } from 'react-native';
import PokemonList from './src/components/PokemonList';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PokeVerse</Text>
      </View>
      <PokemonList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  header: {
    backgroundColor: '#f44336',
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
