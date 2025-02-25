export interface Player {
  id: number;
  name: string;
  tag: string;
}

export interface Match {
  match_id: string;
  data: string;
  game_start_timestamp: number;
}

export interface MatchPlayer {
  match_id: string;
  player_id: number;
  champion: string;
  game_start_timestamp: number;
  win: number;
}
