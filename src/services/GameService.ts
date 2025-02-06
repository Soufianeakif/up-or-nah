import { GameItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import gameData from '../../data/data.json';

class GameService {
  private static readonly HIGH_SCORE_KEY = '@game_high_score';

  public static async getGameItems(): Promise<GameItem[]> {
    try {
      return gameData as GameItem[];
    } catch (error) {
      console.error('Error loading game items:', error);
      return [];
    }
  }

  public static async saveHighScore(score: number): Promise<void> {
    try {
      await AsyncStorage.setItem(this.HIGH_SCORE_KEY, score.toString());
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  }

  public static async getHighScore(): Promise<number> {
    try {
      const score = await AsyncStorage.getItem(this.HIGH_SCORE_KEY);
      return score ? parseInt(score, 10) : 0;
    } catch (error) {
      console.error('Error loading high score:', error);
      return 0;
    }
  }
}

export default GameService;
