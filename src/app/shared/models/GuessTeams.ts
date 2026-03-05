import { Driver } from './Driver';
import { Team } from './Team';

export class GuessTeams {
  id: string;
  date: string;
  team_id: string;
  team_principal: string;
  tp_flag: string;
  driver1_id: string;
  driver2_id: string;
  season_id: string;
  Team?: Team;
  Driver1?: Driver;
  Driver2?: Driver;

  constructor(
    id: string,
    date: string,
    team_id: string,
    team_principal: string,
    tp_flag: string,
    driver1_id: string,
    driver2_id: string,
    season_id: string
  ) {
    this.id = id;
    this.date = date;
    this.team_id = team_id;
    this.team_principal = team_principal;
    this.tp_flag = tp_flag;
    this.driver1_id = driver1_id;
    this.driver2_id = driver2_id;
    this.season_id = season_id;
  }
}

export interface StartGuess {
  id: string;
  date: string;
  teamFlag: string;
  tpFlag: string;
  driver1Flag: string;
  driver2Flag: string;
  seasonYear: string;
}

export interface Surrendered {
  gamedata: GuessTeams;
}
