import { Link } from "react-router";
import type { HeatMapData } from "~/utils/nhlTypes";
import { RINK_LENGTH, RINK_WIDTH } from "~/utils/coordinates";
import { getShotColor } from "~/utils/coordinates";

interface GameThumbnailProps {
  gameId: string;
  heatmapData: HeatMapData;
}

export function GameThumbnail({ gameId, heatmapData }: GameThumbnailProps) {
  const { shots, gameInfo } = heatmapData;

  const toSVGX = (x: number): number => {
    return RINK_LENGTH / 2 + x;
  };

  const toSVGY = (y: number): number => {
    return RINK_WIDTH / 2 - y;
  };

  return (
    <Link
      viewTransition
      to={`/game/${gameId}`}
      className="block bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition duration-200"
    >
      <div className="mb-3">
        <div className="text-sm font-semibold text-gray-900">
          {gameInfo.awayTeamAbbrev} @ {gameInfo.homeTeamAbbrev}
        </div>
        <div className="text-xs text-gray-600">
          {new Date(gameInfo.gameDate).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-500">{shots.length} shots</div>
      </div>

      <svg
        viewBox={`0 0 ${RINK_LENGTH} ${RINK_WIDTH}`}
        className="w-full h-auto bg-gray-50 rounded border border-gray-100"
      >
        <rect
          x="0"
          y="0"
          width={RINK_LENGTH}
          height={RINK_WIDTH}
          fill="#F9FAFB"
        />

        <line
          x1={RINK_LENGTH / 2}
          y1="0"
          x2={RINK_LENGTH / 2}
          y2={RINK_WIDTH}
          stroke="#003E7E"
          strokeWidth="0.5"
          opacity="0.2"
        />

        {shots.map((shot, index) => (
          <circle
            key={`thumb-shot-${index}`}
            cx={toSVGX(shot.x)}
            cy={toSVGY(shot.y)}
            r={shot.isGoal ? 1.5 : 0.8}
            fill={getShotColor(shot.typeDescKey)}
            opacity={shot.isGoal ? 0.9 : 0.6}
          />
        ))}
      </svg>
    </Link>
  );
}
