import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameItem } from '@/types';
import gameData from '../../data/data.json';

const HIGH_SCORE_KEY = '@higher-lower:highScore';

export default class GameService {
  private static highScore: number | null = null;

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
      // Return cached high score if available
      if (this.highScore !== null) {
        return this.highScore;
      }

      const highScore = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      const score = highScore ? parseInt(highScore, 10) : 0;
      this.highScore = score;
      return score;
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
        this.highScore = score;
        console.log('New high score saved:', score);
      }
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  }

  public static async updateHighScoreIfNeeded(score: number): Promise<void> {
    const currentHighScore = await this.getHighScore();
    if (score > currentHighScore) {
      await this.saveHighScore(score);
    }
  }
}
