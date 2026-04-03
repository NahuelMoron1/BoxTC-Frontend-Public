import { GuessPodiums } from './GuessPodiums';

export interface GuessAllResults {
  gameWon: boolean;
  gamedata?: GuessPodiums;
  firstDriver: boolean;
  secondDriver: boolean;
  thirdDriver: boolean;
  firstCar: boolean;
  secondCar: boolean;
  thirdCar: boolean;
}

export interface GuessOneResults {
  data: { name: string; image: string };
}
