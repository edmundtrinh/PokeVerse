// src/components/tcg/TCGView.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BinderPlanner from './BinderPlanner';
import DeckBuilder from './DeckBuilder';
import SavedBinders from './SavedBinders';

type TCGMode = 'binder' | 'deckbuilder' | 'saved';

const TCGView: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<TCGMode>('binder');

  const renderModeSelector = () => (
    <View style={styles.modeSelector}>
      <TouchableOpacity
        style={[
          styles.modeButton,
          currentMode === 'binder' && styles.activeModeButton,
        ]}
        onPress={() => setCurrentMode('binder')}
      >
        <MaterialIcons
          name="view-module"
          size={18}
          color={currentMode === 'binder' ? 'white' : '#666'}
        />
        <Text
          style={[
            styles.modeButtonText,
            currentMode === 'binder' && styles.activeModeButtonText,
          ]}
        >
          Binder Planner
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          currentMode === 'saved' && styles.activeModeButton,
        ]}
        onPress={() => setCurrentMode('saved')}
      >
        <MaterialIcons
          name="folder"
          size={18}
          color={currentMode === 'saved' ? 'white' : '#666'}
        />
        <Text
          style={[
            styles.modeButtonText,
            currentMode === 'saved' && styles.activeModeButtonText,
          ]}
        >
          My Binders
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.modeButton,
          currentMode === 'deckbuilder' && styles.activeModeButton,
        ]}
        onPress={() => setCurrentMode('deckbuilder')}
      >
        <MaterialIcons
          name="library-books"
          size={18}
          color={currentMode === 'deckbuilder' ? 'white' : '#666'}
        />
        <Text
          style={[
            styles.modeButtonText,
            currentMode === 'deckbuilder' && styles.activeModeButtonText,
          ]}
        >
          Deck Builder
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderModeSelector()}

      {currentMode === 'binder' && <BinderPlanner />}
      {currentMode === 'saved' && <SavedBinders />}
      {currentMode === 'deckbuilder' && <DeckBuilder />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 3,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeModeButton: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  activeModeButtonText: {
    color: 'white',
  },
});

export default TCGView;