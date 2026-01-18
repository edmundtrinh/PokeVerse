// src/api/__tests__/tcgApi.test.ts
import axios from 'axios';
import {
  searchCards,
  getRecentCards,
  getCardsBySet,
  getRecentSets,
  getBestImageUrl,
  getFeaturedCards,
  TCGCard,
  TCGSet,
} from '../tcgApi';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock data
const mockCard: TCGCard = {
  id: 'base1-25',
  name: 'Pikachu',
  supertype: 'Pokémon',
  subtypes: ['Basic'],
  rarity: 'Common',
  artist: 'Atsuko Nishida',
  number: '25',
  set: {
    id: 'base1',
    name: 'Base Set',
    series: 'Base',
    printedTotal: 102,
    total: 102,
    legalities: { unlimited: 'Legal' },
    releaseDate: '1999/01/09',
    updatedAt: '2024/01/01',
    images: {
      symbol: 'https://example.com/symbol.png',
      logo: 'https://example.com/logo.png',
    },
  },
  legalities: { unlimited: 'Legal' },
  images: {
    small: 'https://images.pokemontcg.io/base1/25.png',
    large: 'https://images.pokemontcg.io/base1/25_hires.png',
  },
  hiResImage: 'https://images.pokemontcg.io/base1/25_hires.png',
};

const mockSet: TCGSet = {
  id: 'base1',
  name: 'Base Set',
  series: 'Base',
  printedTotal: 102,
  total: 102,
  legalities: { unlimited: 'Legal' },
  releaseDate: '1999/01/09',
  updatedAt: '2024/01/01',
  images: {
    symbol: 'https://example.com/symbol.png',
    logo: 'https://example.com/logo.png',
  },
};

describe('TCG API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchCards', () => {
    it('should successfully search for cards', async () => {
      const mockResponse = {
        data: {
          data: [mockCard],
          count: 1,
          totalCount: 1,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await searchCards('pikachu');

      expect(mockedAxios.get).toHaveBeenCalledWith('/cards?q=name:*pikachu*&pageSize=30');
      expect(result).toEqual([{...mockCard, altImageSources: { pokeguardian: null }}]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Pikachu');
    });

    it('should handle empty search results', async () => {
      const mockResponse = {
        data: {
          data: [],
          count: 0,
          totalCount: 0,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await searchCards('nonexistentcard');
      expect(result).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(searchCards('pikachu')).rejects.toThrow('API Error');
    });
  });

  describe('getRecentCards', () => {
    it('should fetch recent cards with pagination', async () => {
      const mockResponse = {
        data: {
          data: [mockCard],
          count: 1,
          totalCount: 50,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getRecentCards(1, 20);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/cards?q=set.releaseDate:[2024-01-01 TO *]&page=1&pageSize=20&orderBy=-set.releaseDate,number'
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('getCardsBySet', () => {
    it('should fetch cards from specific set', async () => {
      const mockResponse = {
        data: {
          data: [mockCard],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getCardsBySet('base1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/cards?q=set.id:base1');
      expect(result).toHaveLength(1);
      expect(result[0].set.id).toBe('base1');
    });
  });

  describe('getRecentSets', () => {
    it('should fetch recent sets', async () => {
      const mockResponse = {
        data: {
          data: [mockSet],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getRecentSets();

      expect(mockedAxios.get).toHaveBeenCalledWith('/sets?orderBy=-releaseDate&pageSize=10');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Base Set');
    });

    it('should handle errors and return empty array', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      const result = await getRecentSets();
      expect(result).toEqual([]);
    });
  });

  describe('getFeaturedCards', () => {
    it('should fetch featured cards', async () => {
      const mockResponse = {
        data: {
          data: [mockCard],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getFeaturedCards();

      expect(mockedAxios.get).toHaveBeenCalledWith('/cards?q=name:charizard OR name:pikachu OR name:mewtwo&pageSize=15');
      expect(result).toHaveLength(1);
    });
  });

  describe('getBestImageUrl', () => {
    it('should return hi-res image if available', () => {
      const result = getBestImageUrl(mockCard);
      expect(result).toBe(mockCard.hiResImage);
    });

    it('should fallback to large image', () => {
      const cardWithoutHiRes = {
        ...mockCard,
        hiResImage: undefined,
      };

      const result = getBestImageUrl(cardWithoutHiRes);
      expect(result).toBe(mockCard.images.large);
    });

    it('should fallback to small image as last resort', () => {
      const cardWithoutImages = {
        ...mockCard,
        hiResImage: undefined,
        images: {
          small: 'https://example.com/small.png',
          large: '',
        },
      };

      const result = getBestImageUrl(cardWithoutImages);
      expect(result).toBe(cardWithoutImages.images.small);
    });
  });
});