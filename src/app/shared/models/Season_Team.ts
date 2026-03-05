export class Season_Team {
  id: string;
  seasonID: string;
  teamID: string;
  chassis: string;
  engine: string;
  poles: number;
  points: number;
  podiums: number;
  wins: number;
  standings: number;

  constructor(
    id: string,
    seasonID: string,
    teamID: string,
    chassis: string,
    engine: string,
    poles: number,
    points: number,
    podiums: number,
    wins: number,
    standings: number
  ) {
    this.id = id;
    this.seasonID = seasonID;
    this.teamID = teamID;
    this.chassis = chassis;
    this.engine = engine;
    this.poles = poles;
    this.points = points;
    this.podiums = podiums;
    this.wins = wins;
    this.standings = standings;
  }
}
