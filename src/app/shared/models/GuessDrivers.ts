export interface TeamWithYears {
  id: string;
  start_year?: number;
  end_year?: number;
}

export class GuessDrivers {
  id: string;
  date: string;
  driver_id: string;
  teams: (string | TeamWithYears)[];

  constructor(
    id: string,
    date: string,
    driver_id: string,
    teams: (string | TeamWithYears)[]
  ) {
    this.id = id;
    this.date = date;
    this.driver_id = driver_id;
    this.teams = teams;
  }
}

export interface GuessDriversComplete {
  id: string;
  date: string;
  Driver: {
    id: string;
    firstname: string;
    lastname: string;
    nationality: string;
    image: string;
  };
  Teams: {
    id: string;
    Team: {
      id: string;
      name: string;
      common_name: string;
      logo: string;
    };
    ordered: number;
    start_year?: number;
    end_year?: number;
  }[];
  totalTeams?: number; // Nueva propiedad para el total de equipos
}