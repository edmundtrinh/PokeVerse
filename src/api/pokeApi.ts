// src/api/pokeApi.ts
const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
  front_female: string | null;
  back_female: string | null;
  front_shiny_female: string | null;
  back_shiny_female: string | null;
  other?: {
    dream_world?: {
      front_default: string | null;
      front_female: string | null;
    };
    home?: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    showdown?: {
      front_default: string | null;
      back_default: string | null;
      front_female: string | null;
      back_female: string | null;
      front_shiny: string | null;
      back_shiny: string | null;
      front_shiny_female: string | null;
      back_shiny_female: string | null;
    };
  };
  versions?: {
    'generation-i'?: {
      'red-blue'?: {
        back_default: string | null;
        back_gray: string | null;
        back_transparent: string | null;
        front_default: string | null;
        front_gray: string | null;
        front_transparent: string | null;
      };
      yellow?: {
        back_default: string | null;
        back_gray: string | null;
        back_transparent: string | null;
        front_default: string | null;
        front_gray: string | null;
        front_transparent: string | null;
      };
    };
    'generation-ii'?: {
      crystal?: {
        back_default: string | null;
        back_shiny: string | null;
        back_shiny_transparent: string | null;
        back_transparent: string | null;
        front_default: string | null;
        front_shiny: string | null;
        front_shiny_transparent: string | null;
        front_transparent: string | null;
      };
      gold?: {
        back_default: string | null;
        back_shiny: string | null;
        front_default: string | null;
        front_shiny: string | null;
        front_transparent: string | null;
      };
      silver?: {
        back_default: string | null;
        back_shiny: string | null;
        front_default: string | null;
        front_shiny: string | null;
        front_transparent: string | null;
      };
    };
    'generation-iii'?: {
      emerald?: {
        front_default: string | null;
        front_shiny: string | null;
      };
      'firered-leafgreen'?: {
        back_default: string | null;
        back_shiny: string | null;
        front_default: string | null;
        front_shiny: string | null;
      };
      'ruby-sapphire'?: {
        back_default: string | null;
        back_shiny: string | null;
        front_default: string | null;
        front_shiny: string | null;
      };
    };
    'generation-iv'?: {
      'diamond-pearl'?: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      'heartgold-soulsilver'?: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      platinum?: {
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
    'generation-v'?: {
      'black-white'?: {
        animated?: {
          back_default: string | null;
          back_female: string | null;
          back_shiny: string | null;
          back_shiny_female: string | null;
          front_default: string | null;
          front_female: string | null;
          front_shiny: string | null;
          front_shiny_female: string | null;
        };
        back_default: string | null;
        back_female: string | null;
        back_shiny: string | null;
        back_shiny_female: string | null;
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
    'generation-vi'?: {
      'omegaruby-alphasapphire'?: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      'x-y'?: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
    'generation-vii'?: {
      icons?: {
        front_default: string | null;
        front_female: string | null;
      };
      'ultra-sun-ultra-moon'?: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
    };
    'generation-viii'?: {
      icons?: {
        front_default: string | null;
        front_female: string | null;
      };
    };
  };
}

export interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
  habitat: {
    name: string;
    url: string;
  } | null;
  shape: {
    name: string;
    url: string;
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
  species: {
    name: string;
    url: string;
  };
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

// Simple fetch-based API functions
export const getPokemonByName = async (name: string): Promise<PokemonDetail> => {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${name}: ${response.status}`);
  }
  return response.json();
};

export const getPokemons = async (limit: number = 20, offset: number = 0) => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
  }
  return response.json();
};

export const getPokemonSpecies = async (pokemonId: number): Promise<PokemonSpecies> => {
  const response = await fetch(`${BASE_URL}/pokemon-species/${pokemonId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species ${pokemonId}: ${response.status}`);
  }
  return response.json();
};

// Sprite retrieval utilities
export type SpriteGeneration = 
  | 'default'
  | 'generation-i'
  | 'generation-ii' 
  | 'generation-iii'
  | 'generation-iv'
  | 'generation-v'
  | 'generation-vi'
  | 'generation-vii'
  | 'generation-viii';

export type SpriteGame = 
  | 'red-blue'
  | 'yellow'
  | 'gold'
  | 'silver'
  | 'crystal'
  | 'ruby-sapphire'
  | 'emerald'
  | 'firered-leafgreen'
  | 'diamond-pearl'
  | 'platinum'
  | 'heartgold-soulsilver'
  | 'black-white'
  | 'x-y'
  | 'omegaruby-alphasapphire'
  | 'ultra-sun-ultra-moon'
  | 'official-artwork'
  | 'dream-world'
  | 'home'
  | 'showdown';

export type SpriteVariant = 
  | 'front_default'
  | 'back_default'
  | 'front_shiny'
  | 'back_shiny'
  | 'front_female'
  | 'back_female'
  | 'front_shiny_female'
  | 'back_shiny_female'
  | 'front_gray'
  | 'back_gray'
  | 'front_transparent'
  | 'back_transparent';

export interface SpriteOptions {
  generation?: SpriteGeneration;
  game?: SpriteGame;
  variant?: SpriteVariant;
  animated?: boolean;
}

// Comprehensive sprite retrieval function
export const getSprite = (
  sprites: PokemonSprites, 
  options: SpriteOptions = {}
): string | null => {
  const { 
    generation = 'default', 
    game, 
    variant = 'front_default',
    animated = false 
  } = options;

  // Handle default sprites (modern Pokemon)
  if (generation === 'default') {
    if (sprites.other) {
      // Try official artwork first (highest quality)
      if (variant.includes('front') && sprites.other['official-artwork']?.front_default) {
        return variant.includes('shiny') 
          ? sprites.other['official-artwork']?.front_shiny
          : sprites.other['official-artwork']?.front_default;
      }
      
      // Try Pokemon Home sprites
      if (sprites.other.home) {
        const homeSprite = sprites.other.home[variant as keyof typeof sprites.other.home];
        if (homeSprite) return homeSprite;
      }
      
      // Try Dream World sprites
      if (sprites.other.dream_world && variant.includes('front')) {
        const dreamSprite = sprites.other.dream_world[
          variant.includes('female') ? 'front_female' : 'front_default'
        ];
        if (dreamSprite) return dreamSprite;
      }
      
      // Try Showdown sprites
      if (sprites.other.showdown) {
        const showdownSprite = sprites.other.showdown[variant as keyof typeof sprites.other.showdown];
        if (showdownSprite) return showdownSprite;
      }
    }
    
    // Fallback to base sprites
    return sprites[variant as keyof PokemonSprites] as string | null;
  }

  // Handle generation-specific sprites
  if (!sprites.versions || !sprites.versions[generation]) {
    return sprites[variant as keyof PokemonSprites] as string | null;
  }

  const generationSprites = sprites.versions[generation];
  
  // Handle specific game requests
  if (game && generationSprites) {
    const gameSprites = generationSprites[game as keyof typeof generationSprites];
    if (gameSprites) {
      // Handle animated sprites for Gen V
      if (animated && generation === 'generation-v' && game === 'black-white') {
        const bwSprites = gameSprites as any;
        if (bwSprites.animated) {
          const animatedSprite = bwSprites.animated[variant];
          if (animatedSprite) return animatedSprite;
        }
      }
      
      const sprite = (gameSprites as any)[variant];
      if (sprite) return sprite;
    }
  }

  // Try to find any available sprite in the generation
  if (generationSprites) {
    const gameKeys = Object.keys(generationSprites);
    for (const gameKey of gameKeys) {
      const gameSprites = (generationSprites as any)[gameKey];
      if (gameSprites && gameSprites[variant]) {
        return gameSprites[variant];
      }
    }
  }

  // Ultimate fallback to default sprites
  return sprites[variant as keyof PokemonSprites] as string | null;
};

// Get all available sprites for a Pokemon
export const getAllAvailableSprites = (sprites: PokemonSprites): Array<{
  url: string;
  generation: string;
  game: string;
  variant: string;
  animated?: boolean;
}> => {
  const availableSprites: Array<{
    url: string;
    generation: string;
    game: string;
    variant: string;
    animated?: boolean;
  }> = [];

  // Add default sprites
  const defaultVariants: (keyof PokemonSprites)[] = [
    'front_default', 'back_default', 'front_shiny', 'back_shiny',
    'front_female', 'back_female', 'front_shiny_female', 'back_shiny_female'
  ];

  defaultVariants.forEach(variant => {
    const sprite = sprites[variant];
    if (sprite && typeof sprite === 'string') {
      availableSprites.push({
        url: sprite,
        generation: 'default',
        game: 'current',
        variant: variant as string
      });
    }
  });

  // Add other sprites (official artwork, home, etc.)
  if (sprites.other) {
    Object.entries(sprites.other).forEach(([source, sourceSprites]) => {
      if (sourceSprites) {
        Object.entries(sourceSprites).forEach(([variant, url]) => {
          if (url) {
            availableSprites.push({
              url,
              generation: 'default',
              game: source,
              variant
            });
          }
        });
      }
    });
  }

  // Add generation-specific sprites
  if (sprites.versions) {
    Object.entries(sprites.versions).forEach(([generation, generationSprites]) => {
      if (generationSprites) {
        Object.entries(generationSprites).forEach(([game, gameSprites]) => {
          if (gameSprites) {
            // Handle animated sprites separately
            if ((gameSprites as any).animated) {
              Object.entries((gameSprites as any).animated).forEach(([variant, url]) => {
                if (url) {
                  availableSprites.push({
                    url: url as string,
                    generation,
                    game,
                    variant,
                    animated: true
                  });
                }
              });
            }
            
            // Handle regular sprites
            Object.entries(gameSprites).forEach(([variant, url]) => {
              if (url && variant !== 'animated') {
                availableSprites.push({
                  url: url as string,
                  generation,
                  game,
                  variant
                });
              }
            });
          }
        });
      }
    });
  }

  return availableSprites;
};

// Get best quality sprite available
export const getBestQualitySprite = (
  sprites: PokemonSprites,
  isShiny: boolean = false,
  preferFront: boolean = true
): string | null => {
  const variant = isShiny 
    ? (preferFront ? 'front_shiny' : 'back_shiny')
    : (preferFront ? 'front_default' : 'back_default');

  // Priority order for best quality
  const priorities: SpriteOptions[] = [
    { generation: 'default', game: 'official-artwork' },
    { generation: 'default', game: 'home' },
    { generation: 'generation-viii' },
    { generation: 'generation-vii' },
    { generation: 'generation-vi' },
    { generation: 'generation-v', animated: true },
    { generation: 'generation-v' },
    { generation: 'default' },
  ];

  for (const options of priorities) {
    const sprite = getSprite(sprites, { ...options, variant });
    if (sprite) return sprite;
  }

  return null;
};

// Alternative sprite sources for fallback
export const getAlternativeSpriteSources = (pokemonId: number, pokemonName: string) => {
  return {
    serebii: {
      icon: `https://www.serebii.net/pokedex-sv/icon/${pokemonId.toString().padStart(3, '0')}.png`,
      art: `https://www.serebii.net/pokemon/art/${pokemonId.toString().padStart(3, '0')}.png`,
      sprite: `https://www.serebii.net/pokemongo/pokemon/${pokemonId.toString().padStart(3, '0')}.png`
    },
    pokemondb: {
      artwork: `https://img.pokemondb.net/artwork/large/${pokemonName}.jpg`,
      sprite: `https://img.pokemondb.net/sprites/home/normal/${pokemonName}.png`,
      shiny: `https://img.pokemondb.net/sprites/home/shiny/${pokemonName}.png`
    },
    bulbapedia: {
      artwork: `https://archives.bulbagarden.net/media/upload/thumb/0/0d/${pokemonId.toString().padStart(3, '0')}${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}.png/250px-${pokemonId.toString().padStart(3, '0')}${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}.png`
    },
    pokeres: {
      artwork: `https://pokeres.bastionbot.org/images/pokemon/${pokemonId}.png`
    }
  };
};
