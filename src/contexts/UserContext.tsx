// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PokeBall {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const POKEBALL_TYPES: PokeBall[] = [
  { id: 'pokeball', name: 'Poké Ball', color: '#ff0000', icon: '⚪' },
  { id: 'greatball', name: 'Great Ball', color: '#0066cc', icon: '🔵' },
  { id: 'ultraball', name: 'Ultra Ball', color: '#ffff00', icon: '🟡' },
  { id: 'masterball', name: 'Master Ball', color: '#800080', icon: '🟣' },
  { id: 'luxuryball', name: 'Luxury Ball', color: '#000000', icon: '⚫' },
  { id: 'premierball', name: 'Premier Ball', color: '#ffffff', icon: '⚪' },
  { id: 'timerball', name: 'Timer Ball', color: '#ff6600', icon: '🟠' },
  { id: 'repeatball', name: 'Repeat Ball', color: '#cc0000', icon: '🔴' },
];

export interface CaughtPokemon {
  pokemonId: string;
  pokemonName: string;
  ballType: string;
  dateSpotted?: string;
  dateCaught?: string;
  isShiny?: boolean;
}

export interface SavedBinder {
  id: string;
  name: string;
  color: string;
  tags: string[];
  gridSize: '2x2' | '3x3' | '4x3' | '4x4' | '5x5';
  cards: Array<{
    position: number;
    cardId: string;
    cardName: string;
    rarity: string;
    purchasePrice?: number;
    dateAdded: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const BINDER_COLORS = [
  { id: 'red', name: 'Fire Red', color: '#f44336' },
  { id: 'blue', name: 'Water Blue', color: '#2196f3' },
  { id: 'green', name: 'Grass Green', color: '#4caf50' },
  { id: 'yellow', name: 'Electric Yellow', color: '#ffeb3b' },
  { id: 'purple', name: 'Psychic Purple', color: '#9c27b0' },
  { id: 'orange', name: 'Fighting Orange', color: '#ff9800' },
  { id: 'pink', name: 'Fairy Pink', color: '#e91e63' },
  { id: 'brown', name: 'Ground Brown', color: '#795548' },
  { id: 'black', name: 'Dark Black', color: '#424242' },
  { id: 'silver', name: 'Steel Silver', color: '#9e9e9e' },
];

export const SUGGESTED_TAGS = [
  'Rare',
  'Holographic',
  'Secret Rare',
  'Vintage',
  'Modern',
  'Base Set',
  'Charizard',
  'Pikachu',
  'Favorites',
  'Investment',
  'Trade',
  'Japanese',
  'First Edition',
  'Shadowless',
  'PSA Graded',
  'Mint Condition',
  'Personal Collection',
  'Tournament',
  'Promo Cards',
  'Error Cards',
];

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  authProvider: 'apple' | 'google' | 'facebook' | 'email' | 'guest';
  avatar?: string;
  preferences: {
    defaultSpriteVersion: string;
    showShinyByDefault: boolean;
    enableHaptics: boolean;
    enablePriceTracking: boolean;
  };
  caughtPokemon: CaughtPokemon[];
  savedBinders: SavedBinder[];
  favorites: string[]; // Pokemon IDs
  createdAt: string;
}

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (provider: string, userData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  catchPokemon: (pokemon: CaughtPokemon) => Promise<void>;
  releasePokemon: (pokemonId: string) => Promise<void>;
  saveBinder: (binder: SavedBinder) => Promise<void>;
  deleteBinder: (binderId: string) => Promise<void>;
  toggleFavorite: (pokemonId: string) => Promise<void>;
  isPokemonCaught: (pokemonId: string) => boolean;
  isPokemonFavorite: (pokemonId: string) => boolean;
  getPokemonCatchInfo: (pokemonId: string) => CaughtPokemon | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_profile');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (userData: UserProfile) => {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const login = async (provider: string, userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: userData.id || Date.now().toString(),
      email: userData.email,
      displayName: userData.displayName || 'Trainer',
      authProvider: provider as any,
      avatar: userData.avatar,
      preferences: {
        defaultSpriteVersion: 'best',
        showShinyByDefault: false,
        enableHaptics: true,
        enablePriceTracking: false,
        ...userData.preferences,
      },
      caughtPokemon: [],
      savedBinders: [],
      favorites: [],
      createdAt: new Date().toISOString(),
      ...userData,
    };

    await saveUserData(newUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_profile');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updates,
      preferences: {
        ...user.preferences,
        ...updates.preferences,
      },
    };

    await saveUserData(updatedUser);
  };

  const catchPokemon = async (pokemon: CaughtPokemon) => {
    if (!user) return;

    const updatedCaught = user.caughtPokemon.filter(p => p.pokemonId !== pokemon.pokemonId);
    updatedCaught.push({
      ...pokemon,
      dateCaught: new Date().toISOString(),
    });

    await updateProfile({
      caughtPokemon: updatedCaught,
    });
  };

  const releasePokemon = async (pokemonId: string) => {
    if (!user) return;

    const updatedCaught = user.caughtPokemon.filter(p => p.pokemonId !== pokemonId);
    await updateProfile({
      caughtPokemon: updatedCaught,
    });
  };

  const saveBinder = async (binder: SavedBinder) => {
    if (!user) return;

    const updatedBinders = user.savedBinders.filter(b => b.id !== binder.id);
    updatedBinders.push({
      ...binder,
      updatedAt: new Date().toISOString(),
    });

    await updateProfile({
      savedBinders: updatedBinders,
    });
  };

  const deleteBinder = async (binderId: string) => {
    if (!user) return;

    const updatedBinders = user.savedBinders.filter(b => b.id !== binderId);
    await updateProfile({
      savedBinders: updatedBinders,
    });
  };

  const toggleFavorite = async (pokemonId: string) => {
    if (!user) return;

    let updatedFavorites = [...user.favorites];
    if (updatedFavorites.includes(pokemonId)) {
      updatedFavorites = updatedFavorites.filter(id => id !== pokemonId);
    } else {
      updatedFavorites.push(pokemonId);
    }

    await updateProfile({
      favorites: updatedFavorites,
    });
  };

  const isPokemonCaught = (pokemonId: string) => {
    return user?.caughtPokemon.some(p => p.pokemonId === pokemonId) || false;
  };

  const isPokemonFavorite = (pokemonId: string) => {
    return user?.favorites.includes(pokemonId) || false;
  };

  const getPokemonCatchInfo = (pokemonId: string) => {
    return user?.caughtPokemon.find(p => p.pokemonId === pokemonId);
  };

  const value: UserContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    catchPokemon,
    releasePokemon,
    saveBinder,
    deleteBinder,
    toggleFavorite,
    isPokemonCaught,
    isPokemonFavorite,
    getPokemonCatchInfo,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};