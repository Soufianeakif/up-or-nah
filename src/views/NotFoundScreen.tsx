import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { BlurView } from 'expo-blur';

export default function NotFoundScreen() {
  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#1a1a1a', '#121212', '#000000']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <BlurView intensity={100} tint="dark" style={styles.content}>
          <Text style={styles.title}>404</Text>
          <Text style={styles.message}>Page Not Found</Text>
          <Text style={styles.subtitle}>Redirecting to home...</Text>
        </BlurView>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    margin: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  message: {
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
});
