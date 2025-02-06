import GameModel from '@/models/GameModel';
import { GameItem, GameState } from '@/types';

class GameController {
  private model: GameModel;

  constructor(items: GameItem[]) {
    this.model = new GameModel(items);
  }

  public handleGuess(guess: 'higher' | 'lower'): boolean {
    const state = this.model.getState();
    if (!state.currentItem || !state.nextItem) return false;

    const currentVolume = state.currentItem.searchVolume;
    const nextVolume = state.nextItem.searchVolume;
    
    const isCorrect = guess === 'higher' 
      ? nextVolume >= currentVolume 
      : nextVolume <= currentVolume;

    this.model.updateScore(isCorrect);
    this.model.nextRound();

    return isCorrect;
  }

  public getState(): GameState {
    return this.model.getState();
  }

  public resetGame(): void {
    this.model.resetGame();
  }
}

export default GameController;
