export class TimelineEvent {
  id: string;
  description: string;
  image: string;
  eventDate: string;
  gameID: string;
  temporaryFile: File | null = null;

  constructor(
    id: string,
    description: string,
    image: string,
    eventDate: string,
    gameID: string,
  ) {
    this.id = id;
    this.description = description;
    this.image = image;
    this.eventDate = eventDate;
    this.gameID = gameID;
  }
}
