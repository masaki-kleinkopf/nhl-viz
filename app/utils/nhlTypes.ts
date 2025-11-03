// NHL API Type Definitions

export interface PlayerResponse {
  playerId: number;
  firstName: {
    default: string;
  };
  lastName: {
    default: string;
  };
  sweaterNumber?: number;
  position?: string;
  headshot?: string;
}

export interface RosterSpot {
  teamId: number;
  playerId: number;
  firstName: {
    default: string;
  };
  lastName: {
    default: string;
  };
  sweaterNumber: number;
  positionCode: string;
  headshot: string;
}

export interface PlayByPlayResponse {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  venue: {
    default: string;
  };
  homeTeam: {
    id: number;
    commonName: {
      default: string;
    };
    placeName: {
      default: string;
    };
    abbrev: string;
  };
  awayTeam: {
    id: number;
    commonName: {
      default: string;
    };
    placeName: {
      default: string;
    };
    abbrev: string;
  };
  plays: Play[];
  rosterSpots: RosterSpot[];
}

export interface Play {
  eventId: number;
  periodDescriptor: {
    number: number;
    periodType: string;
  };
  timeInPeriod: string;
  timeRemaining: string;
  situationCode: string;
  homeTeamDefendingSide: string;
  typeCode: number;
  typeDescKey: string;
  sortOrder: number;
  details?: ShotDetails;
}

export interface ShotDetails {
  eventOwnerTeamId: number;
  shootingPlayerId?: number;
  scoringPlayerId?: number;
  goalieInNetId?: number;
  shotType?: string;
  xCoord?: number;
  yCoord?: number;
  zoneCode?: string;
  scoringChance?: boolean;
}

// Transformed data types for our visualization
export interface NormalizedShot {
  x: number;
  y: number;
  shotType: string;
  typeDescKey: string;
  period: number;
  periodType: string;
  timeInPeriod: string;
  teamId: number;
  teamAbbrev: string;
  scoringChance: boolean;
  isGoal: boolean;
  shootingPlayerId?: number;
  shooterName?: string;
  shooterHeadshot?: string;
}

export interface GameInfo {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamAbbrev: string;
  awayTeamAbbrev: string;
  gameDate: string;
}

export interface HeatMapData {
  shots: NormalizedShot[];
  gameInfo: GameInfo;
  roster: Map<number, RosterSpot>;
}
