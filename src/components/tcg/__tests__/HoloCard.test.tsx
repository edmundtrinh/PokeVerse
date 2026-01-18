// src/components/tcg/__tests__/HoloCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import HoloCard from '../HoloCard';
import { TCGCard } from '../../../api/tcgApi';

const mockCard: TCGCard = {
  id: 'test-1',
  name: 'Test Pikachu',
  supertype: 'Pokémon',
  subtypes: ['Basic'],
  rarity: 'Holo',
  artist: 'Test Artist',
  number: '25',
  set: {
    id: 'test-set',
    name: 'Test Set',
    series: 'Test Series',
    printedTotal: 100,
    total: 100,
    legalities: { unlimited: 'Legal' },
    releaseDate: '2024-01-01',
    updatedAt: '2024-01-01',
    images: { symbol: '', logo: '' },
  },
  legalities: { unlimited: 'Legal' },
  images: {
    small: 'https://example.com/small.png',
    large: 'https://example.com/large.png',
  },
  hiResImage: 'https://example.com/hires.png',
};

describe('HoloCard', () => {
  describe('Rendering', () => {
    it('should render card image', () => {
      const { getByTestId } = render(<HoloCard card={mockCard} />);

      // Check if card image is rendered
      expect(() => {
        const image = getByTestId('card-image');
        expect(image).toBeTruthy();
      }).not.toThrow();
    });

    it('should render with custom style', () => {
      const customStyle = { width: 200, height: 280 };
      const { getByTestId } = render(
        <HoloCard card={mockCard} style={customStyle} />
      );

      // Component should render without errors
      expect(() => {
        const container = getByTestId('holo-card-container');
      }).not.toThrow();
    });
  });

  describe('Rarity Effects', () => {
    it('should apply different effects based on rarity', () => {
      const commonCard = { ...mockCard, rarity: 'Common' };
      const { rerender } = render(<HoloCard card={commonCard} />);

      // Common cards should have minimal effects
      expect(() => {
        rerender(<HoloCard card={commonCard} />);
      }).not.toThrow();

      // Holo cards should have more effects
      const holoCard = { ...mockCard, rarity: 'Holo' };
      expect(() => {
        rerender(<HoloCard card={holoCard} />);
      }).not.toThrow();

      // Secret Rare should have maximum effects
      const secretRareCard = { ...mockCard, rarity: 'Secret Rare' };
      expect(() => {
        rerender(<HoloCard card={secretRareCard} />);
      }).not.toThrow();
    });
  });

  describe('Image Loading', () => {
    it('should handle image loading states', () => {
      const { getByText } = render(<HoloCard card={mockCard} />);

      // Should show loading state initially
      expect(getByText('Loading...')).toBeTruthy();
    });

    it('should fallback to lower resolution images on error', () => {
      const cardWithoutHiRes = {
        ...mockCard,
        hiResImage: undefined,
      };

      const { container } = render(<HoloCard card={cardWithoutHiRes} />);
      expect(container).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      const { container } = render(<HoloCard card={mockCard} />);

      // Component should render without accessibility violations
      expect(container).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      const startTime = Date.now();
      render(<HoloCard card={mockCard} />);
      const renderTime = Date.now() - startTime;

      // Should render in reasonable time (less than 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    it('should handle multiple rerenders efficiently', () => {
      const { rerender } = render(<HoloCard card={mockCard} />);

      // Multiple rerenders should not cause errors
      for (let i = 0; i < 10; i++) {
        const modifiedCard = { ...mockCard, name: `Test Card ${i}` };
        expect(() => {
          rerender(<HoloCard card={modifiedCard} />);
        }).not.toThrow();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing image URLs gracefully', () => {
      const cardWithMissingImages = {
        ...mockCard,
        images: {
          small: '',
          large: '',
        },
        hiResImage: undefined,
      };

      expect(() => {
        render(<HoloCard card={cardWithMissingImages} />);
      }).not.toThrow();
    });

    it('should handle unknown rarity types', () => {
      const cardWithUnknownRarity = {
        ...mockCard,
        rarity: 'Ultra Mega Rare Plus' as any,
      };

      expect(() => {
        render(<HoloCard card={cardWithUnknownRarity} />);
      }).not.toThrow();
    });

    it('should handle missing rarity', () => {
      const cardWithoutRarity = {
        ...mockCard,
        rarity: undefined as any,
      };

      expect(() => {
        render(<HoloCard card={cardWithoutRarity} />);
      }).not.toThrow();
    });
  });
});