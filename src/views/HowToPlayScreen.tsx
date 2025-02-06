import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function HowToPlayScreen() {
  const handleGithubPress = () => {
    Linking.openURL('https://github.com/Soufianeakif');
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#121212', '#000000']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>How To Play</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <BlurView intensity={100} tint="dark" style={styles.card}>
            <Text style={styles.sectionTitle}>Game Rules</Text>
            <Text style={styles.text}>
              1. You'll be shown two search terms{'\n'}
              2. Guess which term has more monthly searches{'\n'}
              3. Choose "HIGHER" or "LOWER" to make your guess{'\n'}
              4. Each correct guess adds to your score{'\n'}
              5. Game ends when you make a wrong guess
            </Text>
          </BlurView>

          <BlurView intensity={100} tint="dark" style={styles.card}>
            <Text style={styles.sectionTitle}>Tips</Text>
            <Text style={styles.text}>
              • Think about current trends{'\n'}
              • Consider popular topics{'\n'}
              • Trust your instincts{'\n'}
              • Learn from your mistakes
            </Text>
          </BlurView>

          <BlurView intensity={100} tint="dark" style={styles.card}>
            <Text style={styles.sectionTitle}>Scoring</Text>
            <Text style={styles.text}>
              • Each correct guess = 1 point{'\n'}
              • Try to beat your high score{'\n'}
              • High scores are saved locally
            </Text>
          </BlurView>

          {/* GitHub Link */}
          <TouchableOpacity 
            onPress={handleGithubPress}
            style={styles.githubButton}
          >
            <AntDesign name="github" size={24} color={COLORS.white} />
            <Text style={styles.githubText}>/Soufianeakif</Text>
          </TouchableOpacity>
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl * 2,
  },
  card: {
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  githubText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
});
