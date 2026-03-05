export class Season {
  id: string;
  edition: number;
  year: string;
  rounds: number;

  constructor(id: string, edition: number, year: string, rounds: number) {
    this.id = id;
    this.edition = edition;
    this.year = year;
    this.rounds = rounds;
  }
}
