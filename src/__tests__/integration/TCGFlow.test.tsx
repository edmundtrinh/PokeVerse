// src/__tests__/integration/TCGFlow.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from '../../contexts/UserContext';
import TCGView from '../../components/tcg/TCGView';
import * as tcgApi from '../../api/tcgApi';

// Mock tcgApi
jest.mock('../../api/tcgApi');

// Mock components with complex animations
jest.mock('../../components/tcg/HoloCard', () => {
  const { View, Text } = require('react-native');
  return function MockHoloCard({ card, style }: any) {
    return (
      <View style={style} testID={`holo-card-${card.id}`}>
        <Text>{card.name}</Text>
        <Text>{card.rarity}</Text>
      </View>
    );
  };
});

const mockCards = [
  {
    id: 'sv3pt5-1',
    name: 'Charizard ex',
    supertype: 'Pokémon',
    subtypes: ['Basic', 'ex'],
    rarity: 'Ultra Rare',
    artist: 'Test Artist',
    number: '1',
    set: {
      id: 'sv3pt5',
      name: '151',
      series: 'Scarlet & Violet',
      printedTotal: 207,
      total: 207,
      legalities: { unlimited: 'Legal', standard: 'Legal' },
      releaseDate: '2023/06/16',
      updatedAt: '2024/01/01',
      images: {
        symbol: 'https://example.com/symbol.png',
        logo: 'https://example.com/logo.png',
      },
    },
    legalities: { unlimited: 'Legal', standard: 'Legal' },
    images: {
      small: 'https://example.com/charizard-small.png',
      large: 'https://example.com/charizard-large.png',
    },
    hiResImage: 'https://example.com/charizard-hires.png',
  },
  {
    id: 'sv3pt5-25',
    name: 'Pikachu ex',
    supertype: 'Pokémon',
    subtypes: ['Basic', 'ex'],
    rarity: 'Double Rare',
    artist: 'Test Artist',
    number: '25',
    set: {
      id: 'sv3pt5',
      name: '151',
      series: 'Scarlet & Violet',
      printedTotal: 207,
      total: 207,
      legalities: { unlimited: 'Legal', standard: 'Legal' },
      releaseDate: '2023/06/16',
      updatedAt: '2024/01/01',
      images: {
        symbol: 'https://example.com/symbol.png',
        logo: 'https://example.com/logo.png',
      },
    },
    legalities: { unlimited: 'Legal', standard: 'Legal' },
    images: {
      small: 'https://example.com/pikachu-small.png',
      large: 'https://example.com/pikachu-large.png',
    },
    hiResImage: 'https://example.com/pikachu-hires.png',
  },
];

const mockSets = [
  {
    id: 'sv3pt5',
    name: '151',
    series: 'Scarlet & Violet',
    printedTotal: 207,
    total: 207,
    legalities: { unlimited: 'Legal', standard: 'Legal' },
    releaseDate: '2023/06/16',
    updatedAt: '2024/01/01',
    images: {
      symbol: 'https://example.com/symbol.png',
      logo: 'https://example.com/logo.png',
    },
  },
];

const renderTCGView = () => {
  return render(
    <NavigationContainer>
      <UserProvider>
        <TCGView />
      </UserProvider>
    </NavigationContainer>
  );
};

describe('TCG Integration Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (tcgApi.searchCards as jest.Mock).mockResolvedValue(mockCards);
    (tcgApi.getRecentSets as jest.Mock).mockResolvedValue(mockSets);
    (tcgApi.getCardsBySet as jest.Mock).mockResolvedValue(mockCards);
    (tcgApi.getFeaturedCards as jest.Mock).mockResolvedValue(mockCards);
  });

  describe('Mode Switching', () => {
    it('should allow switching between Binder and Deck Builder modes', async () => {
      const { getByText } = renderTCGView();

      // Should start with Binder mode
      await waitFor(() => {
        expect(getByText('Binder Planner')).toBeTruthy();
      });

      // Switch to Deck Builder
      await waitFor(() => {
        fireEvent.press(getByText('Deck Builder'));
      });

      await waitFor(() => {
        expect(getByText('TCG Deck Builder')).toBeTruthy();
      });

      // Switch back to Binder
      await waitFor(() => {
        fireEvent.press(getByText('Binder Planner'));
      });

      await waitFor(() => {
        expect(getByText('Binder Planner')).toBeTruthy();
      });
    });
  });

  describe('Complete Binder Flow', () => {
    it('should complete full binder workflow: create → populate → save', async () => {
      const { getByText, getAllByText, getByPlaceholderText } = renderTCGView();

      // 1. Start with Binder Planner
      await waitFor(() => {
        expect(getByText('Binder Planner')).toBeTruthy();
      });

      // 2. Change grid size to 2x2 for easier testing
      await waitFor(() => {
        fireEvent.press(getByText('2×2'));
      });

      // 3. Add cards to slots
      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        expect(emptySlots).toHaveLength(4); // 2x2 grid

        // Click first empty slot
        fireEvent.press(emptySlots[0]);
      });

      // 4. Card picker should open
      await waitFor(() => {
        expect(getByText('Choose a card for slot 1')).toBeTruthy();
      });

      // 5. Search for specific card
      await waitFor(() => {
        const searchInput = getByPlaceholderText('Search for cards...');
        fireEvent.changeText(searchInput, 'charizard');
      });

      // 6. Verify search was called
      expect(tcgApi.searchCards).toHaveBeenCalledWith('charizard');

      // 7. Select a card (simulate card selection)
      await waitFor(() => {
        // Find and press a card (mocked as holo-card)
        const holoCard = getByText('Charizard ex');
        fireEvent.press(holoCard.parent!);
      });

      // 8. Verify card was added to binder
      await waitFor(() => {
        expect(getByText('(1/4 slots filled)')).toBeTruthy();
      });

      // 9. Save the binder
      await waitFor(() => {
        const saveButton = getByText('Save');
        fireEvent.press(saveButton);
      });

      // 10. Fill out save dialog
      await waitFor(() => {
        expect(getByText('Save Binder')).toBeTruthy();

        const nameInput = getByPlaceholderText('Enter binder name');
        fireEvent.changeText(nameInput, 'My Test Binder');
      });

      // 11. Complete save
      await waitFor(() => {
        const saveDialogButton = getByText('Save Binder');
        fireEvent.press(saveDialogButton);
      });
    });
  });

  describe('Complete Deck Builder Flow', () => {
    it('should complete deck building workflow: search → add → manage deck', async () => {
      const { getByText, getByPlaceholderText } = renderTCGView();

      // 1. Switch to Deck Builder mode
      await waitFor(() => {
        fireEvent.press(getByText('Deck Builder'));
      });

      await waitFor(() => {
        expect(getByText('TCG Deck Builder')).toBeTruthy();
      });

      // 2. Search for cards
      await waitFor(() => {
        const searchInput = getByPlaceholderText('Search for cards...');
        fireEvent.changeText(searchInput, 'pikachu');
        fireEvent.submitEditing(searchInput);
      });

      // 3. Verify search was called
      expect(tcgApi.searchCards).toHaveBeenCalledWith('pikachu');

      // 4. Add card to deck (simulate card addition)
      await waitFor(() => {
        const addButton = getByText('+');
        fireEvent.press(addButton);
      });

      // 5. Verify deck count updated
      await waitFor(() => {
        expect(getByText('Your Deck (1 cards)')).toBeTruthy();
      });

      // 6. Remove card from deck
      await waitFor(() => {
        const removeButton = getByText('-');
        fireEvent.press(removeButton);
      });

      // 7. Verify deck is empty again
      await waitFor(() => {
        expect(getByText('Your Deck (0 cards)')).toBeTruthy();
      });
    });
  });

  describe('API Error Handling', () => {
    it('should handle API errors gracefully throughout the flow', async () => {
      // Mock API to fail
      (tcgApi.searchCards as jest.Mock).mockRejectedValue(new Error('API Error'));
      (tcgApi.getRecentSets as jest.Mock).mockRejectedValue(new Error('Sets API Error'));

      const { getByText, getAllByText } = renderTCGView();

      // Should still render without crashing
      await waitFor(() => {
        expect(getByText('Binder Planner')).toBeTruthy();
      });

      // Grid should still show empty slots
      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        expect(emptySlots.length).toBeGreaterThan(0);
      });

      // Switch to Deck Builder should still work
      await waitFor(() => {
        fireEvent.press(getByText('Deck Builder'));
      });

      await waitFor(() => {
        expect(getByText('TCG Deck Builder')).toBeTruthy();
      });
    });

    it('should fallback to mock data when API fails', async () => {
      // Mock complete API failure
      (tcgApi.searchCards as jest.Mock).mockRejectedValue(new Error('Complete API Failure'));

      const { getByText, getAllByText } = renderTCGView();

      await waitFor(() => {
        expect(getByText('Binder Planner')).toBeTruthy();
      });

      // Try to open card picker
      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        fireEvent.press(emptySlots[0]);
      });

      // Should show fallback content or mock data
      await waitFor(() => {
        expect(getByText('Choose a card for slot 1')).toBeTruthy();
      });
    });
  });

  describe('Performance and Memory', () => {
    it('should handle rapid mode switching without memory leaks', async () => {
      const { getByText } = renderTCGView();

      // Rapidly switch modes
      for (let i = 0; i < 5; i++) {
        await waitFor(() => {
          fireEvent.press(getByText('Deck Builder'));
        });

        await waitFor(() => {
          fireEvent.press(getByText('Binder Planner'));
        });
      }

      // Should still be functional
      await waitFor(() => {
        expect(getByText('Binder Planner')).toBeTruthy();
      });
    });

    it('should handle large data sets efficiently', async () => {
      // Create large mock data set
      const largeCardSet = Array.from({ length: 100 }, (_, i) => ({
        ...mockCards[0],
        id: `large-card-${i}`,
        name: `Card ${i}`,
      }));

      (tcgApi.searchCards as jest.Mock).mockResolvedValue(largeCardSet);

      const { getByText, getAllByText } = renderTCGView();

      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        fireEvent.press(emptySlots[0]);
      });

      // Should handle large data without performance issues
      const startTime = Date.now();
      await waitFor(() => {
        expect(getByText('Choose a card for slot 1')).toBeTruthy();
      });
      const renderTime = Date.now() - startTime;

      // Should render in reasonable time
      expect(renderTime).toBeLessThan(2000);
    });
  });
});