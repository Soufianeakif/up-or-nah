import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import useGameStore from '@/store/GameStore';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { initializeGame } = useGameStore();

  const handleStartGame = async () => {
    await initializeGame();
    router.push('/game');
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#121212', '#000000']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo-hol.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <BlurView intensity={100} tint="dark" style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Up or Nah?</Text>
            </BlurView>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handleStartGame}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.playButtonText}>PLAY NOW</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.howToPlayButton}
              onPress={() => {}}
              activeOpacity={0.8}
            >
              <Text style={styles.howToPlayText}>HOW TO PLAY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: SPACING.xl,
  },
  subtitleContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.lg,
    alignItems: 'center',
  },
  playButton: {
    width: '80%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  howToPlayButton: {
    padding: SPACING.sm,
  },
  howToPlayText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default HomeScreen;
