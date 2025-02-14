import { Audio } from 'expo-av';
import { Platform } from 'react-native';

// Define a type for our sound objects
type SoundObject = Audio.Sound | HTMLAudioElement;

interface WebAudio {
  element: HTMLAudioElement;
  path: string;
}

export default class SoundService {
  private static correctSound: SoundObject | null = null;
  private static wrongSound: SoundObject | null = null;
  private static isInitialized: boolean = false;
  private static isWeb: boolean = Platform.OS === 'web';

  private static async loadWebSound(path: string): Promise<WebAudio> {
    return new Promise((resolve, reject) => {
      try {
        const element = document.createElement('audio');
        element.src = path;
        element.preload = 'auto';
        
        element.addEventListener('canplaythrough', () => {
          resolve({ element, path });
        }, { once: true });
        
        element.addEventListener('error', (e) => {
          reject(new Error(`Failed to load audio: ${e}`));
        }, { once: true });
        
        // Start loading
        element.load();
      } catch (error) {
        reject(new Error(`Error creating audio element: ${error}`));
      }
    });
  }

  public static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (this.isWeb) {
        // Web implementation
        const correctPath = require('../../assets/sounds/correct.mp3');
        const wrongPath = require('../../assets/sounds/false.mp3');
        
        const [correctAudio, wrongAudio] = await Promise.all([
          this.loadWebSound(correctPath),
          this.loadWebSound(wrongPath)
        ]);
        
        this.correctSound = correctAudio.element;
        this.wrongSound = wrongAudio.element;
      } else {
        // Native implementation
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        const [{ sound: correctSound }, { sound: wrongSound }] = await Promise.all([
          Audio.Sound.createAsync(require('../../assets/sounds/correct.mp3')),
          Audio.Sound.createAsync(require('../../assets/sounds/false.mp3'))
        ]);

        this.correctSound = correctSound;
        this.wrongSound = wrongSound;
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error loading sounds:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  private static async playWebSound(sound: HTMLAudioElement): Promise<void> {
    try {
      sound.currentTime = 0;
      await sound.play();
    } catch (error) {
      console.error('Error playing web sound:', error);
      throw error;
    }
  }

  private static async playNativeSound(sound: Audio.Sound): Promise<void> {
    try {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing native sound:', error);
      throw error;
    }
  }

  public static async playCorrect(): Promise<void> {
    try {
      if (!this.correctSound || !this.isInitialized) {
        await this.initialize();
      }
      if (!this.correctSound) return;

      if (this.isWeb) {
        await this.playWebSound(this.correctSound as HTMLAudioElement);
      } else {
        await this.playNativeSound(this.correctSound as Audio.Sound);
      }
    } catch (error) {
      console.error('Error playing correct sound:', error);
      this.isInitialized = false;
    }
  }

  public static async playWrong(): Promise<void> {
    try {
      if (!this.wrongSound || !this.isInitialized) {
        await this.initialize();
      }
      if (!this.wrongSound) return;

      if (this.isWeb) {
        await this.playWebSound(this.wrongSound as HTMLAudioElement);
      } else {
        await this.playNativeSound(this.wrongSound as Audio.Sound);
      }
    } catch (error) {
      console.error('Error playing wrong sound:', error);
      this.isInitialized = false;
    }
  }

  public static async cleanup(): Promise<void> {
    try {
      if (this.isWeb) {
        if (this.correctSound) {
          const webSound = this.correctSound as HTMLAudioElement;
          webSound.pause();
          webSound.src = '';
          webSound.remove();
        }
        if (this.wrongSound) {
          const webSound = this.wrongSound as HTMLAudioElement;
          webSound.pause();
          webSound.src = '';
          webSound.remove();
        }
      } else {
        if (this.correctSound) {
          await (this.correctSound as Audio.Sound).unloadAsync();
        }
        if (this.wrongSound) {
          await (this.wrongSound as Audio.Sound).unloadAsync();
        }
      }
      this.correctSound = null;
      this.wrongSound = null;
      this.isInitialized = false;
    } catch (error) {
      console.error('Error cleaning up sounds:', error);
    }
  }
}
