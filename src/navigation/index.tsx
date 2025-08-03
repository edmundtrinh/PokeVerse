// src/navigation/index.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons'; // Keep if you want icons

// Import your screen components
import PokedexView from '../components/pokedex/PokedexView';
import TeamBuilder from '../components/teambuilder/TeamBuilder';
import DeckBuilder from '../components/tcg/DeckBuilder';

// Define the type for the drawer parameters (optional but good practice)
export type RootDrawerParamList = {
  Pokedex: undefined; // undefined means no params passed to the route
  DeckBuilder: undefined;
  TeamBuilder: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

/**
 * The main app navigator, which is a drawer navigator that contains the three main
 * screens of the app: Pokedex, DeckBuilder, and TeamBuilder.
 *
 * You can customize the appearance of the drawer by modifying the `screenOptions` prop.
 * The `initialRouteName` prop is used to set the default screen that is displayed
 * when the app is started.
 *
 * You can add more screens to the app by adding more `Drawer.Screen` components to
 * the navigator.
 */
const AppNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName='Pokedex' // Set the default screen
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f44336', // Example header color
        },
        headerTintColor: '#fff', // Header text/icon color
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#f44336', // Color for the active item in the drawer
        drawerLabelStyle: {
          marginLeft: -20, // Adjust label position if using icons
        },
      }}
    >
      <Drawer.Screen
        name='Pokedex'
        component={PokedexView}
        options={{
          title: 'Pokédex',
          // Example of adding an icon (requires Ionicons or another icon library)
          // drawerIcon: ({ color, size }) => (
          //   <Ionicons name="list" size={size} color={color} />
          // ),
        }}
      />
      <Drawer.Screen
        name='DeckBuilder'
        component={DeckBuilder} // Make sure this component exists and is imported
        options={{
          title: 'TCG Deck Builder',
          // drawerIcon: ({ color, size }) => (
          //   <Ionicons name="albums-outline" size={size} color={color} />
          // ),
        }}
      />
      <Drawer.Screen
        name='TeamBuilder'
        component={TeamBuilder}
        options={{
          title: 'Team Builder',
          // drawerIcon: ({ color, size }) => (
          //   <Ionicons name="people-outline" size={size} color={color} />
          // ),
        }}
      />
      {/* Add more screens here if needed */}
    </Drawer.Navigator>
  );
};

export default AppNavigator;
