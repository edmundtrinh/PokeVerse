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
    'generation-ix'?: {
      icons?: {
        front_default: string | null;
        front_female: string | null;
      };
    };
  };
}

export interface EvolutionChain {
  id: number;
  chain: {
    is_baby: boolean;
    species: {
      name: string;
      url: string;
    };
    evolution_details: {
      min_level: number | null;
      trigger: {
        name: string;
        url: string;
      };
      item: {
        name: string;
        url: string;
      } | null;
    }[];
    evolves_to: any[];
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
  evolution_chain: {
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

// Pokemon Forms System
export type PokemonFormType = 
  | 'base'           // Original form
  | 'regional'       // Alolan, Galarian, Hisuian, Paldean
  | 'mega'           // Mega Evolution
  | 'gigantamax'     // Gigantamax
  | 'primal'         // Primal Reversion
  | 'ultra'          // Ultra Necrozma
  | 'origin'         // Origin Forme
  | 'alternate'      // Other alternate forms (Rotom appliances)
  | 'seasonal'       // Seasonal forms (Deerling/Sawsbuck)
  | 'forme'          // Battle/ability formes (Deoxys, Shaymin)
  | 'fusion'         // Fusion forms (Kyurem fusions)
  | 'weather'        // Weather-dependent forms (Castform)
  | 'assembly';      // Cell-based forms (Zygarde)

export interface PokemonForm {
  id: string;
  name: string;
  displayName: string;
  formType: PokemonFormType;
  nationalDexNumber: number;
  region?: string;        // For regional variants
  megaStone?: string;     // For Mega Evolution
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: {
    primary: string;
    secondary?: string;
    hidden?: string;
  };
  height: number;         // in decimeters
  weight: number;         // in hectograms
  spriteUrl?: string;
  artworkUrl?: string;
  description?: string;
  introduced: string;     // Generation introduced
  isAvailable: boolean;   // Currently obtainable in games
}

export interface PokemonFormsGroup {
  nationalDexNumber: number;
  baseName: string;
  forms: PokemonForm[];
}

// Simple fetch-based API functions
export const getPokemonByName = async (name: string): Promise<PokemonDetail> => {
  const response = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${name}: ${response.status}`);
  }
  return response.json();
};

// Utility function to extract Pokemon ID from PokeAPI URL
const extractPokemonIdFromUrl = (url: string): number => {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 1;
};

export const getPokemons = async (limit: number = 20, offset: number = 0) => {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
  }
  const data = await response.json();
  
  // Add ID field to each Pokemon by extracting from URL
  return {
    ...data,
    results: data.results.map((pokemon: any) => ({
      ...pokemon,
      id: extractPokemonIdFromUrl(pokemon.url)
    }))
  };
};

export const getPokemonSpecies = async (pokemonId: number): Promise<PokemonSpecies> => {
  const response = await fetch(`${BASE_URL}/pokemon-species/${pokemonId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species ${pokemonId}: ${response.status}`);
  }
  return response.json();
};

export const getEvolutionChain = async (evolutionChainUrl: string): Promise<EvolutionChain> => {
  const response = await fetch(evolutionChainUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch evolution chain: ${response.status}`);
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
  | 'generation-viii'
  | 'generation-ix';

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
  | 'sword-shield'
  | 'brilliant-diamond-shining-pearl'
  | 'legends-arceus'
  | 'scarlet-violet'
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
    { generation: 'generation-ix' },
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

// Pokemon Forms Database
export const POKEMON_FORMS_DATABASE: PokemonFormsGroup[] = [
  // Charizard Forms
  {
    nationalDexNumber: 6,
    baseName: 'charizard',
    forms: [
      {
        id: 'charizard-base',
        name: 'charizard',
        displayName: 'Charizard',
        formType: 'base',
        nationalDexNumber: 6,
        types: ['fire', 'flying'],
        stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
        abilities: { primary: 'blaze', hidden: 'solar-power' },
        height: 17, weight: 905,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
        description: 'The flame that burns at the tip of its tail is an indication of its emotions.',
        introduced: 'Generation I',
        isAvailable: true
      },
      {
        id: 'charizard-mega-x',
        name: 'charizard-mega-x',
        displayName: 'Mega Charizard X',
        formType: 'mega',
        nationalDexNumber: 6,
        megaStone: 'charizardite-x',
        types: ['fire', 'dragon'],
        stats: { hp: 78, attack: 130, defense: 111, specialAttack: 130, specialDefense: 85, speed: 100 },
        abilities: { primary: 'tough-claws' },
        height: 17, weight: 1105,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10034.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10034.png',
        description: 'The overwhelming power that fills its entire body causes it to turn black and creates intense blue flames.',
        introduced: 'Generation VI',
        isAvailable: true
      },
      {
        id: 'charizard-mega-y',
        name: 'charizard-mega-y',
        displayName: 'Mega Charizard Y',
        formType: 'mega',
        nationalDexNumber: 6,
        megaStone: 'charizardite-y',
        types: ['fire', 'flying'],
        stats: { hp: 78, attack: 104, defense: 78, specialAttack: 159, specialDefense: 115, speed: 100 },
        abilities: { primary: 'drought' },
        height: 17, weight: 1005,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10035.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10035.png',
        description: 'Its bond with its Trainer is the source of its power. It boasts speed and maneuverability greater than that of a jet fighter.',
        introduced: 'Generation VI',
        isAvailable: true
      },
      {
        id: 'charizard-gigantamax',
        name: 'charizard-gigantamax',
        displayName: 'Gigantamax Charizard',
        formType: 'gigantamax',
        nationalDexNumber: 6,
        types: ['fire', 'flying'],
        stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
        abilities: { primary: 'blaze', hidden: 'solar-power' },
        height: 280, weight: 905, // Gigantamax size
        spriteUrl: 'https://www.serebii.net/swordshield/dynamax/charizard.png',
        artworkUrl: 'https://www.serebii.net/swordshield/dynamax/charizard.png',
        description: 'The flame inside its body burns hotter than 3,600 degrees Fahrenheit. When it roars, that temperature climbs even higher.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Ninetales Forms
  {
    nationalDexNumber: 38,
    baseName: 'ninetales',
    forms: [
      {
        id: 'ninetales-base',
        name: 'ninetales',
        displayName: 'Ninetales',
        formType: 'base',
        nationalDexNumber: 38,
        types: ['fire'],
        stats: { hp: 73, attack: 76, defense: 75, specialAttack: 81, specialDefense: 100, speed: 100 },
        abilities: { primary: 'flash-fire', hidden: 'drought' },
        height: 11, weight: 199,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png',
        description: 'Very smart and vengeful. Grabbing one of its many tails could result in a 1,000-year curse.',
        introduced: 'Generation I',
        isAvailable: true
      },
      {
        id: 'ninetales-alola',
        name: 'ninetales-alola',
        displayName: 'Alolan Ninetales',
        formType: 'regional',
        nationalDexNumber: 38,
        region: 'Alola',
        types: ['ice', 'fairy'],
        stats: { hp: 73, attack: 67, defense: 75, specialAttack: 81, specialDefense: 100, speed: 109 },
        abilities: { primary: 'snow-cloak', hidden: 'snow-warning' },
        height: 11, weight: 199,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10101.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10101.png',
        description: 'It exhales air colder than -58 degrees Fahrenheit. Elderly people in Alola call this Pokémon by an older name—Keokeo.',
        introduced: 'Generation VII',
        isAvailable: true
      }
    ]
  },
  // Articuno Forms
  {
    nationalDexNumber: 144,
    baseName: 'articuno',
    forms: [
      {
        id: 'articuno-base',
        name: 'articuno',
        displayName: 'Articuno',
        formType: 'base',
        nationalDexNumber: 144,
        types: ['ice', 'flying'],
        stats: { hp: 90, attack: 85, defense: 100, specialAttack: 95, specialDefense: 125, speed: 85 },
        abilities: { primary: 'pressure', hidden: 'snow-cloak' },
        height: 17, weight: 554,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
        description: 'A legendary bird Pokémon that is said to appear to doomed people who are lost in icy mountains.',
        introduced: 'Generation I',
        isAvailable: true
      },
      {
        id: 'articuno-galar',
        name: 'articuno-galar',
        displayName: 'Galarian Articuno',
        formType: 'regional',
        nationalDexNumber: 144,
        region: 'Galar',
        types: ['psychic', 'flying'],
        stats: { hp: 90, attack: 85, defense: 85, specialAttack: 125, specialDefense: 100, speed: 95 },
        abilities: { primary: 'competitive' },
        height: 17, weight: 509,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10168.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10168.png',
        description: 'Its feather-like blades are composed of psychic energy and can shear through thick iron sheets as if they were paper.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Zapdos Forms
  {
    nationalDexNumber: 145,
    baseName: 'zapdos',
    forms: [
      {
        id: 'zapdos-base',
        name: 'zapdos',
        displayName: 'Zapdos',
        formType: 'base',
        nationalDexNumber: 145,
        types: ['electric', 'flying'],
        stats: { hp: 90, attack: 90, defense: 85, specialAttack: 125, specialDefense: 90, speed: 100 },
        abilities: { primary: 'pressure', hidden: 'static' },
        height: 16, weight: 526,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png',
        description: 'A legendary bird Pokémon that is said to appear from clouds while dropping enormous lightning bolts.',
        introduced: 'Generation I',
        isAvailable: true
      },
      {
        id: 'zapdos-galar',
        name: 'zapdos-galar',
        displayName: 'Galarian Zapdos',
        formType: 'regional',
        nationalDexNumber: 145,
        region: 'Galar',
        types: ['fighting', 'flying'],
        stats: { hp: 90, attack: 125, defense: 90, specialAttack: 85, specialDefense: 90, speed: 100 },
        abilities: { primary: 'defiant' },
        height: 16, weight: 582,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10169.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10169.png',
        description: 'One kick from its powerful legs will pulverize a dump truck. Supposedly, this Pokémon runs through the mountains at over 180 mph.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Moltres Forms
  {
    nationalDexNumber: 146,
    baseName: 'moltres',
    forms: [
      {
        id: 'moltres-base',
        name: 'moltres',
        displayName: 'Moltres',
        formType: 'base',
        nationalDexNumber: 146,
        types: ['fire', 'flying'],
        stats: { hp: 90, attack: 100, defense: 90, specialAttack: 125, specialDefense: 85, speed: 90 },
        abilities: { primary: 'pressure', hidden: 'flame-body' },
        height: 20, weight: 600,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png',
        description: 'Known as the legendary bird of fire. Every flap of its wings creates a dazzling flash of flames.',
        introduced: 'Generation I',
        isAvailable: true
      },
      {
        id: 'moltres-galar',
        name: 'moltres-galar',
        displayName: 'Galarian Moltres',
        formType: 'regional',
        nationalDexNumber: 146,
        region: 'Galar',
        types: ['dark', 'flying'],
        stats: { hp: 90, attack: 85, defense: 90, specialAttack: 100, specialDefense: 125, speed: 90 },
        abilities: { primary: 'berserk' },
        height: 20, weight: 660,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10170.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10170.png',
        description: 'The sinister aura that blazes like molten lava around this Pokémon is what inspired the name Moltres.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Zoroark Forms
  {
    nationalDexNumber: 571,
    baseName: 'zoroark',
    forms: [
      {
        id: 'zoroark-base',
        name: 'zoroark',
        displayName: 'Zoroark',
        formType: 'base',
        nationalDexNumber: 571,
        types: ['dark'],
        stats: { hp: 60, attack: 105, defense: 60, specialAttack: 120, specialDefense: 60, speed: 105 },
        abilities: { primary: 'illusion' },
        height: 16, weight: 811,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/571.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/571.png',
        description: 'Bonds between these Pokémon are very strong. It protects the safety of its pack by tricking its opponents.',
        introduced: 'Generation V',
        isAvailable: true
      },
      {
        id: 'zoroark-hisui',
        name: 'zoroark-hisui',
        displayName: 'Hisuian Zoroark',
        formType: 'regional',
        nationalDexNumber: 571,
        region: 'Hisui',
        types: ['normal', 'ghost'],
        stats: { hp: 55, attack: 100, defense: 60, specialAttack: 125, specialDefense: 60, speed: 110 },
        abilities: { primary: 'illusion' },
        height: 16, weight: 730,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10249.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10249.png',
        description: 'With its disheveled white fur, it looks like an embodiment of death. Heedless of its own safety, Zoroark attacks its enemies with such ferocity that it lacerates its own body.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Venusaur Forms
  {
    nationalDexNumber: 3,
    baseName: 'venusaur',
    forms: [
      {
        id: 'venusaur-base',
        name: 'venusaur',
        displayName: 'Venusaur',
        formType: 'base',
        nationalDexNumber: 3,
        types: ['grass', 'poison'],
        stats: { hp: 80, attack: 82, defense: 83, specialAttack: 100, specialDefense: 100, speed: 80 },
        abilities: { primary: 'overgrow', hidden: 'chlorophyll' },
        height: 20, weight: 1000,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
        description: 'The flower on its back releases a soothing scent that enhances emotions.',
        introduced: 'Generation I',
        isAvailable: true
      },
      {
        id: 'venusaur-mega',
        name: 'venusaur-mega',
        displayName: 'Mega Venusaur',
        formType: 'mega',
        nationalDexNumber: 3,
        megaStone: 'venusaurite',
        types: ['grass', 'poison'],
        stats: { hp: 80, attack: 100, defense: 123, specialAttack: 122, specialDefense: 120, speed: 80 },
        abilities: { primary: 'thick-fat' },
        height: 24, weight: 1555,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10033.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10033.png',
        description: 'In order to support its flower, which has grown larger due to Mega Evolution, its back and legs have become stronger.',
        introduced: 'Generation VI',
        isAvailable: true
      },
      {
        id: 'venusaur-gigantamax',
        name: 'venusaur-gigantamax',
        displayName: 'Gigantamax Venusaur',
        formType: 'gigantamax',
        nationalDexNumber: 3,
        types: ['grass', 'poison'],
        stats: { hp: 80, attack: 82, defense: 83, specialAttack: 100, specialDefense: 100, speed: 80 },
        abilities: { primary: 'overgrow', hidden: 'chlorophyll' },
        height: 240, weight: 1000, // Gigantamax size
        spriteUrl: 'https://www.serebii.net/swordshield/dynamax/venusaur.png',
        artworkUrl: 'https://www.serebii.net/swordshield/dynamax/venusaur.png',
        description: 'In battle, this Pokémon swings around two thick vines. If these vines slammed into a 10-story building, they could easily topple it.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Blastoise Forms
  {
    nationalDexNumber: 9,
    baseName: 'blastoise',
    forms: [
      {
        id: 'blastoise-base',
        name: 'blastoise',
        displayName: 'Blastoise',
        formType: 'base',
        nationalDexNumber: 9,
        types: ['water'],
        stats: { hp: 79, attack: 83, defense: 100, specialAttack: 85, specialDefense: 105, speed: 78 },
        abilities: { primary: 'torrent', hidden: 'rain-dish' },
        height: 16, weight: 855,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
        description: 'The rocket cannons on its shell fire jets of water capable of punching holes through thick steel.',
        introduced: 'Generation I',
        isAvailable: true
      },
      {
        id: 'blastoise-mega',
        name: 'blastoise-mega',
        displayName: 'Mega Blastoise',
        formType: 'mega',
        nationalDexNumber: 9,
        megaStone: 'blastoisinite',
        types: ['water'],
        stats: { hp: 79, attack: 103, defense: 120, specialAttack: 135, specialDefense: 115, speed: 78 },
        abilities: { primary: 'mega-launcher' },
        height: 16, weight: 1011,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10036.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10036.png',
        description: 'The cannon on its back is as powerful as a tank gun. Its tough legs and back enable it to withstand the recoil from firing the cannon.',
        introduced: 'Generation VI',
        isAvailable: true
      },
      {
        id: 'blastoise-gigantamax',
        name: 'blastoise-gigantamax',
        displayName: 'Gigantamax Blastoise',
        formType: 'gigantamax',
        nationalDexNumber: 9,
        types: ['water'],
        stats: { hp: 79, attack: 83, defense: 100, specialAttack: 85, specialDefense: 105, speed: 78 },
        abilities: { primary: 'torrent', hidden: 'rain-dish' },
        height: 250, weight: 855, // Gigantamax size
        spriteUrl: 'https://www.serebii.net/swordshield/dynamax/blastoise.png',
        artworkUrl: 'https://www.serebii.net/swordshield/dynamax/blastoise.png',
        description: 'Water fired from this Pokémon\'s central main cannon has enough power to blast right through a mountain.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Pikachu Forms
  {
    nationalDexNumber: 25,
    baseName: 'pikachu',
    forms: [
      {
        id: 'pikachu-base',
        name: 'pikachu',
        displayName: 'Pikachu',
        formType: 'base',
        nationalDexNumber: 25,
        types: ['electric'],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        abilities: { primary: 'static', hidden: 'lightning-rod' },
        height: 4, weight: 60,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        description: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
        introduced: 'Generation I',
        isAvailable: true
      },
      {
        id: 'pikachu-gigantamax',
        name: 'pikachu-gigantamax',
        displayName: 'Gigantamax Pikachu',
        formType: 'gigantamax',
        nationalDexNumber: 25,
        types: ['electric'],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        abilities: { primary: 'static', hidden: 'lightning-rod' },
        height: 210, weight: 60, // Gigantamax size
        spriteUrl: 'https://www.serebii.net/swordshield/dynamax/pikachu.png',
        artworkUrl: 'https://www.serebii.net/swordshield/dynamax/pikachu.png',
        description: 'Its Gigantamax power expanded, forming its supersized body and towering tail.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Corviknight Forms
  {
    nationalDexNumber: 823,
    baseName: 'corviknight',
    forms: [
      {
        id: 'corviknight-base',
        name: 'corviknight',
        displayName: 'Corviknight',
        formType: 'base',
        nationalDexNumber: 823,
        types: ['flying', 'steel'],
        stats: { hp: 98, attack: 87, defense: 105, specialAttack: 53, specialDefense: 85, speed: 67 },
        abilities: { primary: 'pressure', secondary: 'unnerve', hidden: 'mirror-armor' },
        height: 22, weight: 750,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/823.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/823.png',
        description: 'With their great intellect and flying skills, these Pokémon very successfully act as the Galar region\'s airborne taxi service.',
        introduced: 'Generation VIII',
        isAvailable: true
      },
      {
        id: 'corviknight-gigantamax',
        name: 'corviknight-gigantamax',
        displayName: 'Gigantamax Corviknight',
        formType: 'gigantamax',
        nationalDexNumber: 823,
        types: ['flying', 'steel'],
        stats: { hp: 98, attack: 87, defense: 105, specialAttack: 53, specialDefense: 85, speed: 67 },
        abilities: { primary: 'pressure', secondary: 'unnerve', hidden: 'mirror-armor' },
        height: 140, weight: 750, // Gigantamax size
        spriteUrl: 'https://www.serebii.net/swordshield/dynamax/corviknight.png',
        artworkUrl: 'https://www.serebii.net/swordshield/dynamax/corviknight.png',
        description: 'Imbued with Gigantamax energy, its wings can whip up winds more forceful than any hurricane could muster. The gusts blow everything away.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Meowth Forms (Regional Variants + Gigantamax)
  {
    nationalDexNumber: 52,
    baseName: 'meowth',
    forms: [
      {
        id: 'meowth-base',
        name: 'meowth',
        displayName: 'Meowth',
        formType: 'base',
        nationalDexNumber: 52,
        types: ['normal'],
        stats: { hp: 40, attack: 45, defense: 35, specialAttack: 40, specialDefense: 40, speed: 90 },
        abilities: { primary: 'pickup', secondary: 'technician', hidden: 'unnerve' },
        height: 4, weight: 42,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png',
        description: 'It loves coins, so if you give it one, you can make friends with Meowth easily.',
        introduced: 'Generation I',
        isAvailable: true
      },
      {
        id: 'meowth-alola',
        name: 'meowth-alola',
        displayName: 'Alolan Meowth',
        formType: 'regional',
        nationalDexNumber: 52,
        region: 'Alola',
        types: ['dark'],
        stats: { hp: 40, attack: 35, defense: 35, specialAttack: 50, specialDefense: 40, speed: 90 },
        abilities: { primary: 'pickup', secondary: 'technician', hidden: 'rattled' },
        height: 4, weight: 42,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10161.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10161.png',
        description: 'It was brought to Alola as a gift for the royal family, where it was treasured. As a result, it developed a prideful personality.',
        introduced: 'Generation VII',
        isAvailable: true
      },
      {
        id: 'meowth-galar',
        name: 'meowth-galar',
        displayName: 'Galarian Meowth',
        formType: 'regional',
        nationalDexNumber: 52,
        region: 'Galar',
        types: ['steel'],
        stats: { hp: 50, attack: 65, defense: 55, specialAttack: 40, specialDefense: 40, speed: 40 },
        abilities: { primary: 'pickup', secondary: 'tough-claws', hidden: 'unnerve' },
        height: 4, weight: 75,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10162.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10162.png',
        description: 'Living with a savage, seafaring people has toughened this Pokémon\'s body so much that parts of it have turned to iron.',
        introduced: 'Generation VIII',
        isAvailable: true
      },
      {
        id: 'meowth-gigantamax',
        name: 'meowth-gigantamax',
        displayName: 'Gigantamax Meowth',
        formType: 'gigantamax',
        nationalDexNumber: 52,
        types: ['normal'],
        stats: { hp: 40, attack: 45, defense: 35, specialAttack: 40, specialDefense: 40, speed: 90 },
        abilities: { primary: 'pickup', secondary: 'technician', hidden: 'unnerve' },
        height: 330, weight: 42, // Gigantamax size
        spriteUrl: 'https://www.serebii.net/swordshield/dynamax/meowth.png',
        artworkUrl: 'https://www.serebii.net/swordshield/dynamax/meowth.png',
        description: 'The pattern that has appeared on its giant coin is thought to be the key to unlocking the secrets of the Dynamax phenomenon.',
        introduced: 'Generation VIII',
        isAvailable: true
      }
    ]
  },
  // Rotom Forms
  {
    nationalDexNumber: 479,
    baseName: 'rotom',
    forms: [
      {
        id: 'rotom-base',
        name: 'rotom',
        displayName: 'Rotom',
        formType: 'base',
        nationalDexNumber: 479,
        types: ['electric', 'ghost'],
        stats: { hp: 50, attack: 50, defense: 77, specialAttack: 95, specialDefense: 77, speed: 91 },
        abilities: { primary: 'levitate' },
        height: 3, weight: 3,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/479.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/479.png',
        description: 'Its body is composed of plasma. It is known to infiltrate electronic devices and wreak havoc.',
        introduced: 'Generation IV',
        isAvailable: true
      },
      {
        id: 'rotom-heat',
        name: 'rotom-heat',
        displayName: 'Heat Rotom',
        formType: 'alternate',
        nationalDexNumber: 479,
        types: ['electric', 'fire'],
        stats: { hp: 50, attack: 65, defense: 107, specialAttack: 105, specialDefense: 107, speed: 86 },
        abilities: { primary: 'levitate' },
        height: 3, weight: 3,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10008.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10008.png',
        description: 'This Pokémon may be found in homes. If an appliance breaks inexplicably, this Pokémon is often to blame.',
        introduced: 'Generation IV',
        isAvailable: true
      },
      {
        id: 'rotom-wash',
        name: 'rotom-wash',
        displayName: 'Wash Rotom',
        formType: 'alternate',
        nationalDexNumber: 479,
        types: ['electric', 'water'],
        stats: { hp: 50, attack: 65, defense: 107, specialAttack: 105, specialDefense: 107, speed: 86 },
        abilities: { primary: 'levitate' },
        height: 3, weight: 3,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10009.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10009.png',
        description: 'This form of Rotom has possessed a washing machine to take on the appearance of an appliance.',
        introduced: 'Generation IV',
        isAvailable: true
      },
      {
        id: 'rotom-frost',
        name: 'rotom-frost',
        displayName: 'Frost Rotom',
        formType: 'alternate',
        nationalDexNumber: 479,
        types: ['electric', 'ice'],
        stats: { hp: 50, attack: 65, defense: 107, specialAttack: 105, specialDefense: 107, speed: 86 },
        abilities: { primary: 'levitate' },
        height: 3, weight: 3,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10010.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10010.png',
        description: 'This Pokémon is inhabiting a refrigerator. It will use moves that have to do with the cold, such as Blizzard.',
        introduced: 'Generation IV',
        isAvailable: true
      },
      {
        id: 'rotom-fan',
        name: 'rotom-fan',
        displayName: 'Fan Rotom',
        formType: 'alternate',
        nationalDexNumber: 479,
        types: ['electric', 'flying'],
        stats: { hp: 50, attack: 65, defense: 107, specialAttack: 105, specialDefense: 107, speed: 86 },
        abilities: { primary: 'levitate' },
        height: 3, weight: 3,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10011.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10011.png',
        description: 'This Pokémon is inhabiting a fan. It will use moves that have to do with the wind, such as Air Slash.',
        introduced: 'Generation IV',
        isAvailable: true
      },
      {
        id: 'rotom-mow',
        name: 'rotom-mow',
        displayName: 'Mow Rotom',
        formType: 'alternate',
        nationalDexNumber: 479,
        types: ['electric', 'grass'],
        stats: { hp: 50, attack: 65, defense: 107, specialAttack: 105, specialDefense: 107, speed: 86 },
        abilities: { primary: 'levitate' },
        height: 3, weight: 3,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10012.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10012.png',
        description: 'This Pokémon is inhabiting a lawn mower. It will use moves that have to do with grass, such as Leaf Storm.',
        introduced: 'Generation IV',
        isAvailable: true
      }
    ]
  },
  // Deoxys Forms
  {
    nationalDexNumber: 386,
    baseName: 'deoxys',
    forms: [
      {
        id: 'deoxys-normal',
        name: 'deoxys',
        displayName: 'Deoxys',
        formType: 'base',
        nationalDexNumber: 386,
        types: ['psychic'],
        stats: { hp: 50, attack: 150, defense: 50, specialAttack: 150, specialDefense: 50, speed: 150 },
        abilities: { primary: 'pressure' },
        height: 17, weight: 608,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/386.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/386.png',
        description: 'The DNA of a space virus underwent a sudden mutation upon exposure to a laser beam and resulted in Deoxys.',
        introduced: 'Generation III',
        isAvailable: true
      },
      {
        id: 'deoxys-attack',
        name: 'deoxys-attack',
        displayName: 'Deoxys Attack Forme',
        formType: 'forme',
        nationalDexNumber: 386,
        types: ['psychic'],
        stats: { hp: 50, attack: 180, defense: 20, specialAttack: 180, specialDefense: 20, speed: 150 },
        abilities: { primary: 'pressure' },
        height: 17, weight: 608,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10001.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10001.png',
        description: 'The crystalline organ on this Pokémon\'s chest appears to be its brain. It is highly intelligent and wields psychokinetic powers.',
        introduced: 'Generation III',
        isAvailable: true
      },
      {
        id: 'deoxys-defense',
        name: 'deoxys-defense',
        displayName: 'Deoxys Defense Forme',
        formType: 'forme',
        nationalDexNumber: 386,
        types: ['psychic'],
        stats: { hp: 50, attack: 70, defense: 160, specialAttack: 70, specialDefense: 160, speed: 90 },
        abilities: { primary: 'pressure' },
        height: 17, weight: 608,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10002.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10002.png',
        description: 'It has the ability to freely recombine its own cellular structure to transform into other forms.',
        introduced: 'Generation III',
        isAvailable: true
      },
      {
        id: 'deoxys-speed',
        name: 'deoxys-speed',
        displayName: 'Deoxys Speed Forme',
        formType: 'forme',
        nationalDexNumber: 386,
        types: ['psychic'],
        stats: { hp: 50, attack: 95, defense: 90, specialAttack: 95, specialDefense: 90, speed: 180 },
        abilities: { primary: 'pressure' },
        height: 17, weight: 608,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10003.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10003.png',
        description: 'When it changes form, an aurora appears. It absorbs attacks by altering its cellular structure.',
        introduced: 'Generation III',
        isAvailable: true
      }
    ]
  },
  // Kyurem Forms
  {
    nationalDexNumber: 646,
    baseName: 'kyurem',
    forms: [
      {
        id: 'kyurem-base',
        name: 'kyurem',
        displayName: 'Kyurem',
        formType: 'base',
        nationalDexNumber: 646,
        types: ['dragon', 'ice'],
        stats: { hp: 125, attack: 130, defense: 90, specialAttack: 130, specialDefense: 90, speed: 95 },
        abilities: { primary: 'pressure' },
        height: 30, weight: 3250,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/646.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/646.png',
        description: 'It generates a powerful, freezing energy inside itself, but its body became frozen when the energy leaked out.',
        introduced: 'Generation V',
        isAvailable: true
      },
      {
        id: 'kyurem-black',
        name: 'kyurem-black',
        displayName: 'Black Kyurem',
        formType: 'fusion',
        nationalDexNumber: 646,
        types: ['dragon', 'ice'],
        stats: { hp: 125, attack: 170, defense: 100, specialAttack: 120, specialDefense: 90, speed: 95 },
        abilities: { primary: 'teravolt' },
        height: 33, weight: 3250,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10019.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10019.png',
        description: 'This Pokémon has a body and heart of ice. Using boiling black energy, it can melt anything.',
        introduced: 'Generation V',
        isAvailable: true
      },
      {
        id: 'kyurem-white',
        name: 'kyurem-white',
        displayName: 'White Kyurem',
        formType: 'fusion',
        nationalDexNumber: 646,
        types: ['dragon', 'ice'],
        stats: { hp: 125, attack: 120, defense: 90, specialAttack: 170, specialDefense: 100, speed: 95 },
        abilities: { primary: 'turboblaze' },
        height: 36, weight: 3250,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10020.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10020.png',
        description: 'This legendary ice Pokémon waits for a hero to fill in the missing parts of its body with truth or ideals.',
        introduced: 'Generation V',
        isAvailable: true
      }
    ]
  },
  // Shaymin Forms
  {
    nationalDexNumber: 492,
    baseName: 'shaymin',
    forms: [
      {
        id: 'shaymin-land',
        name: 'shaymin',
        displayName: 'Shaymin',
        formType: 'base',
        nationalDexNumber: 492,
        types: ['grass'],
        stats: { hp: 100, attack: 100, defense: 100, specialAttack: 100, specialDefense: 100, speed: 100 },
        abilities: { primary: 'natural-cure' },
        height: 2, weight: 21,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/492.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/492.png',
        description: 'The blooming of Gracidea flowers confers the power of flight upon it. Feelings of gratitude are the message it delivers.',
        introduced: 'Generation IV',
        isAvailable: true
      },
      {
        id: 'shaymin-sky',
        name: 'shaymin-sky',
        displayName: 'Shaymin Sky Forme',
        formType: 'forme',
        nationalDexNumber: 492,
        types: ['grass', 'flying'],
        stats: { hp: 100, attack: 103, defense: 75, specialAttack: 120, specialDefense: 75, speed: 127 },
        abilities: { primary: 'serene-grace' },
        height: 4, weight: 52,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10006.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10006.png',
        description: 'It can dissolve toxins in the air to instantly transform ruined land into a lush field of flowers.',
        introduced: 'Generation IV',
        isAvailable: true
      }
    ]
  },
  // Giratina Forms
  {
    nationalDexNumber: 487,
    baseName: 'giratina',
    forms: [
      {
        id: 'giratina-altered',
        name: 'giratina',
        displayName: 'Giratina',
        formType: 'base',
        nationalDexNumber: 487,
        types: ['ghost', 'dragon'],
        stats: { hp: 150, attack: 100, defense: 120, specialAttack: 100, specialDefense: 120, speed: 90 },
        abilities: { primary: 'pressure' },
        height: 45, weight: 7500,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/487.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/487.png',
        description: 'A Pokémon that is said to live in a world on the reverse side of ours. It appears in an ancient cemetery.',
        introduced: 'Generation IV',
        isAvailable: true
      },
      {
        id: 'giratina-origin',
        name: 'giratina-origin',
        displayName: 'Giratina Origin Forme',
        formType: 'origin',
        nationalDexNumber: 487,
        types: ['ghost', 'dragon'],
        stats: { hp: 150, attack: 120, defense: 100, specialAttack: 120, specialDefense: 100, speed: 90 },
        abilities: { primary: 'levitate' },
        height: 69, weight: 6500,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10007.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10007.png',
        description: 'This Pokémon is said to live in a world on the reverse side of ours, where common knowledge is distorted and strange.',
        introduced: 'Generation IV',
        isAvailable: true
      }
    ]
  },
  // Castform Forms
  {
    nationalDexNumber: 351,
    baseName: 'castform',
    forms: [
      {
        id: 'castform-normal',
        name: 'castform',
        displayName: 'Castform',
        formType: 'base',
        nationalDexNumber: 351,
        types: ['normal'],
        stats: { hp: 70, attack: 70, defense: 70, specialAttack: 70, specialDefense: 70, speed: 70 },
        abilities: { primary: 'forecast' },
        height: 3, weight: 8,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/351.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/351.png',
        description: 'It has the ability to change its form into the sun, the rain, or a snow-cloud, depending on the weather.',
        introduced: 'Generation III',
        isAvailable: true
      },
      {
        id: 'castform-sunny',
        name: 'castform-sunny',
        displayName: 'Sunny Castform',
        formType: 'weather',
        nationalDexNumber: 351,
        types: ['fire'],
        stats: { hp: 70, attack: 70, defense: 70, specialAttack: 70, specialDefense: 70, speed: 70 },
        abilities: { primary: 'forecast' },
        height: 3, weight: 8,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10013.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10013.png',
        description: 'Castform borrows the power of nature to transform itself into the guises of the sun, rain, and snow-clouds.',
        introduced: 'Generation III',
        isAvailable: true
      },
      {
        id: 'castform-rainy',
        name: 'castform-rainy',
        displayName: 'Rainy Castform',
        formType: 'weather',
        nationalDexNumber: 351,
        types: ['water'],
        stats: { hp: 70, attack: 70, defense: 70, specialAttack: 70, specialDefense: 70, speed: 70 },
        abilities: { primary: 'forecast' },
        height: 3, weight: 8,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10014.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10014.png',
        description: 'Its appearance changes with the weather. Recently, its molecules were found to be just like water.',
        introduced: 'Generation III',
        isAvailable: true
      },
      {
        id: 'castform-snowy',
        name: 'castform-snowy',
        displayName: 'Snowy Castform',
        formType: 'weather',
        nationalDexNumber: 351,
        types: ['ice'],
        stats: { hp: 70, attack: 70, defense: 70, specialAttack: 70, specialDefense: 70, speed: 70 },
        abilities: { primary: 'forecast' },
        height: 3, weight: 8,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10015.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10015.png',
        description: 'This is the form Castform takes when it absorbs moisture and gets heavy during snowy weather.',
        introduced: 'Generation III',
        isAvailable: true
      }
    ]
  },
  // Zygarde Forms
  {
    nationalDexNumber: 718,
    baseName: 'zygarde',
    forms: [
      {
        id: 'zygarde-50',
        name: 'zygarde',
        displayName: 'Zygarde 50% Forme',
        formType: 'base',
        nationalDexNumber: 718,
        types: ['dragon', 'ground'],
        stats: { hp: 108, attack: 100, defense: 121, specialAttack: 81, specialDefense: 95, speed: 95 },
        abilities: { primary: 'aura-break' },
        height: 50, weight: 3050,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/718.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/718.png',
        description: 'This is Zygarde\'s form when about half of its pieces have been assembled. It plays the role of monitoring the ecosystem.',
        introduced: 'Generation VI',
        isAvailable: true
      },
      {
        id: 'zygarde-10',
        name: 'zygarde-10-percent',
        displayName: 'Zygarde 10% Forme',
        formType: 'assembly',
        nationalDexNumber: 718,
        types: ['dragon', 'ground'],
        stats: { hp: 54, attack: 100, defense: 71, specialAttack: 61, specialDefense: 85, speed: 115 },
        abilities: { primary: 'aura-break' },
        height: 12, weight: 335,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10181.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10181.png',
        description: 'This is Zygarde when about 10% of its pieces have been assembled. It leaps at its enemies to take them down.',
        introduced: 'Generation VI',
        isAvailable: true
      },
      {
        id: 'zygarde-complete',
        name: 'zygarde-complete',
        displayName: 'Zygarde Complete Forme',
        formType: 'assembly',
        nationalDexNumber: 718,
        types: ['dragon', 'ground'],
        stats: { hp: 216, attack: 100, defense: 121, specialAttack: 91, specialDefense: 95, speed: 85 },
        abilities: { primary: 'power-construct' },
        height: 45, weight: 6100,
        spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10118.png',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10118.png',
        description: 'This is Zygarde\'s perfected form. From the orifice on its chest, it radiates high-powered energy that eliminates everything.',
        introduced: 'Generation VI',
        isAvailable: true
      }
    ]
  }
];

// Helper functions for Pokemon Forms
export const getPokemonForms = (nationalDexNumber: number): PokemonFormsGroup | null => {
  return POKEMON_FORMS_DATABASE.find(group => group.nationalDexNumber === nationalDexNumber) || null;
};

export const getPokemonFormById = (formId: string): PokemonForm | null => {
  for (const group of POKEMON_FORMS_DATABASE) {
    const form = group.forms.find(f => f.id === formId);
    if (form) return form;
  }
  return null;
};

export const getFormsByType = (formType: PokemonFormType): PokemonForm[] => {
  const forms: PokemonForm[] = [];
  for (const group of POKEMON_FORMS_DATABASE) {
    forms.push(...group.forms.filter(f => f.formType === formType));
  }
  return forms;
};

export const hasMultipleForms = (nationalDexNumber: number): boolean => {
  const formsGroup = getPokemonForms(nationalDexNumber);
  return formsGroup ? formsGroup.forms.length > 1 : false;
};
