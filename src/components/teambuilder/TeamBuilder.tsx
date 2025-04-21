// src/components/teambuilder/TeamBuilder.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// Type definitions for team building
interface PokemonTeamMember {
  pokemonId: number;
  pokemonName: string;
  nickname?: string;
  ability: string;
  nature: string;
  item?: string;
  moves: string[];
  evs: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  ivs: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

const TeamBuilder: React.FC = () => {
  const [team, setTeam] = useState<PokemonTeamMember[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // Function to add a new team member
  const addTeamMember = () => {
    if (team.length < 6) {
      setTeam([
        ...team,
        {
          pokemonId: 0,
          pokemonName: '',
          ability: '',
          nature: 'Adamant', // Default nature
          moves: ['', '', '', ''],
          evs: {
            hp: 0,
            attack: 0,
            defense: 0,
            specialAttack: 0,
            specialDefense: 0,
            speed: 0,
          },
          ivs: {
            hp: 31,
            attack: 31,
            defense: 31,
            specialAttack: 31,
            specialDefense: 31,
            speed: 31,
          },
        },
      ]);
    }
  };

  // Function to update team member
  const updateTeamMember = (
    index: number,
    updatedMember: PokemonTeamMember
  ) => {
    const newTeam = [...team];
    newTeam[index] = updatedMember;
    setTeam(newTeam);
  };

  // Function to remove team member
  const removeTeamMember = (index: number) => {
    setTeam(team.filter((_, i) => i !== index));
    if (selectedSlot === index) {
      setSelectedSlot(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Builder</Text>

      {/* Team Slots */}
      <View style={styles.teamContainer}>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.teamSlot,
                selectedSlot === index && styles.selectedSlot,
                index < team.length ? styles.filledSlot : styles.emptySlot,
              ]}
              onPress={() => {
                if (index < team.length) {
                  setSelectedSlot(index);
                } else if (index === team.length) {
                  addTeamMember();
                  setSelectedSlot(index);
                }
              }}
            >
              {index < team.length ? (
                <Text style={styles.pokemonName}>
                  {team[index].pokemonName || 'Select Pokémon'}
                </Text>
              ) : (
                <Text style={styles.emptySlotText}>Empty</Text>
              )}
            </TouchableOpacity>
          ))}
      </View>

      {/* Pokemon Editor (would display when a slot is selected) */}
      {selectedSlot !== null && selectedSlot < team.length && (
        <PokemonEditor
          pokemon={team[selectedSlot]}
          onUpdate={(updatedPokemon) =>
            updateTeamMember(selectedSlot, updatedPokemon)
          }
          onRemove={() => removeTeamMember(selectedSlot)}
        />
      )}
    </View>
  );
};

// This would be a separate component
const PokemonEditor: React.FC<{
  pokemon: PokemonTeamMember;
  onUpdate: (pokemon: PokemonTeamMember) => void;
  onRemove: () => void;
}> = ({ pokemon, onUpdate, onRemove }) => {
  // Implementation of the Pokemon editor
  // Would include all customization options

  return <View style={styles.editorContainer}>{/* Editor UI here */}</View>;
};

const styles = StyleSheet.create({
  // Styles for the team builder
});

export default TeamBuilder;
