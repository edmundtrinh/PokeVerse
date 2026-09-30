// src/components/pokedex/PokeBallSelector.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { POKEBALL_TYPES, PokeBall } from '../../contexts/UserContext';

interface PokeBallSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (ballType: string) => void;
  selectedBall?: string;
  pokemonName: string;
}

const PokeBallSelector: React.FC<PokeBallSelectorProps> = ({
  visible,
  onClose,
  onSelect,
  selectedBall,
  pokemonName,
}) => {
  const [tempSelected, setTempSelected] = useState(selectedBall || '');

  const renderPokeBall = ({ item }: { item: PokeBall }) => {
    const isSelected = tempSelected === item.id;

    return (
      <TouchableOpacity
        style={[styles.ballOption, isSelected && styles.selectedBallOption]}
        onPress={() => setTempSelected(item.id)}
      >
        <View style={[styles.ballIcon, { backgroundColor: item.color }]}>
          <Text style={styles.ballEmoji}>{item.icon}</Text>
        </View>
        <View style={styles.ballInfo}>
          <Text style={styles.ballName}>{item.name}</Text>
          <Text style={styles.ballDescription}>
            {getBallDescription(item.id)}
          </Text>
        </View>
        {isSelected && (
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
        )}
      </TouchableOpacity>
    );
  };

  const getBallDescription = (ballId: string): string => {
    const descriptions: { [key: string]: string } = {
      pokeball: 'The classic choice for any trainer',
      greatball: 'Better catch rate than a Poké Ball',
      ultraball: 'Superior performance for rare Pokémon',
      masterball: 'Never fails to catch any Pokémon',
      luxuryball: 'Makes Pokémon more friendly',
      premierball: 'A commemorative ball with special meaning',
      timerball: 'More effective as battle goes longer',
      repeatball: 'More effective on previously caught species',
    };
    return descriptions[ballId] || 'A special Poké Ball';
  };

  const handleConfirm = () => {
    if (tempSelected) {
      onSelect(tempSelected);
    }
    onClose();
  };

  const handleRelease = () => {
    onSelect('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Catch {pokemonName}</Text>
          <TouchableOpacity onPress={handleConfirm} disabled={!tempSelected}>
            <Text style={[styles.confirmButton, !tempSelected && styles.disabledButton]}>
              Catch
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.instruction}>
            Choose the Poké Ball you used to catch this Pokémon:
          </Text>

          <FlatList
            data={POKEBALL_TYPES}
            renderItem={renderPokeBall}
            keyExtractor={(item) => item.id}
            style={styles.ballsList}
            showsVerticalScrollIndicator={false}
          />

          {selectedBall && (
            <TouchableOpacity style={styles.releaseButton} onPress={handleRelease}>
              <MaterialIcons name="delete" size={20} color="#f44336" />
              <Text style={styles.releaseButtonText}>Release {pokemonName}</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '600',
  },
  disabledButton: {
    color: '#ccc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  ballsList: {
    flex: 1,
  },
  ballOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedBallOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  ballIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  ballEmoji: {
    fontSize: 24,
  },
  ballInfo: {
    flex: 1,
  },
  ballName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ballDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  releaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  releaseButtonText: {
    fontSize: 16,
    color: '#f44336',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default PokeBallSelector;