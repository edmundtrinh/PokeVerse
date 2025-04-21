// src/api/pokeApi.ts
import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonSprites {
  front_default: string;
  back_default: string;
  front_shiny: string;
  back_shiny: string;
  // Gen specific sprites
  versions: {
    'generation-i': {
      'red-blue': {
        front_default: string;
        front_gray: string;
        back_default: string;
        back_gray: string;
      };
      yellow: {
        front_default: string;
        front_gray: string;
        back_default: string;
        back_gray: string;
      };
    };
    'generation-ii': {
      crystal: {
        front_default: string;
        front_shiny: string;
        back_default: string;
        back_shiny: string;
      };
      gold: {
        front_default: string;
        front_shiny: string;
        back_default: string;
        back_shiny: string;
      };
      silver: {
        front_default: string;
        front_shiny: string;
        back_default: string;
        back_shiny: string;
      };
    };
    'generation-iii': {
      emerald: {
        front_default: string;
        front_shiny: string;
      };
      'firered-leafgreen': {
        front_default: string;
        front_shiny: string;
        back_default: string;
        back_shiny: string;
      };
      'ruby-sapphire': {
        front_default: string;
        front_shiny: string;
        back_default: string;
        back_shiny: string;
      };
    };
    'generation-iv': {
      'diamond-pearl': {
        front_default: string;
        front_female: string;
        front_shiny: string;
        front_shiny_female: string;
      };
      'heartgold-soulsilver': {
        front_default: string;
        front_female: string;
        front_shiny: string;
        front_shiny_female: string;
      };
      platinum: {
        'generation-iii': {
          emerald: {
            front_default: string;
            front_shiny: string;
          };
          'firered-leafgreen': {
            front_default: string;
            front_shiny: string;
          };
          'ruby-sapphire': {
            front_default: string;
            front_shiny: string;
          };
        };
        'generation-iv': {
          'diamond-pearl': {
            front_default: string;
            front_shiny: string;
          };
          'heartgold-soulsilver': {
            front_default: string;
            front_shiny: string;
          };
          platinum: {
            front_default: string;
            front_shiny: string;
          };
        };
        front_default: string;
        front_female: string;
        front_shiny: string;
        front_shiny_female: string;
      };
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
}

// Generate a function to get all available game versions/generations
export const getGameVersions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/version-group`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching game versions:', error);
    throw error;
  }
};

// Enhanced functions to get more detailed Pokémon data
export const getPokemonByName = async (
  name: string
): Promise<PokemonDetail> => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon ${name}:`, error);
    throw error;
  }
};
