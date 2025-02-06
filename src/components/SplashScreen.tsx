import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { COLORS, SPACING } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const CustomSplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();

        await new Promise(resolve => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
        onFinish();
      } catch (e) {
        console.warn(e);
      }
    };
    prepare();
  }, [fadeAnim, scaleAnim]);

  return (
    <LinearGradient
      colors={['#1a1a1a', '#121212', '#000000']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/logo-hol.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <BlurView intensity={100} tint="dark" style={styles.creditContainer}>
          <Text style={styles.credit}>Developed by AKIF Soufiane</Text>
        </BlurView>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.7,
    height: height * 0.3,
  },
  creditContainer: {
    position: 'absolute',
    bottom: SPACING.md,
    borderRadius: 15,
    overflow: 'hidden',
    padding: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  credit: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
});

export default CustomSplashScreen;
