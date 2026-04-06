export interface GuessDriver {
  id: string;
  date: string;
  driverID: string;
  brandID: string;
  seasonID: number;
  podiums: number;
  wins: number;
  champ_pos: number;
  team: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GuessDriverGameData {
  id: string;
  date: string;
  season: number;
  seasonID: number;
}

export interface GuessDriverGuessResponse {
  isCorrect: boolean;
  message: string;
  driver?: {
    id: string;
    firstname: string;
    lastname: string;
    image: string;
    nationality?: string;
  };
  brand?: {
    id: string;
    name: string;
    image: string;
  };
  season?: number;
  podiums?: number;
  wins?: number;
  champPos?: number;
  team?: string;
}

export interface GuessDriverHintResponse {
  hint: string;
  attemptNumber: number;
}

export interface GuessDriverSurrenderResponse {
  id: string;
  driver: {
    id: string;
    firstname: string;
    lastname: string;
    image: string;
    nationality?: string;
  };
  brand: {
    id: string;
    name: string;
    image: string;
  };
  season: number;
  podiums: number;
  wins: number;
  champPos: number;
  team: string;
}
