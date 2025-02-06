import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { COLORS, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const CustomSplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise(resolve => setTimeout(resolve, 2000));
        await SplashScreen.hideAsync();
        onFinish();
      } catch (e) {
        console.warn(e);
      }
    };
    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo-hol.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.credit}>Created by AKIF Soufiane</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.7,
    height: height * 0.3,
  },
  credit: {
    position: 'absolute',
    bottom: SPACING.xl,
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '500',
  },
});

export default CustomSplashScreen;
