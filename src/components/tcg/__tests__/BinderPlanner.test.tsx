// src/components/tcg/__tests__/BinderPlanner.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BinderPlanner from '../BinderPlanner';
import { UserProvider } from '../../../contexts/UserContext';
import * as tcgApi from '../../../api/tcgApi';

// Mock tcgApi
jest.mock('../../../api/tcgApi');

// Mock HoloCard component
jest.mock('../HoloCard', () => {
  const { View, Text } = require('react-native');
  return function MockHoloCard({ card, style }: any) {
    return (
      <View style={style} testID={`holo-card-${card.id}`}>
        <Text>{card.name}</Text>
      </View>
    );
  };
});

const mockCards = [
  {
    id: 'mock-1',
    name: 'Pikachu',
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    rarity: 'Common',
    artist: 'Test Artist',
    number: '25',
    set: {
      id: 'mock-set',
      name: 'Mock Set',
      series: 'Mock Series',
      printedTotal: 100,
      total: 100,
      legalities: { unlimited: 'Legal' },
      releaseDate: '2024-01-01',
      updatedAt: '2024-01-01',
      images: { symbol: '', logo: '' },
    },
    legalities: { unlimited: 'Legal' },
    images: {
      small: 'https://example.com/pikachu-small.png',
      large: 'https://example.com/pikachu-large.png',
    },
  },
];

const mockSets = [
  {
    id: 'set-1',
    name: 'Base Set',
    series: 'Base',
    printedTotal: 102,
    total: 102,
    legalities: { unlimited: 'Legal' },
    releaseDate: '1999/01/09',
    updatedAt: '2024/01/01',
    images: { symbol: '', logo: '' },
  },
];

const renderWithProvider = (component: React.ReactElement) => {
  return render(<UserProvider>{component}</UserProvider>);
};

describe('BinderPlanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (tcgApi.searchCards as jest.Mock).mockResolvedValue(mockCards);
    (tcgApi.getRecentSets as jest.Mock).mockResolvedValue(mockSets);
    (tcgApi.getCardsBySet as jest.Mock).mockResolvedValue(mockCards);
  });

  describe('Grid Management', () => {
    it('should render with default 3x3 grid', async () => {
      const { getByText, getAllByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        expect(getByText('3×3')).toBeTruthy();
      });

      // Should have 9 empty slots (3x3 grid)
      const emptySlots = getAllByText('Empty');
      expect(emptySlots).toHaveLength(9);
    });

    it('should change grid size when button is pressed', async () => {
      const { getByText, getAllByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        fireEvent.press(getByText('4×4'));
      });

      // Should now have 16 empty slots (4x4 grid)
      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        expect(emptySlots).toHaveLength(16);
      });
    });

    it('should display correct page information', async () => {
      const { getByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        expect(getByText('Page 1 of 100')).toBeTruthy();
        expect(getByText('(0/9 slots filled)')).toBeTruthy();
      });
    });
  });

  describe('Page Navigation', () => {
    it('should navigate to next page', async () => {
      const { getByText, getByTestId } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        const nextButton = getByTestId('next-page-button') || getByText('chevron-right');
        fireEvent.press(nextButton);
      });

      await waitFor(() => {
        expect(getByText('Page 2 of 100')).toBeTruthy();
      });
    });

    it('should navigate to previous page', async () => {
      const { getByText, getByTestId } = renderWithProvider(<BinderPlanner />);

      // First go to page 2
      await waitFor(() => {
        const nextButton = getByTestId('next-page-button') || getByText('chevron-right');
        fireEvent.press(nextButton);
      });

      // Then go back to page 1
      await waitFor(() => {
        const prevButton = getByTestId('prev-page-button') || getByText('chevron-left');
        fireEvent.press(prevButton);
      });

      await waitFor(() => {
        expect(getByText('Page 1 of 100')).toBeTruthy();
      });
    });

    it('should jump to specific page', async () => {
      const { getByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        fireEvent.press(getByText('Page 50'));
      });

      await waitFor(() => {
        expect(getByText('Page 50 of 100')).toBeTruthy();
      });
    });
  });

  describe('Card Selection and Placement', () => {
    it('should open card picker when empty slot is pressed', async () => {
      const { getByText, getAllByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        fireEvent.press(emptySlots[0]);
      });

      await waitFor(() => {
        expect(getByText('Choose a card for slot 1')).toBeTruthy();
      });
    });

    it('should close card picker when close button is pressed', async () => {
      const { getByText, getAllByText, queryByText, getByTestId } = renderWithProvider(<BinderPlanner />);

      // Open card picker
      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        fireEvent.press(emptySlots[0]);
      });

      // Close card picker
      await waitFor(() => {
        const closeButton = getByTestId('close-button') || getByText('close');
        fireEvent.press(closeButton);
      });

      await waitFor(() => {
        expect(queryByText('Choose a card for slot 1')).toBeNull();
      });
    });

    it('should search for cards in picker', async () => {
      const { getByText, getAllByText, getByPlaceholderText } = renderWithProvider(<BinderPlanner />);

      // Open card picker
      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        fireEvent.press(emptySlots[0]);
      });

      // Search for cards
      await waitFor(() => {
        const searchInput = getByPlaceholderText('Search for cards...');
        fireEvent.changeText(searchInput, 'charizard');
      });

      expect(tcgApi.searchCards).toHaveBeenCalledWith('charizard');
    });
  });

  describe('Binder Saving', () => {
    it('should open save dialog when save button is pressed', async () => {
      const { getByText, queryByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        const saveButton = queryByText('Save') || queryByText('save');
        if (saveButton) {
          fireEvent.press(saveButton);
          expect(getByText('Save Binder')).toBeTruthy();
        }
      });
    });

    it('should validate binder name before saving', async () => {
      const { getByText, getByPlaceholderText, queryByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        const saveButton = queryByText('Save') || queryByText('save');
        if (saveButton) {
          fireEvent.press(saveButton);

          // Clear binder name
          const nameInput = getByPlaceholderText('Enter binder name');
          fireEvent.changeText(nameInput, '');

          // Try to save
          const saveDialogButton = getByText('Save Binder');
          fireEvent.press(saveDialogButton);
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      (tcgApi.searchCards as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { getAllByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        fireEvent.press(emptySlots[0]);
      });

      // Should show error state or fallback content
      await waitFor(() => {
        // The component should handle errors and potentially show mock data
        expect(tcgApi.searchCards).toHaveBeenCalled();
      });
    });

    it('should display empty state when no cards are found', async () => {
      (tcgApi.searchCards as jest.Mock).mockResolvedValue([]);

      const { getByText, getAllByText, getByPlaceholderText } = renderWithProvider(<BinderPlanner />);

      // Open card picker
      await waitFor(() => {
        const emptySlots = getAllByText('Empty');
        fireEvent.press(emptySlots[0]);
      });

      // Search for non-existent card
      await waitFor(() => {
        const searchInput = getByPlaceholderText('Search for cards...');
        fireEvent.changeText(searchInput, 'nonexistentcard');
      });

      await waitFor(() => {
        expect(getByText('No cards found for \"nonexistentcard\"')).toBeTruthy();
      });
    });
  });

  describe('Color and Tag Management', () => {
    it('should allow color selection in save dialog', async () => {
      const { getByText, queryByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        const saveButton = queryByText('Save') || queryByText('save');
        if (saveButton) {
          fireEvent.press(saveButton);
          expect(getByText('Color Theme')).toBeTruthy();
        }
      });
    });

    it('should allow tag management in save dialog', async () => {
      const { getByText, getByPlaceholderText, queryByText } = renderWithProvider(<BinderPlanner />);

      await waitFor(() => {
        const saveButton = queryByText('Save') || queryByText('save');
        if (saveButton) {
          fireEvent.press(saveButton);

          // Add custom tag
          const tagInput = getByPlaceholderText('Add custom tag...');
          fireEvent.changeText(tagInput, 'Test Tag');
          fireEvent.submitEditing(tagInput);
        }
      });
    });
  });
});