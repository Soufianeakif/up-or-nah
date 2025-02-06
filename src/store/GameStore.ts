import { create } from 'zustand';
import { GameState } from '@/types';
import GameController from '@/controllers/GameController';
import GameService from '@/services/GameService';

interface GameStore extends GameState {
  controller: GameController | null;
  isGameOver: boolean;
  finalScore: number;
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
        finalScore: 0
      });
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  },

  makeGuess: (guess: 'higher' | 'lower') => {
    const { controller } = get();
    if (!controller) return false;

    const isCorrect = controller.handleGuess(guess);
    const newState = controller.getState();
    
    if (!isCorrect) {
      set({ 
        ...newState, 
        isGameOver: true,
        finalScore: newState.score
      });
      if (newState.score > get().highScore) {
        GameService.saveHighScore(newState.score);
        set({ highScore: newState.score });
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
      finalScore: 0
    });
  }
}));

export default useGameStore;
