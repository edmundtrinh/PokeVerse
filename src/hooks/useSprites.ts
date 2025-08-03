// src/hooks/useSprites.ts
import { useState, useEffect } from 'react';
import { 
  PokemonSprites, 
  getSprite, 
  getBestQualitySprite, 
  getAlternativeSpriteSources,
  SpriteOptions 
} from '../api/pokeApi';
import { 
  getCachedSprites, 
  getBestScrapedSprite, 
  validateSpriteUrl,
  ScrapedSprite 
} from '../utils/spriteScraper';

export interface UseSpriteOptions extends SpriteOptions {
  useFallback?: boolean;
  pokemonId?: number;
  pokemonName?: string;
}

export interface SpriteResult {
  url: string | null;
  isLoading: boolean;
  error: string | null;
  source: 'api' | 'alternative' | 'scraped' | 'fallback';
  allAvailableSprites?: ScrapedSprite[];
}

export const useSprite = (
  sprites: PokemonSprites | null,
  options: UseSpriteOptions = {}
): SpriteResult => {
  const [result, setResult] = useState<SpriteResult>({
    url: null,
    isLoading: true,
    error: null,
    source: 'api'
  });

  const {
    useFallback = true,
    pokemonId,
    pokemonName,
    ...spriteOptions
  } = options;

  useEffect(() => {
    const loadSprite = async () => {
      if (!sprites) {
        setResult({ url: null, isLoading: false, error: 'No sprites provided', source: 'api' });
        return;
      }

      setResult(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Try to get sprite from PokeAPI first
        let spriteUrl = getSprite(sprites, spriteOptions);
        let source: 'api' | 'alternative' | 'scraped' | 'fallback' = 'api';

        // If no sprite found or useFallback is enabled, try alternatives
        if (!spriteUrl && pokemonId && pokemonName) {
          // Try alternative sources from API
          const altSources = getAlternativeSpriteSources(pokemonId, pokemonName);
          
          // Try different alternative sources
          const altUrls = [
            altSources.pokemondb.sprite,
            altSources.serebii.sprite,
            altSources.pokeres.artwork,
            altSources.bulbapedia.artwork
          ];

          for (const url of altUrls) {
            if (url && await validateSpriteUrl(url)) {
              spriteUrl = url;
              source = 'alternative';
              break;
            }
          }
        }

        // If still no sprite and fallback is enabled, try web scraping
        if (!spriteUrl && useFallback && pokemonId && pokemonName) {
          spriteUrl = await getBestScrapedSprite(pokemonId, pokemonName, 'sprite');
          source = 'scraped';
        }

        // Final fallback - try to get any available sprite
        if (!spriteUrl && sprites) {
          spriteUrl = getBestQualitySprite(sprites, false, true);
          source = 'fallback';
        }

        // Get all available scraped sprites for additional options
        let allAvailableSprites: ScrapedSprite[] = [];
        if (pokemonId && pokemonName) {
          try {
            allAvailableSprites = await getCachedSprites(pokemonId, pokemonName);
          } catch (error) {
            console.warn('Failed to get scraped sprites:', error);
          }
        }

        setResult({
          url: spriteUrl,
          isLoading: false,
          error: spriteUrl ? null : 'No sprite available',
          source,
          allAvailableSprites
        });

      } catch (error) {
        setResult({
          url: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          source: 'api'
        });
      }
    };

    loadSprite();
  }, [sprites, JSON.stringify(spriteOptions), useFallback, pokemonId, pokemonName]);

  return result;
};

// Hook for getting multiple sprites (useful for sprite galleries)
export const useMultipleSprites = (
  sprites: PokemonSprites | null,
  pokemonId?: number,
  pokemonName?: string
): {
  apiSprites: Array<{ url: string; variant: string; generation: string; game: string }>;
  scrapedSprites: ScrapedSprite[];
  isLoading: boolean;
  error: string | null;
} => {
  const [result, setResult] = useState<{
    apiSprites: Array<{ url: string; variant: string; generation: string; game: string }>;
    scrapedSprites: ScrapedSprite[];
    isLoading: boolean;
    error: string | null;
  }>({
    apiSprites: [],
    scrapedSprites: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const loadAllSprites = async () => {
      if (!sprites) {
        setResult({ apiSprites: [], scrapedSprites: [], isLoading: false, error: 'No sprites provided' });
        return;
      }

      setResult(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const apiSprites: Array<{ url: string; variant: string; generation: string; game: string }> = [];

        // Extract all available API sprites
        const variants = ['front_default', 'back_default', 'front_shiny', 'back_shiny', 'front_female', 'back_female', 'front_shiny_female', 'back_shiny_female'] as const;
        
        // Default sprites
        variants.forEach(variant => {
          const url = sprites[variant];
          if (url) {
            apiSprites.push({
              url,
              variant,
              generation: 'default',
              game: 'current'
            });
          }
        });

        // Other sources (official artwork, home, etc.)
        if (sprites.other) {
          Object.entries(sprites.other).forEach(([source, sourceSprites]) => {
            if (sourceSprites) {
              Object.entries(sourceSprites).forEach(([variant, url]) => {
                if (url) {
                  apiSprites.push({
                    url,
                    variant,
                    generation: 'default',
                    game: source
                  });
                }
              });
            }
          });
        }

        // Generation-specific sprites
        if (sprites.versions) {
          Object.entries(sprites.versions).forEach(([generation, generationSprites]) => {
            if (generationSprites) {
              Object.entries(generationSprites).forEach(([game, gameSprites]) => {
                if (gameSprites) {
                  // Handle animated sprites
                  if ((gameSprites as any).animated) {
                    Object.entries((gameSprites as any).animated).forEach(([variant, url]) => {
                      if (url) {
                        apiSprites.push({
                          url: url as string,
                          variant: `${variant}_animated`,
                          generation,
                          game
                        });
                      }
                    });
                  }
                  
                  // Handle regular sprites
                  Object.entries(gameSprites).forEach(([variant, url]) => {
                    if (url && variant !== 'animated') {
                      apiSprites.push({
                        url: url as string,
                        variant,
                        generation,
                        game
                      });
                    }
                  });
                }
              });
            }
          });
        }

        // Get scraped sprites
        let scrapedSprites: ScrapedSprite[] = [];
        if (pokemonId && pokemonName) {
          try {
            scrapedSprites = await getCachedSprites(pokemonId, pokemonName);
          } catch (error) {
            console.warn('Failed to get scraped sprites:', error);
          }
        }

        setResult({
          apiSprites: apiSprites.filter((sprite, index, self) => 
            index === self.findIndex(s => s.url === sprite.url)
          ), // Remove duplicates
          scrapedSprites,
          isLoading: false,
          error: null
        });

      } catch (error) {
        setResult({
          apiSprites: [],
          scrapedSprites: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    loadAllSprites();
  }, [sprites, pokemonId, pokemonName]);

  return result;
};

// Hook for sprite validation and health checking
export const useSpriteHealthCheck = (urls: string[]): { 
  validUrls: string[]; 
  invalidUrls: string[]; 
  isChecking: boolean; 
} => {
  const [result, setResult] = useState<{
    validUrls: string[];
    invalidUrls: string[];
    isChecking: boolean;
  }>({
    validUrls: [],
    invalidUrls: [],
    isChecking: true
  });

  useEffect(() => {
    const checkUrls = async () => {
      if (urls.length === 0) {
        setResult({ validUrls: [], invalidUrls: [], isChecking: false });
        return;
      }

      setResult(prev => ({ ...prev, isChecking: true }));

      try {
        const results = await Promise.allSettled(
          urls.map(async (url) => {
            const isValid = await validateSpriteUrl(url);
            return { url, isValid };
          })
        );

        const validUrls: string[] = [];
        const invalidUrls: string[] = [];

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            if (result.value.isValid) {
              validUrls.push(result.value.url);
            } else {
              invalidUrls.push(result.value.url);
            }
          } else {
            // If promise was rejected, consider URL invalid
            invalidUrls.push('unknown');
          }
        });

        setResult({
          validUrls,
          invalidUrls,
          isChecking: false
        });

      } catch (error) {
        setResult({
          validUrls: [],
          invalidUrls: urls,
          isChecking: false
        });
      }
    };

    checkUrls();
  }, [JSON.stringify(urls)]);

  return result;
};