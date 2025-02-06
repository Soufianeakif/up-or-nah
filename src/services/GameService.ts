import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameItem } from '@/types';
import gameData from '../../data/data.json';

const HIGH_SCORE_KEY = '@higher-lower:highScore';

export default class GameService {
  public static async getGameItems(): Promise<GameItem[]> {
    try {
      return gameData as GameItem[];
    } catch (error) {
      console.error('Error loading game items:', error);
      return [];
    }
  }

  public static async getHighScore(): Promise<number> {
    try {
      const highScore = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      return highScore ? parseInt(highScore, 10) : 0;
    } catch (error) {
      console.error('Error getting high score:', error);
      return 0;
    }
  }

  public static async saveHighScore(score: number): Promise<void> {
    try {
      const currentHighScore = await this.getHighScore();
      if (score > currentHighScore) {
        await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
      }
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  }
}
