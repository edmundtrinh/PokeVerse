import 'react-native-gesture-handler'; // This must be the first import
import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
// import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { SafeAreaView, StyleSheet, StatusBar, Text, View } from 'react-native';
import PokedexView from './src/components/pokedex/PokedexView';

// Create placeholder screens for new features
const PokedexScreen = () => (
  <SafeAreaView style={[styles.container, { flex: 1 }]}>
    <PokedexView />
  </SafeAreaView>
);
const TradingCardsScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Trading Cards Feature Coming Soon!</Text>
  </View>
);

const TeamBuilderScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Showdown Team Builder Coming Soon!</Text>
  </View>
);

const Drawer = createDrawerNavigator();

export default function App() {
  const navigationRef = useNavigationContainerRef();
  // useReactNavigationDevTools(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='#f44336'
      />
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f44336',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerActiveTintColor: '#f44336',
          drawerInactiveTintColor: '#666',
        }}
      >
        <Drawer.Screen
          name='Pokédex'
          component={PokedexScreen}
          options={{
            title: 'PokéVerse - Pokédex',
          }}
        />
        <Drawer.Screen
          name='Trading Cards'
          component={TradingCardsScreen}
          options={{
            title: 'PokéVerse - Trading Cards',
          }}
        />
        <Drawer.Screen
          name='Team Builder'
          component={TeamBuilderScreen}
          options={{
            title: 'PokéVerse - Team Builder',
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
