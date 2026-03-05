export interface Gamedata_Impostor {
  game_won: boolean;
  impostors_selected: string[];
  innocents_selected: string[];
  all_innocents: string[];
}

export interface Gamedata_ImpostorSurrender {
  game_won: boolean;
  impostors: string[];
  innocents: string[];
}

export interface Gamedata_ImpostorByOne {
  victory: boolean;
  game_won: boolean;
  all_innocents: string[];
}
