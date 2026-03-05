export class Connections_Groups_Results {
  id: string;
  gameID: string;
  groupID: string;
  resultID: string;

  constructor(id: string, gameID: string, groupID: string, resultID: string) {
    this.id = id;
    this.gameID = gameID;
    this.groupID = groupID;
    this.resultID = resultID;
  }
}
