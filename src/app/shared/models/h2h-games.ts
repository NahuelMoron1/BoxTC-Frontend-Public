export interface H2HGames {
  id: string;
  title: string;
  date: string;
  year: string;
  team_id: string;
  driver1_id: string;
  driver2_id: string;
  total_races: number;
  qualifying_driver1: number;
  qualifying_driver2: number;
  race_driver1: number;
  race_driver2: number;
  points_driver1: number;
  points_driver2: number;
  dnf_driver1: number;
  dnf_driver2: number;
  points_finishes_driver1: number;
  points_finishes_driver2: number;
  driver1_name?: string;
  driver2_name?: string;
  driver1_logo?: string;
  driver2_logo?: string;
}
