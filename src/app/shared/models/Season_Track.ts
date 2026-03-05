export class Season_Track {
  id?: string;
  seasonID: string;
  trackID: string;
  round_number: number;
  laps: number;
  sprint: boolean;

  constructor(
    id: string | undefined,
    seasonID: string,
    trackID: string,
    round_number: number,
    laps: number,
    sprint: boolean
  ) {
    this.id = id;
    this.seasonID = seasonID;
    this.trackID = trackID;
    this.round_number = round_number;
    this.laps = laps;
    this.sprint = sprint;
  }
}
