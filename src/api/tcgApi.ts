// src/api/tcgApi.ts
import axios from 'axios';

const TCG_API_BASE_URL = 'https://api.pokemontcg.io/v2';
const API_KEY = 'your-api-key'; // You might need to register for an API key

// Set up axios with the API key
const tcgAxios = axios.create({
  baseURL: TCG_API_BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
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

// Get cards from a specific set
export const getCardsBySet = async (setId: string): Promise<TCGCard[]> => {
  try {
    const response = await tcgAxios.get(`/cards?q=set.id:${setId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching cards from set ${setId}:`, error);
    throw error;
  }
};

// Search cards by name
export const searchCards = async (name: string): Promise<TCGCard[]> => {
  try {
    const response = await tcgAxios.get(`/cards?q=name:*${name}*`);
    return response.data.data;
  } catch (error) {
    console.error(`Error searching for cards with name ${name}:`, error);
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
