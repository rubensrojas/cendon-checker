export interface Player {
  id: number;
  name: string;
  tag: string;
}

export interface Match {
  match_id: string;
  data: string;
}

export interface MatchPlayer {
  match_id: string;
  player_id: number;
}