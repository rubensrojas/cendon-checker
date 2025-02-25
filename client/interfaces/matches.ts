export interface MatchData {
  metadata: MatchMetadata;
  info: MatchInfo;
}

export interface MatchMetadata {
  dataVersion: string;
  matchId: string;
  participants: string[];
}

export interface MatchInfo {
  endOfGameResult: string;
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: Array<{
    PlayerScore0: number;
    PlayerScore1: number;
    PlayerScore2: number;
    PlayerScore3: number;
    PlayerScore4: number;
    PlayerScore5: number;
    PlayerScore6: number;
    PlayerScore7: number;
    PlayerScore8: number;
    PlayerScore9: number;
    PlayerScore10: number;
    PlayerScore11: number;
    allInPings: number;
    assistMePings: number;
    assists: number;
    baronKills: number;
    basicPings: number;
    bountyLevel: number;
    challenges: {
      [key: string]: number | string | boolean | number[];
    };
    champExperience: number;
    champLevel: number;
    championId: number;
    championName: string;
    championTransform: number;
    commandPings: number;
    consumablesPurchased: number;
    damageDealtToBuildings: number;
    damageDealtToObjectives: number;
    damageDealtToTurrets: number;
    damageSelfMitigated: number;
    dangerPings: number;
    deaths: number;
    detectorWardsPlaced: number;
    doubleKills: number;
    dragonKills: number;
    eligibleForProgression: boolean;
    enemyMissingPings: number;
    enemyVisionPings: number;
    firstBloodAssist: boolean;
    firstBloodKill: boolean;
    firstTowerAssist: boolean;
    firstTowerKill: boolean;
    gameEndedInEarlySurrender: boolean;
    gameEndedInSurrender: boolean;
    getBackPings: number;
    goldEarned: number;
    goldSpent: number;
    holdPings: number;
    individualPosition: string;
    inhibitorKills: number;
    inhibitorTakedowns: number;
    inhibitorsLost: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    item6: number;
    itemsPurchased: number;
    killingSprees: number;
    kills: number;
    lane: string;
    largestCriticalStrike: number;
    largestKillingSpree: number;
    largestMultiKill: number;
    longestTimeSpentLiving: number;
    magicDamageDealt: number;
    magicDamageDealtToChampions: number;
    magicDamageTaken: number;
    missions: {
      [key: string]: number;
    };
    needVisionPings: number;
    neutralMinionsKilled: number;
    nexusKills: number;
    nexusLost: number;
    nexusTakedowns: number;
    objectivesStolen: number;
    objectivesStolenAssists: number;
    onMyWayPings: number;
    participantId: number;
    pentaKills: number;
    perks: {
      statPerks: {
        defense: number;
        flex: number;
        offense: number;
      };
      styles: Array<{
        description: string;
        selections: Array<{
          perk: number;
          var1: number;
          var2: number;
          var3: number;
        }>;
        style: number;
      }>;
    };
    physicalDamageDealt: number;
    physicalDamageDealtToChampions: number;
    physicalDamageTaken: number;
    profileIcon: number;
    puuid: string;
    quadraKills: number;
    riotIdGameName: string;
    riotIdTagline: string;
    role: string;
    sightWardsBoughtInGame: number;
    spell1Casts: number;
    spell2Casts: number;
    spell3Casts: number;
    spell4Casts: number;
    summoner1Casts: number;
    summoner1Id: number;
    summoner2Casts: number;
    summoner2Id: number;
    summonerId: string;
    summonerLevel: number;
    summonerName: string;
    teamEarlySurrendered: boolean;
    teamId: number;
    teamPosition: string;
    timeCCingOthers: number;
    timePlayed: number;
    totalDamageDealt: number;
    totalDamageDealtToChampions: number;
    totalDamageShieldedOnTeammates: number;
    totalDamageTaken: number;
    totalHeal: number;
    totalHealsOnTeammates: number;
    totalMinionsKilled: number;
    totalTimeCCDealt: number;
    totalTimeSpentDead: number;
    totalUnitsHealed: number;
    tripleKills: number;
    trueDamageDealt: number;
    trueDamageDealtToChampions: number;
    trueDamageTaken: number;
    turretKills: number;
    turretTakedowns: number;
    turretsLost: number;
    unrealKills: number;
    visionScore: number;
    visionWardsBoughtInGame: number;
    wardsKilled: number;
    wardsPlaced: number;
    win: boolean;
  }>;
  platformId: string;
  queueId: number;
  teams: Array<{
    bans: number[];
    feats: {
      EPIC_MONSTER_KILL: {
        featState: number;
      };
      FIRST_BLOOD: {
        featState: number;
      };
      FIRST_TURRET: {
        featState: number;
      };
    };
    objectives: {
      atakhan: {
        first: boolean;
        kills: number;
      };
      baron: {
        first: boolean;
        kills: number;
      };
      champion: {
        first: boolean;
        kills: number;
      };
      dragon: {
        first: boolean;
        kills: number;
      };
      horde: {
        first: boolean;
        kills: number;
      };
      inhibitor: {
        first: boolean;
        kills: number;
      };
      riftHerald: {
        first: boolean;
        kills: number;
      };
      tower: {
        first: boolean;
        kills: number;
      };
    };
    teamId: number;
    win: boolean;
  }>;
  tournamentCode: string;
}

export type FormattedMatch = {
  id: string;
  date: number;
  win: boolean;
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  gold: number;
  gameLength: number;
  gameMode: string;
};
