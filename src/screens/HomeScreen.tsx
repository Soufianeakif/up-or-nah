import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions, Platform, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handleQuit = (): void => {
    if (Platform.OS === 'web') {
      window.close();
    } else {
      BackHandler.exitApp();
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo-hol.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/game')}
        >
          <Text style={styles.buttonText}>PLAY</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.quitButton]} 
          onPress={handleQuit}
        >
          <Text style={[styles.buttonText, styles.quitText]}>QUIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.xl,
  },
  logo: {
    width: width * 0.7,
    height: height * 0.3,
    marginTop: SPACING.xl,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl * 2,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quitButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quitText: {
    color: COLORS.white,
  },
});

export default HomeScreen;
