import { Audio } from 'expo-av';

export default class SoundService {
  private static correctSound: Audio.Sound | null = null;
  private static wrongSound: Audio.Sound | null = null;

  public static async initialize(): Promise<void> {
    try {
      const { sound: correctSound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/correct.mp3')
      );
      const { sound: wrongSound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/false.mp3')
      );

      this.correctSound = correctSound;
      this.wrongSound = wrongSound;
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  }

  public static async playCorrect(): Promise<void> {
    try {
      if (this.correctSound) {
        await this.correctSound.setPositionAsync(0);
        await this.correctSound.playAsync();
      }
    } catch (error) {
      console.error('Error playing correct sound:', error);
    }
  }

  public static async playWrong(): Promise<void> {
    try {
      if (this.wrongSound) {
        await this.wrongSound.setPositionAsync(0);
        await this.wrongSound.playAsync();
      }
    } catch (error) {
      console.error('Error playing wrong sound:', error);
    }
  }

  public static async cleanup(): Promise<void> {
    try {
      if (this.correctSound) {
        await this.correctSound.unloadAsync();
      }
      if (this.wrongSound) {
        await this.wrongSound.unloadAsync();
      }
    } catch (error) {
      console.error('Error cleaning up sounds:', error);
    }
  }
}
