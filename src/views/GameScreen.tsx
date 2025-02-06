import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Animated, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useGameStore from '@/store/GameStore';
import GameService from '@/services/GameService';
import SoundService from '@/services/SoundService';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function GameScreen() {
  const router = useRouter();
  const { score, currentItem, nextItem, makeGuess, isGameOver, resetGame, finalScore, highScore } = useGameStore();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const gameOverAnim = useRef(new Animated.Value(0)).current;
  const hasInitializedSound = useRef(false);

  // Initialize sounds
  useEffect(() => {
    const initSound = async () => {
      try {
        if (!hasInitializedSound.current) {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
          });
          await SoundService.initialize();
          hasInitializedSound.current = true;
        }
      } catch (error) {
        console.error('Error initializing sound:', error);
      }
    };

    initSound();

    return () => {
      SoundService.cleanup();
    };
  }, []);

  // Save high score when leaving the game
  const handleExit = async () => {
    await GameService.updateHighScoreIfNeeded(score);
    router.back();
  };

  useEffect(() => {
    // Handle back button press
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleExit();
      return true;
    });

    return () => {
      // Cleanup and save score when component unmounts
      GameService.updateHighScoreIfNeeded(score);
      backHandler.remove();
    };
  }, [score]);

  useEffect(() => {
    if (isGameOver) {
      // Play wrong sound when game is over
      SoundService.playWrong();
      Animated.spring(gameOverAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      gameOverAnim.setValue(0);
    }
  }, [isGameOver]);

  const handleGuess = async (guess: 'higher' | 'lower') => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(async () => {
      const isCorrect = makeGuess(guess);
      
      if (!isGameOver) {
        if (isCorrect) {
          await SoundService.playCorrect();
        }
        
        slideAnim.setValue(height);
        fadeAnim.setValue(0);

        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };

  const handlePlayAgain = () => {
    Animated.timing(gameOverAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      resetGame();
    });
  };

  if (!currentItem || !nextItem) return null;

  return (
    <View style={styles.container}>
      {/* Game Content */}
      <Animated.View style={[styles.gameContainer, { opacity: fadeAnim }]}>
        {/* Current Item */}
        <View style={styles.itemContainer}>
          <Image source={{ uri: currentItem.image }} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.keywordTop}>{currentItem.keyword}</Text>
            <Text style={styles.searchTextTop}>Has</Text>
            <Text style={styles.searchVolumeTop}>{currentItem.searchVolume.toLocaleString()}</Text>
            <Text style={styles.searchTextTop}>searches monthly</Text>
          </View>
        </View>

        {/* VS Circle */}
        <View style={styles.vsWrapper}>
          <View style={styles.vsOuterCircle}>
            <View style={styles.vsInnerCircle}>
              <Text style={styles.vsText}>VS</Text>
            </View>
          </View>
        </View>

        {/* Next Item */}
        <Animated.View style={[styles.itemContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Image source={{ uri: nextItem.image }} style={styles.image} />
          <View style={styles.overlay}>
            <Text style={styles.keywordBottom}>{nextItem.keyword}</Text>
            <Text style={styles.searchTextTop}>Has</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.higherButton]}
                onPress={() => handleGuess('higher')}
              >
                <Text style={styles.buttonText}>HIGHER</Text>
                <AntDesign name="arrowup" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.lowerButton]}
                onPress={() => handleGuess('lower')}
              >
                <Text style={styles.buttonText}>LOWER</Text>
                <AntDesign name="arrowdown" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.searchCompareText}>searches than "{currentItem.keyword}"</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Game Over Screen */}
      <Animated.View 
        style={[
          styles.gameOverContainer,
          {
            opacity: gameOverAnim,
            transform: [
              { scale: gameOverAnim },
              {
                translateY: gameOverAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height / 2, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents={isGameOver ? 'auto' : 'none'}
      >
        <View style={styles.gameOverContent}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <View style={styles.scoresContainer}>
            <Text style={styles.finalScoreText}>Score: {finalScore}</Text>
            <Text style={styles.highScoreText}>Highest score: {highScore}</Text>
            {finalScore === highScore && finalScore > 0 && (
              <Text style={styles.newHighScoreText}>New High Score!</Text>
            )}
          </View>
          <View style={styles.gameOverButtons}>
            <TouchableOpacity 
              style={[styles.gameOverButton, styles.playAgainButton]}
              onPress={handlePlayAgain}
            >
              <Text style={styles.gameOverButtonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.gameOverButton, styles.menuButton]}
              onPress={handleExit}
            >
              <Text style={styles.gameOverButtonText}>BACK TO MENU</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Controls with SafeArea */}
      <SafeAreaView style={styles.controlsContainer} edges={['top']}>
        {/* Back Button and Score */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleExit}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.bestScoreText}>Best: {highScore}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gameContainer: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bestScoreText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  itemContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keywordTop: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  keywordBottom: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchVolumeTop: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchTextTop: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  searchCompareText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 24,
  },
  vsWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    zIndex: 20,
  },
  vsOuterCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 12,
    minWidth: 160,
    justifyContent: 'center',
  },
  higherButton: {
    backgroundColor: '#4CAF50',
  },
  lowerButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  gameOverContent: {
    alignItems: 'center',
    gap: 24,
    padding: 20,
    width: '100%',
  },
  gameOverText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  scoresContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  finalScoreText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  highScoreText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newHighScoreText: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  gameOverButtons: {
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    maxWidth: 400,
  },
  gameOverButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  menuButton: {
    backgroundColor: '#2196F3',
  },
  gameOverButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
