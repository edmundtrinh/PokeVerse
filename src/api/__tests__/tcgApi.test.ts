// src/api/__tests__/tcgApi.test.ts
import {
  searchCards,
  getRecentCards,
  getCardsBySet,
  getCardById,
  getRecentSets,
  getBestImageUrl,
  getFeaturedCards,
  retryConfig,
  TCGCard,
  TCGSet,
} from '../tcgApi';
import fixtures from '../../data/tcgFixtures.json';

// Mock axios: tcgApi uses an instance from axios.create(), so route its get() to a shared mock
const mockGet = jest.fn();
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: (...args: unknown[]) => mockGet(...args),
    })),
  },
}));

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
    mockGet.mockReset();
    retryConfig.baseDelayMs = 0;
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

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await searchCards('pikachu');

      expect(mockGet).toHaveBeenCalledWith('/cards?q=name:*pikachu*&pageSize=30');
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

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await searchCards('nonexistentcard');
      expect(result).toEqual([]);
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

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await getRecentCards(1, 20);

      expect(mockGet).toHaveBeenCalledWith(
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

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await getCardsBySet('base1');

      expect(mockGet).toHaveBeenCalledWith('/cards?q=set.id:base1');
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

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await getRecentSets();

      expect(mockGet).toHaveBeenCalledWith('/sets?orderBy=-releaseDate&pageSize=10');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Base Set');
    });

    it('should fall back to sample sets when the API is down', async () => {
      mockGet.mockRejectedValue(new Error('Network Error'));

      const result = await getRecentSets();
      expect(result).toHaveLength(10);
      expect(result[0].id).toBe(fixtures.sets[0].id);
    });
  });

  describe('getFeaturedCards', () => {
    it('should fetch featured cards', async () => {
      const mockResponse = {
        data: {
          data: [mockCard],
        },
      };

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await getFeaturedCards();

      expect(mockGet).toHaveBeenCalledWith('/cards?q=name:charizard OR name:pikachu OR name:mewtwo&pageSize=15');
      expect(result).toHaveLength(1);
    });
  });

  describe('retries and offline fallback', () => {
    it('retries transient failures and returns the API result', async () => {
      mockGet
        .mockRejectedValueOnce(new Error('Request failed with status code 502'))
        .mockRejectedValueOnce(new Error('timeout of 15000ms exceeded'))
        .mockResolvedValueOnce({ data: { data: [mockCard] } });

      const result = await searchCards('pikachu');

      expect(mockGet).toHaveBeenCalledTimes(3);
      expect(result[0].id).toBe(mockCard.id);
    });

    it('falls back to sample cards after retries are exhausted', async () => {
      mockGet.mockRejectedValue(new Error('Request failed with status code 502'));

      const result = await searchCards('charizard');

      expect(mockGet).toHaveBeenCalledTimes(retryConfig.attempts);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((card) => expect(card.name.toLowerCase()).toContain('charizard'));
    });

    it('does not retry client errors', async () => {
      mockGet.mockRejectedValue({ response: { status: 404 } });

      const result = await searchCards('charizard');

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns an empty list when nothing in the sample data matches', async () => {
      mockGet.mockRejectedValue(new Error('offline'));

      expect(await searchCards('notarealpokemonname')).toEqual([]);
    });

    it('serves set cards, featured cards and pages from sample data', async () => {
      mockGet.mockRejectedValue(new Error('offline'));
      const setId = fixtures.cards[0].set.id;

      const setCards = await getCardsBySet(setId);
      expect(setCards.length).toBeGreaterThan(0);
      setCards.forEach((card) => expect(card.set.id).toBe(setId));

      const featured = await getFeaturedCards();
      featured.forEach((card) => expect(card.name).toMatch(/charizard|pikachu|mewtwo/i));

      const page1 = await getRecentCards(1, 20);
      const page2 = await getRecentCards(2, 20);
      expect(page1).toHaveLength(20);
      expect(page2[0].id).not.toBe(page1[0].id);
    });

    it('finds a card by id in sample data and rejects unknown ids', async () => {
      mockGet.mockRejectedValue(new Error('offline'));

      const known = fixtures.cards[3];
      expect((await getCardById(known.id)).name).toBe(known.name);
      await expect(getCardById('does-not-exist')).rejects.toThrow('offline sample data');
    });
  });

  describe('configuration', () => {
    const loadApi = (env: Record<string, string>) => {
      const saved = { ...process.env };
      Object.assign(process.env, env);
      let api: typeof import('../tcgApi') | undefined;
      let axiosCreate: jest.Mock | undefined;
      jest.isolateModules(() => {
        axiosCreate = require('axios').default.create;
        api = require('../tcgApi');
      });
      process.env = saved;
      return { api: api!, axiosCreate: axiosCreate! };
    };

    it('skips the network entirely when EXPO_PUBLIC_TCG_OFFLINE=1', async () => {
      const { api } = loadApi({ EXPO_PUBLIC_TCG_OFFLINE: '1' });

      const result = await api.searchCards('pikachu');

      expect(mockGet).not.toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);
    });

    it('sends the API key header when EXPO_PUBLIC_TCG_API_KEY is set', () => {
      const { axiosCreate } = loadApi({ EXPO_PUBLIC_TCG_API_KEY: 'test-key' });

      expect(axiosCreate).toHaveBeenCalledWith(
        expect.objectContaining({ headers: { 'X-Api-Key': 'test-key' } })
      );
    });

    it('sends no API key header by default', () => {
      const { axiosCreate } = loadApi({ EXPO_PUBLIC_TCG_API_KEY: '' });

      expect(axiosCreate.mock.calls[0][0]).not.toHaveProperty('headers');
    });
  });

  describe('sample data', () => {
    it('contains well-formed cards covering the chase categories', () => {
      const cards = fixtures.cards as unknown as TCGCard[];

      expect(cards.length).toBeGreaterThanOrEqual(90);
      cards.forEach((card) => {
        expect(card.id).toBeTruthy();
        expect(card.images.small).toMatch(/^https:/);
        expect(card.set.releaseDate).toBeTruthy();
      });
      expect(cards.some((c) => c.rarity === 'Rare Holo Star')).toBe(true);
      expect(cards.some((c) => c.rarity === 'Special Illustration Rare')).toBe(true);
      expect(cards.some((c) => c.rarity === 'Illustration Rare')).toBe(true);
      expect(cards.some((c) => c.subtypes.includes('TAG TEAM'))).toBe(true);
      expect(cards.some((c) => c.set.series === 'XY')).toBe(true);
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