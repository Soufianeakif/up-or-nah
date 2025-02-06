export interface GameItem {
  keyword: string;
  searchVolume: number;
  author: string;
  link: string;
  image: string;
  id: number;
}

export interface GameState {
  score: number;
  currentItem: GameItem | null;
  nextItem: GameItem | null;
  highScore: number;
}
