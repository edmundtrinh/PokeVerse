// src/api/tcgApi.ts
import axios from 'axios';

const TCG_API_BASE_URL = 'https://api.pokemontcg.io/v2';

// Set up axios - Pokemon TCG API works without key for basic usage
const tcgAxios = axios.create({
  baseURL: TCG_API_BASE_URL,
});

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

// Get all card sets
export const getTCGSets = async (): Promise<TCGSet[]> => {
  try {
    const response = await tcgAxios.get('/sets');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching TCG sets:', error);
    throw error;
  }
};

// Get recent sets (simpler query)
export const getRecentSets = async (): Promise<TCGSet[]> => {
  try {
    const response = await tcgAxios.get('/sets?orderBy=-releaseDate&pageSize=10');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching recent sets:', error);
    return [];
  }
};

// Get cards from a specific set
export const getCardsBySet = async (setId: string): Promise<TCGCard[]> => {
  try {
    const response = await tcgAxios.get(`/cards?q=set.id:${setId}`);
    return addHiResImages(response.data.data);
  } catch (error) {
    console.error(`Error fetching cards from set ${setId}:`, error);
    throw error;
  }
};

// Search cards by name (simpler)
export const searchCards = async (name: string): Promise<TCGCard[]> => {
  try {
    const response = await tcgAxios.get(`/cards?q=name:*${name}*&pageSize=30`);
    return addHiResImages(response.data.data || []);
  } catch (error) {
    console.error(`Error searching for cards with name ${name}:`, error);
    throw error;
  }
};

// Search cards by name in recent sets only
export const searchRecentCards = async (name: string): Promise<TCGCard[]> => {
  try {
    const response = await tcgAxios.get(`/cards?q=name:*${name}* AND set.releaseDate:[2024-01-01 TO *]&orderBy=set.releaseDate`);
    return addHiResImages(response.data.data);
  } catch (error) {
    console.error(`Error searching for recent cards with name ${name}:`, error);
    throw error;
  }
};

// Get card by ID
export const getCardById = async (id: string): Promise<TCGCard> => {
  try {
    const response = await tcgAxios.get(`/cards/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching card with ID ${id}:`, error);
    throw error;
  }
};

// Get cards from recent sets with high quality images
export const getRecentCards = async (page: number = 1, pageSize: number = 20): Promise<TCGCard[]> => {
  try {
    // Order by newest sets first, with variety in card types
    const response = await tcgAxios.get(`/cards?q=set.releaseDate:[2024-01-01 TO *]&page=${page}&pageSize=${pageSize}&orderBy=-set.releaseDate,number`);
    return addHiResImages(response.data.data);
  } catch (error) {
    console.error('Error fetching recent cards:', error);
    throw error;
  }
};

// Get cards by rarity from recent sets
export const getCardsByRarity = async (rarity: string, page: number = 1, pageSize: number = 20): Promise<TCGCard[]> => {
  try {
    // Try multiple rarity variations since they can vary
    const rarityQueries = [
      `rarity:"${rarity}"`,
      `rarity:"${rarity} Holo"`,
      `rarity:"Holo ${rarity}"`,
      `rarity:"${rarity} ex"`,
    ];

    const query = rarityQueries.join(' OR ');
    const response = await tcgAxios.get(`/cards?q=set.releaseDate:[2024-01-01 TO *] AND (${query})&page=${page}&pageSize=${pageSize}&orderBy=-set.releaseDate`);
    return addHiResImages(response.data.data);
  } catch (error) {
    console.error(`Error fetching ${rarity} cards:`, error);
    throw error;
  }
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

// Get cards with enhanced image quality scoring
export const getCardsWithQualityScore = async (query: string, pageSize: number = 20): Promise<TCGCard[]> => {
  try {
    const response = await tcgAxios.get(`/cards?q=${query}&pageSize=${pageSize}`);
    const cards = addHiResImages(response.data.data);

    // Score cards by image quality and recency
    return cards.sort((a, b) => {
      const scoreA = getCardQualityScore(a);
      const scoreB = getCardQualityScore(b);
      return scoreB - scoreA;
    });
  } catch (error) {
    console.error('Error fetching quality cards:', error);
    throw error;
  }
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

// Simple featured cards function
export const getFeaturedCards = async (): Promise<TCGCard[]> => {
  try {
    // Simple search for popular cards
    const response = await tcgAxios.get('/cards?q=name:charizard OR name:pikachu OR name:mewtwo&pageSize=15');
    return addHiResImages(response.data.data || []);
  } catch (error) {
    console.error('Error fetching featured cards:', error);
    throw error;
  }
};
