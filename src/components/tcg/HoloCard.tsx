// src/components/tcg/HoloCard.tsx
import React, { useRef } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gyroscope } from 'expo-sensors';
import { TCGCard } from '../../api/tcgApi';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 1.4; // Standard card ratio

interface HoloCardProps {
  card: TCGCard;
}

const HoloCard: React.FC<HoloCardProps> = ({ card }) => {
  // Animated values for tilt
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  // Subscribe to gyroscope
  React.useEffect(() => {
    const subscription = Gyroscope.addListener(({ x, y }) => {
      // Limit the tilt range to prevent extreme angles
      tiltX.value = withTiming(Math.max(-15, Math.min(15, x * 5)));
      tiltY.value = withTiming(Math.max(-15, Math.min(15, y * 5)));
    });

    Gyroscope.setUpdateInterval(16); // ~60fps

    return () => {
      subscription.remove();
    };
  }, []);

  // Create animated styles
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 800 },
        { rotateX: `${tiltY.value}deg` },
        { rotateY: `${tiltX.value}deg` },
      ],
    };
  });

  // Create holographic effect with color overlay
  const holoOverlayStyle = useAnimatedStyle(() => {
    // Interpolate values for the rainbow effect
    const colorOpacity = interpolate(
      Math.abs(tiltX.value) + Math.abs(tiltY.value),
      [0, 30],
      [0, 0.5],
      Extrapolate.CLAMP
    );

    return {
      opacity: colorOpacity,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 10,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.cardContainer, cardStyle]}>
        <Image
          source={{ uri: card.images.large }}
          style={styles.cardImage}
          resizeMode='contain'
        />
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.holoEffect, holoOverlayStyle]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CARD_HEIGHT + 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  holoEffect: {
    borderRadius: 10,
  },
});

export default HoloCard;
