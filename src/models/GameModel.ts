import { GameItem, GameState } from '@/types';

class GameModel {
  private state: GameState;
  private items: GameItem[];
  private usedItems: Set<number>;

  constructor(items: GameItem[]) {
    this.items = items;
    this.usedItems = new Set();
    this.state = {
      score: 0,
      highScore: 0,
      currentItem: null,
      nextItem: null,
    };
    this.initializeRound();
  }

  private getRandomItem(): GameItem {
    if (this.usedItems.size >= this.items.length) {
      this.usedItems.clear(); // Reset when all items have been used
    }

    let availableItems = this.items.filter(item => !this.usedItems.has(item.id));
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const selectedItem = availableItems[randomIndex];
    this.usedItems.add(selectedItem.id);
    
    return selectedItem;
  }

  private initializeRound(): void {
    this.state.currentItem = this.getRandomItem();
    this.state.nextItem = this.getRandomItem();
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public updateScore(correct: boolean): void {
    if (correct) {
      this.state.score += 1;
      if (this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
      }
    } else {
      this.state.score = 0;
    }
  }

  public nextRound(): void {
    this.state.currentItem = this.state.nextItem;
    this.state.nextItem = this.getRandomItem();
  }

  public resetGame(): void {
    this.usedItems.clear();
    this.state.score = 0;
    this.initializeRound();
  }
}

export default GameModel;
