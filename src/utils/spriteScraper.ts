// src/utils/spriteScraper.ts
import axios from 'axios';

// Web scraping utilities for Pokemon sprite fallbacks
// These functions help retrieve sprites from various websites when PokeAPI is down

export interface ScrapedSprite {
  url: string;
  source: string;
  quality: 'low' | 'medium' | 'high';
  type: 'icon' | 'sprite' | 'artwork' | 'model';
}

// Serebii.net sprite scraper
export const scrapeSerebiiSprites = async (pokemonId: number, pokemonName: string): Promise<ScrapedSprite[]> => {
  const sprites: ScrapedSprite[] = [];
  
  try {
    // Serebii has predictable URL patterns for sprites
    const serebiiUrls = [
      {
        url: `https://www.serebii.net/pokedex-sv/icon/${pokemonId.toString().padStart(3, '0')}.png`,
        type: 'icon' as const,
        quality: 'medium' as const
      },
      {
        url: `https://www.serebii.net/pokemon/art/${pokemonId.toString().padStart(3, '0')}.png`,
        type: 'artwork' as const,
        quality: 'high' as const
      },
      {
        url: `https://www.serebii.net/pokemongo/pokemon/${pokemonId.toString().padStart(3, '0')}.png`,
        type: 'sprite' as const,
        quality: 'medium' as const
      },
      {
        url: `https://www.serebii.net/pokedex-swsh/icon/${pokemonId.toString().padStart(3, '0')}.png`,
        type: 'icon' as const,
        quality: 'medium' as const
      }
    ];

    // Test each URL to see if it exists
    for (const urlData of serebiiUrls) {
      try {
        const response = await axios.head(urlData.url, { timeout: 5000 });
        if (response.status === 200) {
          sprites.push({
            url: urlData.url,
            source: 'serebii',
            quality: urlData.quality,
            type: urlData.type
          });
        }
      } catch (error) {
        // URL doesn't exist, continue to next
        continue;
      }
    }
  } catch (error) {
    console.error('Error scraping Serebii sprites:', error);
  }

  return sprites;
};

// PokemonDB sprite scraper
export const scrapePokemonDBSprites = async (pokemonName: string): Promise<ScrapedSprite[]> => {
  const sprites: ScrapedSprite[] = [];
  
  try {
    const pokemonDBUrls = [
      {
        url: `https://img.pokemondb.net/artwork/large/${pokemonName}.jpg`,
        type: 'artwork' as const,
        quality: 'high' as const
      },
      {
        url: `https://img.pokemondb.net/sprites/home/normal/${pokemonName}.png`,
        type: 'sprite' as const,
        quality: 'high' as const
      },
      {
        url: `https://img.pokemondb.net/sprites/home/shiny/${pokemonName}.png`,
        type: 'sprite' as const,
        quality: 'high' as const
      },
      {
        url: `https://img.pokemondb.net/sprites/sword-shield/normal/${pokemonName}.png`,
        type: 'sprite' as const,
        quality: 'medium' as const
      },
      {
        url: `https://img.pokemondb.net/sprites/sword-shield/shiny/${pokemonName}.png`,
        type: 'sprite' as const,
        quality: 'medium' as const
      }
    ];

    for (const urlData of pokemonDBUrls) {
      try {
        const response = await axios.head(urlData.url, { timeout: 5000 });
        if (response.status === 200) {
          sprites.push({
            url: urlData.url,
            source: 'pokemondb',
            quality: urlData.quality,
            type: urlData.type
          });
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    console.error('Error scraping PokemonDB sprites:', error);
  }

  return sprites;
};

// Bulbapedia sprite scraper (more complex due to MediaWiki structure)
export const scrapeBulbapediaSprites = async (pokemonId: number, pokemonName: string): Promise<ScrapedSprite[]> => {
  const sprites: ScrapedSprite[] = [];
  
  try {
    // Bulbapedia uses a more complex naming convention
    const formattedName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
    const paddedId = pokemonId.toString().padStart(3, '0');
    
    const bulbapediaUrls = [
      {
        url: `https://archives.bulbagarden.net/media/upload/thumb/0/0d/${paddedId}${formattedName}.png/250px-${paddedId}${formattedName}.png`,
        type: 'artwork' as const,
        quality: 'high' as const
      },
      {
        url: `https://archives.bulbagarden.net/media/upload/${paddedId}${formattedName}.png`,
        type: 'artwork' as const,
        quality: 'high' as const
      }
    ];

    for (const urlData of bulbapediaUrls) {
      try {
        const response = await axios.head(urlData.url, { timeout: 5000 });
        if (response.status === 200) {
          sprites.push({
            url: urlData.url,
            source: 'bulbapedia',
            quality: urlData.quality,
            type: urlData.type
          });
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    console.error('Error scraping Bulbapedia sprites:', error);
  }

  return sprites;
};

// GitHub Pokemon sprite repositories
export const scrapeGitHubSprites = async (pokemonId: number, pokemonName: string): Promise<ScrapedSprite[]> => {
  const sprites: ScrapedSprite[] = [];
  
  try {
    // Popular GitHub sprite repositories
    const githubRepos = [
      {
        baseUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon',
        patterns: [
          `${pokemonId}.png`,
          `back/${pokemonId}.png`,
          `shiny/${pokemonId}.png`,
          `back/shiny/${pokemonId}.png`
        ]
      },
      {
        baseUrl: 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images',
        patterns: [
          `${pokemonId.toString().padStart(3, '0')}.png`
        ]
      }
    ];

    for (const repo of githubRepos) {
      for (const pattern of repo.patterns) {
        const url = `${repo.baseUrl}/${pattern}`;
        try {
          const response = await axios.head(url, { timeout: 5000 });
          if (response.status === 200) {
            sprites.push({
              url,
              source: 'github',
              quality: 'medium',
              type: 'sprite'
            });
          }
        } catch (error) {
          continue;
        }
      }
    }
  } catch (error) {
    console.error('Error scraping GitHub sprites:', error);
  }

  return sprites;
};

// Comprehensive sprite scraper that tries all sources
export const scrapeAllSpriteSources = async (
  pokemonId: number, 
  pokemonName: string
): Promise<ScrapedSprite[]> => {
  const allSprites: ScrapedSprite[] = [];

  try {
    // Run all scrapers in parallel for better performance
    const [serebiiSprites, pokemonDBSprites, bulbapediaSprites, githubSprites] = await Promise.allSettled([
      scrapeSerebiiSprites(pokemonId, pokemonName),
      scrapePokemonDBSprites(pokemonName),
      scrapeBulbapediaSprites(pokemonId, pokemonName),
      scrapeGitHubSprites(pokemonId, pokemonName)
    ]);

    // Collect all successful results
    if (serebiiSprites.status === 'fulfilled') {
      allSprites.push(...serebiiSprites.value);
    }
    if (pokemonDBSprites.status === 'fulfilled') {
      allSprites.push(...pokemonDBSprites.value);
    }
    if (bulbapediaSprites.status === 'fulfilled') {
      allSprites.push(...bulbapediaSprites.value);
    }
    if (githubSprites.status === 'fulfilled') {
      allSprites.push(...githubSprites.value);
    }

    // Sort by quality (high -> medium -> low) and type preference
    return allSprites.sort((a, b) => {
      const qualityOrder = { high: 3, medium: 2, low: 1 };
      const typeOrder = { artwork: 4, sprite: 3, model: 2, icon: 1 };
      
      const qualityDiff = qualityOrder[b.quality] - qualityOrder[a.quality];
      if (qualityDiff !== 0) return qualityDiff;
      
      return typeOrder[b.type] - typeOrder[a.type];
    });

  } catch (error) {
    console.error('Error in comprehensive sprite scraping:', error);
    return [];
  }
};

// Validate if a sprite URL is accessible
export const validateSpriteUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.head(url, { 
      timeout: 3000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PokeVerse/1.0)'
      }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Get the best available sprite from scraping results
export const getBestScrapedSprite = async (
  pokemonId: number, 
  pokemonName: string, 
  preferredType?: 'icon' | 'sprite' | 'artwork' | 'model'
): Promise<string | null> => {
  try {
    const sprites = await scrapeAllSpriteSources(pokemonId, pokemonName);
    
    if (sprites.length === 0) return null;

    // If preferred type is specified, try to find it first
    if (preferredType) {
      const preferredSprites = sprites.filter(s => s.type === preferredType);
      if (preferredSprites.length > 0) {
        return preferredSprites[0].url;
      }
    }

    // Return the best quality sprite available
    return sprites[0].url;
  } catch (error) {
    console.error('Error getting best scraped sprite:', error);
    return null;
  }
};

// Cache for scraped sprites to avoid repeated requests
const spriteCache = new Map<string, ScrapedSprite[]>();

export const getCachedSprites = async (
  pokemonId: number, 
  pokemonName: string
): Promise<ScrapedSprite[]> => {
  const cacheKey = `${pokemonId}-${pokemonName}`;
  
  if (spriteCache.has(cacheKey)) {
    return spriteCache.get(cacheKey)!;
  }

  const sprites = await scrapeAllSpriteSources(pokemonId, pokemonName);
  spriteCache.set(cacheKey, sprites);
  
  // Clear cache after 1 hour
  setTimeout(() => {
    spriteCache.delete(cacheKey);
  }, 60 * 60 * 1000);

  return sprites;
};