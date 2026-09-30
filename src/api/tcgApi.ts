// src/api/tcgApi.ts
import axios from 'axios';
import fixtures from '../data/tcgFixtures.json';

const TCG_API_BASE_URL = 'https://api.pokemontcg.io/v2';

// Optional key from dev.pokemontcg.io; the API works without one but is less reliable
const API_KEY = process.env.EXPO_PUBLIC_TCG_API_KEY;
// Set EXPO_PUBLIC_TCG_OFFLINE=1 to skip the network and always use the bundled sample data
const FORCE_OFFLINE = process.env.EXPO_PUBLIC_TCG_OFFLINE === '1';

const tcgAxios = axios.create({
  baseURL: TCG_API_BASE_URL,
  timeout: 15000,
  ...(API_KEY ? { headers: { 'X-Api-Key': API_KEY } } : {}),
});

// cooldownMs: after a request fails all its retries, skip the network for this long and answer
// from the sample data immediately, so a down API doesn't add retry delays to every call
export const retryConfig = { attempts: 3, baseDelayMs: 500, cooldownMs: 30000 };

let apiUnavailableUntil = 0;
export const resetApiCooldown = () => {
  apiUnavailableUntil = 0;
};

export interface TCGCard {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  attacks?: {
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }[];
  weaknesses?: {
    type: string;
    value: string;
  }[];
  resistances?: {
    type: string;
    value: string;
  }[];
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    legalities: {
      unlimited: string;
      standard?: string;
      expanded?: string;
    };
    ptcgoCode?: string;
    releaseDate: string;
    updatedAt: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  artist: string;
  rarity: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities: {
    unlimited: string;
    standard?: string;
    expanded?: string;
  };
  images: {
    small: string;
    large: string;
  };
  // Add custom property for hi-res image
  hiResImage?: string;
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices: any; // Price data structure
  };
}

export interface TCGSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: {
    unlimited: string;
    standard?: string;
    expanded?: string;
  };
  ptcgoCode?: string;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol: string;
    logo: string;
  };
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Network errors, timeouts, rate limits and 5xx responses are worth retrying; other 4xx are not
const isRetryable = (error: any): boolean => {
  const status = error?.response?.status;
  return !status || status === 429 || status >= 500;
};

const requestWithRetry = async (path: string) => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retryConfig.attempts; attempt++) {
    try {
      return await tcgAxios.get(path);
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === retryConfig.attempts) break;
      await sleep(retryConfig.baseDelayMs * 2 ** (attempt - 1));
    }
  }
  throw lastError;
};

// Fetch from the API with retries; if it stays unavailable, answer from the bundled sample data
const fetchOrFallback = async <T>(
  path: string,
  fromResponse: (data: any) => T,
  fromFixtures: () => T
): Promise<T> => {
  if (FORCE_OFFLINE || Date.now() < apiUnavailableUntil) return fromFixtures();
  try {
    const response = await requestWithRetry(path);
    return fromResponse(response.data);
  } catch (error) {
    apiUnavailableUntil = Date.now() + retryConfig.cooldownMs;
    // console.log, not warn: dev builds show warnings as an on-screen toast that looks like a failure
    console.log(
      `TCG API unavailable (${(error as Error)?.message ?? 'unknown error'}); using offline sample data for ${retryConfig.cooldownMs / 1000}s`
    );
    return fromFixtures();
  }
};

const sampleCards = (): TCGCard[] => addHiResImages(fixtures.cards as unknown as TCGCard[]);
const sampleSets = (): TCGSet[] => fixtures.sets as unknown as TCGSet[];
const byNewestSet = (a: TCGCard, b: TCGCard) => b.set.releaseDate.localeCompare(a.set.releaseDate);
const paginate = <T>(items: T[], page: number, pageSize: number): T[] =>
  items.slice((page - 1) * pageSize, page * pageSize);
const matchesName = (card: TCGCard, name: string) =>
  card.name.toLowerCase().includes(name.trim().toLowerCase());

// Get all card sets
export const getTCGSets = (): Promise<TCGSet[]> =>
  fetchOrFallback('/sets', (data) => data.data, sampleSets);

// Get recent sets (simpler query)
export const getRecentSets = (): Promise<TCGSet[]> =>
  fetchOrFallback(
    '/sets?orderBy=-releaseDate&pageSize=10',
    (data) => data.data || [],
    () => sampleSets().slice(0, 10)
  );

// Get cards from a specific set
export const getCardsBySet = (setId: string): Promise<TCGCard[]> =>
  fetchOrFallback(
    `/cards?q=set.id:${setId}`,
    (data) => addHiResImages(data.data),
    () => sampleCards().filter((card) => card.set.id === setId)
  );

// Search cards by name (simpler)
export const searchCards = (name: string): Promise<TCGCard[]> =>
  fetchOrFallback(
    `/cards?q=name:*${name}*&pageSize=30`,
    (data) => addHiResImages(data.data || []),
    () => sampleCards().filter((card) => matchesName(card, name)).slice(0, 30)
  );

// Search cards by name in recent sets only
export const searchRecentCards = (name: string): Promise<TCGCard[]> =>
  fetchOrFallback(
    `/cards?q=name:*${name}* AND set.releaseDate:[2024-01-01 TO *]&orderBy=set.releaseDate`,
    (data) => addHiResImages(data.data),
    () =>
      sampleCards()
        .filter((card) => matchesName(card, name) && card.set.releaseDate >= '2024/01/01')
        .sort(byNewestSet)
  );

// Get card by ID
export const getCardById = (id: string): Promise<TCGCard> =>
  fetchOrFallback(
    `/cards/${id}`,
    (data) => data.data,
    () => {
      const card = sampleCards().find((c) => c.id === id);
      if (!card) throw new Error(`Card ${id} is not in the offline sample data`);
      return card;
    }
  );

// Get cards from recent sets with high quality images
export const getRecentCards = (page: number = 1, pageSize: number = 20): Promise<TCGCard[]> =>
  fetchOrFallback(
    // Order by newest sets first, with variety in card types
    `/cards?q=set.releaseDate:[2024-01-01 TO *]&page=${page}&pageSize=${pageSize}&orderBy=-set.releaseDate,number`,
    (data) => addHiResImages(data.data),
    () => paginate(sampleCards().sort(byNewestSet), page, pageSize)
  );

// Get cards by rarity from recent sets
export const getCardsByRarity = (
  rarity: string,
  page: number = 1,
  pageSize: number = 20
): Promise<TCGCard[]> => {
  // Try multiple rarity variations since they can vary
  const rarityQueries = [
    `rarity:"${rarity}"`,
    `rarity:"${rarity} Holo"`,
    `rarity:"Holo ${rarity}"`,
    `rarity:"${rarity} ex"`,
  ];
  const query = rarityQueries.join(' OR ');
  return fetchOrFallback(
    `/cards?q=set.releaseDate:[2024-01-01 TO *] AND (${query})&page=${page}&pageSize=${pageSize}&orderBy=-set.releaseDate`,
    (data) => addHiResImages(data.data),
    () =>
      paginate(
        sampleCards()
          .filter((card) => (card.rarity || '').toLowerCase().includes(rarity.toLowerCase()))
          .sort(byNewestSet),
        page,
        pageSize
      )
  );
};

// Add hi-res image URL to cards with multiple sources
const addHiResImages = (cards: TCGCard[]): TCGCard[] => {
  return cards.map(card => {
    // Pokemon TCG API hi-res format
    const apiHiRes = `https://images.pokemontcg.io/${card.set.id}/${card.number}_hires.png`;

    // For newer/Japanese sets, we might need alternative sources
    // PokeGuardian has high-quality images for newest sets
    const altSources = {
      pokeguardian: null, // Will be populated for specific newer sets
    };

    return {
      ...card,
      hiResImage: apiHiRes,
      altImageSources: altSources
    };
  });
};

// Enhanced image URL selection with fallbacks
export const getBestImageUrl = (card: TCGCard): string => {
  // Priority order: hi-res API → large → small
  if (card.hiResImage) {
    return card.hiResImage;
  }
  return card.images.large || card.images.small;
};

// Score cards based on image quality and other factors
const getCardQualityScore = (card: TCGCard): number => {
  let score = 0;

  // Recent sets get higher scores
  const releaseYear = new Date(card.set.releaseDate).getFullYear();
  if (releaseYear >= 2024) score += 10;
  if (releaseYear >= 2025) score += 5;

  // Rare cards get higher scores
  const rarity = card.rarity?.toLowerCase() || '';
  if (rarity.includes('secret')) score += 15;
  if (rarity.includes('ultra')) score += 10;
  if (rarity.includes('rare')) score += 5;
  if (rarity.includes('holo')) score += 3;

  // Ex/V cards are popular
  if (card.name.toLowerCase().includes('ex')) score += 8;
  if (card.name.toLowerCase().includes('v')) score += 6;

  return score;
};

const sortByQuality = (cards: TCGCard[]): TCGCard[] =>
  cards.sort((a, b) => getCardQualityScore(b) - getCardQualityScore(a));

// Get cards with enhanced image quality scoring
export const getCardsWithQualityScore = (query: string, pageSize: number = 20): Promise<TCGCard[]> =>
  fetchOrFallback(
    `/cards?q=${query}&pageSize=${pageSize}`,
    (data) => sortByQuality(addHiResImages(data.data)),
    () => sortByQuality(sampleCards()).slice(0, pageSize)
  );

// Simple featured cards function
export const getFeaturedCards = (): Promise<TCGCard[]> =>
  fetchOrFallback(
    // Simple search for popular cards
    '/cards?q=name:charizard OR name:pikachu OR name:mewtwo&pageSize=15',
    (data) => addHiResImages(data.data || []),
    () =>
      sampleCards()
        .filter((card) => /charizard|pikachu|mewtwo/i.test(card.name))
        .slice(0, 15)
  );
