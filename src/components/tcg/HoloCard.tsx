// src/components/tcg/HoloCard.tsx
import React, { useRef, useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
  withRepeat,
  withSequence,
  useDerivedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Gyroscope } from 'expo-sensors';
import { TCGCard, getBestImageUrl } from '../../api/tcgApi';
// import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface HoloCardProps {
  card: TCGCard;
  style?: any;
}

// Rarity-based holo effect configurations
const RARITY_EFFECTS = {
  'Common': {
    colors: ['transparent', 'transparent'],
    intensity: 0,
    shimmer: false,
    glow: false,
  },
  'Uncommon': {
    colors: ['rgba(192, 192, 192, 0.1)', 'rgba(192, 192, 192, 0.2)'],
    intensity: 0.15,
    shimmer: false,
    glow: false,
  },
  'Rare': {
    colors: ['rgba(255, 215, 0, 0.15)', 'rgba(255, 215, 0, 0.3)'],
    intensity: 0.3,
    shimmer: true,
    glow: true,
  },
  'Holo': {
    colors: [
      'rgba(255, 0, 255, 0.2)',
      'rgba(0, 255, 255, 0.2)',
      'rgba(255, 255, 0, 0.2)',
      'rgba(255, 0, 0, 0.2)',
      'rgba(0, 255, 0, 0.2)',
      'rgba(0, 0, 255, 0.2)',
    ],
    intensity: 0.5,
    shimmer: true,
    glow: true,
  },
  'Secret Rare': {
    colors: [
      'rgba(255, 215, 0, 0.3)',
      'rgba(255, 20, 147, 0.3)',
      'rgba(138, 43, 226, 0.3)',
      'rgba(0, 191, 255, 0.3)',
      'rgba(50, 205, 50, 0.3)',
    ],
    intensity: 0.7,
    shimmer: true,
    glow: true,
  },
};

const HoloCard: React.FC<HoloCardProps> = ({ card, style }) => {
  // Image state management for hi-res fallbacks
  const [imageSource, setImageSource] = useState<string>(() => {
    return getBestImageUrl(card);
  });
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get card dimensions
  const cardWidth = style?.width || width * 0.8;
  const cardHeight = style?.height || cardWidth * 1.4;

  // Animated values for tilt
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const shimmerOffset = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  // Touch interaction values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const tapEffectOpacity = useSharedValue(0);

  // Get rarity configuration
  const rarity = card.rarity || 'Common';
  const rarityConfig = RARITY_EFFECTS[rarity as keyof typeof RARITY_EFFECTS] || RARITY_EFFECTS['Common'];

  // Subscribe to gyroscope
  React.useEffect(() => {
    const subscription = Gyroscope.addListener(({ x, y }) => {
      // Limit the tilt range to prevent extreme angles
      tiltX.value = withTiming(Math.max(-15, Math.min(15, x * 5)), { duration: 100 });
      tiltY.value = withTiming(Math.max(-15, Math.min(15, y * 5)), { duration: 100 });
    });

    Gyroscope.setUpdateInterval(16); // ~60fps

    return () => {
      subscription.remove();
    };
  }, []);

  // Start shimmer animation for special rarities
  React.useEffect(() => {
    if (rarityConfig.shimmer) {
      shimmerOffset.value = withRepeat(
        withSequence(
          withTiming(-1, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    }

    if (rarityConfig.glow) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [rarity]);

  // Gesture handlers for interactive animations
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      tapEffectOpacity.value = withTiming(0.3, { duration: 100 });
      scale.value = withSpring(0.95, { damping: 10, stiffness: 100 });
    })
    .onEnd(() => {
      'worklet';
      tapEffectOpacity.value = withTiming(0, { duration: 300 });
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX * 0.5;
      translateY.value = event.translationY * 0.5;

      // Add tilt based on drag direction
      tiltX.value = withTiming(event.translationX * 0.02);
      tiltY.value = withTiming(event.translationY * 0.02);
    })
    .onEnd(() => {
      'worklet';
      translateX.value = withSpring(0, { damping: 10, stiffness: 100 });
      translateY.value = withSpring(0, { damping: 10, stiffness: 100 });
      tiltX.value = withTiming(0);
      tiltY.value = withTiming(0);
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      'worklet';
      scale.value = Math.max(0.8, Math.min(2, event.scale));
    })
    .onEnd(() => {
      'worklet';
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      'worklet';
      rotation.value = event.rotation * 0.5; // Limit rotation
    })
    .onEnd(() => {
      'worklet';
      rotation.value = withSpring(0, { damping: 10, stiffness: 100 });
    });

  // Combine all gestures
  const composedGesture = Gesture.Simultaneous(
    tapGesture,
    Gesture.Race(panGesture, pinchGesture, rotationGesture)
  );

  // Create animated card style with tilt and interactions
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value * pulseScale.value },
        { rotateZ: `${rotation.value}rad` },
        { rotateX: `${tiltY.value}deg` },
        { rotateY: `${tiltX.value}deg` },
      ],
    };
  });

  // Tap effect overlay
  const tapEffectStyle = useAnimatedStyle(() => {
    return {
      opacity: tapEffectOpacity.value,
    };
  });

  // Holographic overlay based on rarity
  const holoOverlayStyle = useAnimatedStyle(() => {
    const tiltIntensity = Math.abs(tiltX.value) + Math.abs(tiltY.value);
    const baseOpacity = interpolate(
      tiltIntensity,
      [0, 30],
      [0, rarityConfig.intensity],
      Extrapolate.CLAMP
    );

    return {
      opacity: baseOpacity,
    };
  });

  // Shimmer effect for special cards
  const shimmerStyle = useAnimatedStyle(() => {
    if (!rarityConfig.shimmer) return { opacity: 0 };

    const translateX = interpolate(
      shimmerOffset.value,
      [-1, 1],
      [-cardWidth, cardWidth],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
      opacity: 0.6,
    };
  });

  // Glow effect for premium cards
  const glowStyle = useAnimatedStyle(() => {
    if (!rarityConfig.glow) return { opacity: 0 };

    const shadowOpacity = interpolate(
      pulseScale.value,
      [1, 1.02],
      [0.3, 0.6],
      Extrapolate.CLAMP
    );

    return {
      shadowOpacity,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    };
  });

  // Animated hue shift for holo cards
  const hueShift = useDerivedValue(() => {
    return (shimmerOffset.value + 1) * 180; // 0-360 degrees
  });

  // Render animated holo effects
  const renderHoloEffect = () => {
    if (rarity === 'Common') return null;

    // Simple colored overlay for basic rarities
    if (rarityConfig.colors.length <= 2) {
      return (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: rarityConfig.colors[0],
              borderRadius: 10,
            },
            holoOverlayStyle,
          ]}
        />
      );
    }

    // Multi-color animated effect for premium cards
    const colorShift = useAnimatedStyle(() => {
      const colorIndex = Math.floor((hueShift.value / 60) % rarityConfig.colors.length);
      const nextColorIndex = (colorIndex + 1) % rarityConfig.colors.length;

      return {
        backgroundColor: rarityConfig.colors[colorIndex],
        borderRadius: 10,
      };
    });

    return (
      <Animated.View style={[StyleSheet.absoluteFill, holoOverlayStyle, colorShift]} />
    );
  };

  return (
    <GestureHandlerRootView style={[styles.container, { height: cardHeight + 20 }]}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[
            styles.cardContainer,
            { width: cardWidth, height: cardHeight },
            cardStyle,
            glowStyle,
          ]}
        >
          <Image
            source={{ uri: imageSource }}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              if (!imageError) {
                setImageError(true);
                // Fallback to large image if hi-res fails
                if (imageSource === card.hiResImage) {
                  setImageSource(card.images.large);
                } else if (imageSource === card.images.large) {
                  // Last resort fallback to small image
                  setImageSource(card.images.small);
                }
              }
            }}
            style={styles.cardImage}
            resizeMode='contain'
          />

          {/* Loading placeholder */}
          {!imageLoaded && (
            <View style={[StyleSheet.absoluteFill, {
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.1)'
            }]}>
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: 8,
                borderRadius: 4
              }}>
                <Text style={{ fontSize: 12, color: '#666' }}>Loading...</Text>
              </View>
            </View>
          )}

          {/* Base holographic effect */}
          {renderHoloEffect()}

          {/* Shimmer effect for special cards */}
          {rarityConfig.shimmer && (
            <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 10,
                    width: cardWidth * 0.3,
                    shadowColor: '#fff',
                    shadowOpacity: 0.8,
                    shadowRadius: 20,
                    elevation: 5,
                  },
                ]}
              />
            </Animated.View>
          )}

          {/* Tap effect overlay */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 10,
              },
              tapEffectStyle,
            ]}
          />

          {/* Border glow for premium cards */}
          {rarityConfig.glow && (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: 10,
                },
              ]}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#fff',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});

export default HoloCard;
