import type {
  PlayByPlayResponse,
  NormalizedShot,
  HeatMapData,
  GameInfo,
} from "./nhlTypes";

export const RINK_LENGTH = 200;
export const RINK_WIDTH = 85;

export function normalizeShotCoordinates(
  x: number,
  y: number,
  homeTeamDefendingSide: string,
  isHomeTeam: boolean
): { x: number; y: number } {
  let normalizedX = x;
  let normalizedY = y;

  if (
    (isHomeTeam && homeTeamDefendingSide === "left") ||
    (!isHomeTeam && homeTeamDefendingSide === "left")
  ) {
    normalizedX = -x;
    normalizedY = -y;
  }

  if (!isHomeTeam && homeTeamDefendingSide === "right") {
    normalizedX = x;
    normalizedY = y;
  }

  return { x: normalizedX, y: normalizedY };
}

export function transformToHeatmapData(data: PlayByPlayResponse): HeatMapData {
  const shots: NormalizedShot[] = [];

  for (const play of data.plays) {
    if (
      play.typeDescKey === "hit" ||
      play.typeDescKey === "takeaway" ||
      play.typeDescKey === "giveaway" ||
      play.typeDescKey === "penalty" ||
      play.typeDescKey === "faceoff"
    )
      continue;

    const details = play.details;
    if (
      !details ||
      details.xCoord === undefined ||
      details.yCoord === undefined
    ) {
      continue;
    }

    const isHomeTeam = details.eventOwnerTeamId === data.homeTeam.id;

    const normalized = normalizeShotCoordinates(
      details.xCoord,
      details.yCoord,
      play.homeTeamDefendingSide,
      isHomeTeam
    );
    const teamAbbrev = isHomeTeam ? data.homeTeam.abbrev : data.awayTeam.abbrev;

    shots.push({
      x: normalized.x,
      y: normalized.y,
      shotType: details.shotType || "unknown",
      typeDescKey: play.typeDescKey,
      period: play.periodDescriptor.number,
      periodType: play.periodDescriptor.periodType,
      timeInPeriod: play.timeInPeriod,
      teamId: details.eventOwnerTeamId,
      teamAbbrev,
      scoringChance: details.scoringChance || false,
      isGoal: play.typeDescKey === "goal",
      shootingPlayerId: details.shootingPlayerId,
      goalieInNetId: details.goalieInNetId,
    });
  }

  const gameInfo: GameInfo = {
    gameId: data.id.toString(),
    homeTeam: `${data.homeTeam.placeName.default} ${data.homeTeam.commonName.default}`,
    awayTeam: `${data.awayTeam.placeName.default} ${data.awayTeam.commonName.default}`,
    homeTeamAbbrev: data.homeTeam.abbrev,
    awayTeamAbbrev: data.awayTeam.abbrev,
    gameDate: data.gameDate,
  };

  return {
    shots,
    gameInfo,
  };
}

export function filterShotsByTeam(
  shots: NormalizedShot[],
  teamAbbrev: string
): NormalizedShot[] {
  return shots.filter((shot) => shot.teamAbbrev === teamAbbrev);
}

export function filterShotsByType(
  shots: NormalizedShot[],
  shotType: string
): NormalizedShot[] {
  return shots.filter((shot) => shot.shotType === shotType);
}

export const getShotColor = (shotType: string): string => {
  switch (shotType) {
    case "goal":
      return "#FFD700";
    case "shot-on-goal":
      return "#4CAF50";
    case "missed-shot":
      return "#FF9800";
    case "blocked-shot":
      return "#F44336";
    default:
      return "#9E9E9E";
  }
};
