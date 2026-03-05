import { GuessTeams } from './GuessTeams';

export interface GuessAllResults {
  gameWon: boolean;
  gamedata?: GuessTeams;
  team: boolean;
  driver1: boolean;
  driver2: boolean;
  tp: boolean;
}

export interface GuessOneResults {
  data: { name: string; image: string };
}
