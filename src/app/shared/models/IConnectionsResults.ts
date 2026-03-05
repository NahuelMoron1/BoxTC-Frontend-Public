import { Driver } from './Driver';
import { Team } from './Team';
import { Track } from './Track';

export interface Connections_Results {
  driver?: Driver[];
  team?: Team[];
  track?: Track[];
  groupID?: string;
}
