// src/components/common/CachedImage.tsx
import React, { useState, useEffect } from 'react';
import { Image, ImageProps, ActivityIndicator, View, StyleSheet } from 'react-native';
import { imageCache } from '../../utils/imageCache';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  uri: string | null;
  showLoadingIndicator?: boolean;
  fallbackUri?: string;
  onCacheHit?: () => void;
  onCacheMiss?: () => void;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  uri,
  showLoadingIndicator = true,
  fallbackUri,
  onCacheHit,
  onCacheMiss,
  style,
  ...imageProps
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      if (!uri) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(false);

      try {
        // Check cache first
        const cachedUri = await imageCache.get(uri);

        if (!mounted) return;

        if (cachedUri) {
          // Cache hit
          setImageUri(cachedUri);
          setIsCached(true);
          onCacheHit?.();
        } else {
          // Cache miss - add to cache
          await imageCache.set(uri);
          setImageUri(uri);
          setIsCached(false);
          onCacheMiss?.();
        }

        setIsLoading(false);
      } catch (err) {
        console.warn('Failed to load cached image:', err);
        if (mounted) {
          setImageUri(uri);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [uri, onCacheHit, onCacheMiss]);

  const handleError = () => {
    setError(true);
    setIsLoading(false);

    // Try fallback URI if provided
    if (fallbackUri && imageUri !== fallbackUri) {
      setImageUri(fallbackUri);
      setError(false);
    }
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  if (!imageUri && !isLoading) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {imageUri && (
        <Image
          {...imageProps}
          source={{ uri: imageUri }}
          style={[styles.image, style]}
          onError={handleError}
          onLoadEnd={handleLoadEnd}
        />
      )}
      {isLoading && showLoadingIndicator && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3b82f6" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }
});

export default CachedImage;
