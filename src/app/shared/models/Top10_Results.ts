import { Driver } from './Driver';
import { Team } from './Team';
import { Track } from './Track';

export class Top10Results {
  driverID?: string;
  teamID?: string;
  trackID?: string;
  totalStat?: string;
  Driver?: Driver;
  Team?: Team;
  Track?: Track;

  constructor(
    driverID?: string,
    teamID?: string,
    trackID?: string,
    totalStat?: string,
    Driver?: Driver,
    Team?: Team,
    Track?: Track
  ) {
    this.driverID = driverID;
    this.teamID = teamID;
    this.trackID = trackID;
    this.totalStat = totalStat;
    this.Driver = Driver;
    this.Team = Team;
    this.Track = Track;
  }
}
