import { useState } from "react";
import type { NormalizedShot } from "~/utils/nhlTypes";
import { RINK_LENGTH, RINK_WIDTH } from "~/utils/coordinates";
import { getShotColor } from "~/utils/coordinates";

interface ShotPlotProps {
  shots: NormalizedShot[];
}

export function ShotPlot({ shots }: ShotPlotProps) {
  const [hoveredShot, setHoveredShot] = useState<{
    shot: NormalizedShot;
    x: number;
    y: number;
  } | null>(null);

  const toSVGX = (x: number): number => {
    return RINK_LENGTH / 2 + x;
  };

  const toSVGY = (y: number): number => {
    return RINK_WIDTH / 2 - y;
  };

  return (
    <>
      <g>
        {shots.map((shot, index) => {
          const svgX = toSVGX(shot.x);
          const svgY = toSVGY(shot.y);

          return (
            <circle
              key={`shot-${index}`}
              cx={svgX}
              cy={svgY}
              r={shot.isGoal ? 2.5 : 1.5}
              fill={getShotColor(shot.typeDescKey)}
              opacity={shot.isGoal ? 1 : 0.6}
              stroke={shot.isGoal ? "#FFF" : "none"}
              strokeWidth={shot.isGoal ? 0.5 : 0}
              onMouseEnter={() => setHoveredShot({ shot, x: svgX, y: svgY })}
              onMouseLeave={() => setHoveredShot(null)}
              style={{ cursor: "pointer" }}
            />
          );
        })}
        <g transform={`translate(10, ${RINK_WIDTH - 25})`}>
          <rect
            x="0"
            y="0"
            width="100"
            height="22"
            fill="white"
            opacity="0.9"
            rx="2"
          />
          <circle cx="8" cy="6" r="2" fill="#FFD700" />
          <text x="15" y="8" fontSize="4" fill="#000">
            Goals
          </text>
          <circle cx="8" cy="12" r="1.5" fill="#4CAF50" opacity="0.6" />
          <text x="15" y="14" fontSize="4" fill="#000">
            On Goal
          </text>
          <circle cx="8" cy="18" r="1.5" fill="#FF9800" opacity="0.6" />
          <text x="15" y="20" fontSize="4" fill="#000">
            Missed
          </text>
          <circle cx="55" cy="12" r="1.5" fill="#F44336" opacity="0.6" />
          <text x="62" y="14" fontSize="4" fill="#000">
            Blocked
          </text>
        </g>
        {hoveredShot && (
          <g>
            <rect
              x={hoveredShot.x + 5}
              y={hoveredShot.y - 30}
              width="85"
              height="35"
              fill="#1F2937"
              opacity="0.95"
              rx="3"
              stroke="#FFD700"
              strokeWidth="0.5"
            />
            <text
              x={hoveredShot.x + 8}
              y={hoveredShot.y - 23}
              fontSize="3.5"
              fill="#FFD700"
              fontWeight="bold"
            >
              {hoveredShot.shot.isGoal
                ? "GOAL!"
                : hoveredShot.shot.typeDescKey.toUpperCase()}
            </text>
            <text
              x={hoveredShot.x + 8}
              y={hoveredShot.y - 18}
              fontSize="3"
              fill="#FFF"
            >
              {hoveredShot.shot.teamAbbrev} - {hoveredShot.shot.shotType}
            </text>
            <text
              x={hoveredShot.x + 8}
              y={hoveredShot.y - 13}
              fontSize="3"
              fill="#9CA3AF"
            >
              Period {hoveredShot.shot.period} - {hoveredShot.shot.timeInPeriod}
            </text>
            <text
              x={hoveredShot.x + 8}
              y={hoveredShot.y - 8}
              fontSize="3"
              fill="#9CA3AF"
            >
              ({hoveredShot.shot.x.toFixed(0)}ft,{" "}
              {hoveredShot.shot.y.toFixed(0)}ft)
            </text>
            {hoveredShot.shot.shootingPlayerId && (
              <text
                x={hoveredShot.x + 8}
                y={hoveredShot.y - 3}
                fontSize="2.5"
                fill="#6B7280"
              >
                Player: #{hoveredShot.shot.shootingPlayerId}
              </text>
            )}
          </g>
        )}
      </g>
    </>
  );
}
