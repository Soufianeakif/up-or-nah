import { create } from 'zustand';
import { GameState } from '@/types';
import GameController from '@/controllers/GameController';
import GameService from '@/services/GameService';

interface GameStore extends GameState {
  controller: GameController | null;
  isGameOver: boolean;
  finalScore: number;
  highScore: number;
  initializeGame: () => Promise<void>;
  makeGuess: (guess: 'higher' | 'lower') => boolean;
  resetGame: () => void;
}

const useGameStore = create<GameStore>((set, get) => ({
  score: 0,
  highScore: 0,
  currentItem: null,
  nextItem: null,
  controller: null,
  isGameOver: false,
  finalScore: 0,

  initializeGame: async () => {
    try {
      const items = await GameService.getGameItems();
      const controller = new GameController(items);
      const highScore = await GameService.getHighScore();
      const gameState = controller.getState();
      
      set({ 
        controller,
        ...gameState,
        highScore,
        isGameOver: false,
        finalScore: 0,
        score: 0
      });
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  },

  makeGuess: (guess: 'higher' | 'lower') => {
    const { controller, score } = get();
    if (!controller) return false;

    const isCorrect = controller.handleGuess(guess);
    const newState = controller.getState();
    
    if (!isCorrect) {
      const finalScore = score; // Use current score before state update
      set({ 
        ...newState, 
        isGameOver: true,
        finalScore
      });

      // Handle high score
      if (finalScore > get().highScore) {
        GameService.saveHighScore(finalScore);
        set({ highScore: finalScore });
      }
    } else {
      set(newState);
    }

    return isCorrect;
  },

  resetGame: () => {
    const { controller } = get();
    if (!controller) return;
    
    controller.resetGame();
    set({ 
      ...controller.getState(),
      isGameOver: false,
      finalScore: 0,
      score: 0
    });
  }
}));

export default useGameStore;
