import { Driver } from './Driver';
import { Team } from './Team';
import { Track } from './Track';

export interface Top10Data {
  id: string;
  Driver?: Driver;
  Team?: Team;
  Track?: Track;
  totalStat: number;
  position: number;
}
