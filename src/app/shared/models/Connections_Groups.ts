export class Connections_Groups {
  id: string;
  title: string;
  gameID: string;
  results: number;

  constructor(id: string, title: string, gameID: string, results: number) {
    this.id = id;
    this.title = title;
    this.gameID = gameID;
    this.results = results;
  }
}
