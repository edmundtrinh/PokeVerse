// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';

// Import screens
import PokedexView from '../components/pokedex/PokedexView';
import TeamBuilder from '../components/teambuilder/TeamBuilder';
