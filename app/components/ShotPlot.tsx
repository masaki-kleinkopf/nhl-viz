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
            opacity="0.95"
            rx="2"
            stroke="#E5E7EB"
            strokeWidth="0.5"
          />
          <circle cx="8" cy="6" r="2" fill="#FFD700" />
          <text x="15" y="8" fontSize="4" fill="#111827" fontWeight="500">
            Goals
          </text>
          <circle cx="8" cy="12" r="1.5" fill="#4CAF50" opacity="0.6" />
          <text x="15" y="14" fontSize="4" fill="#111827" fontWeight="500">
            On Goal
          </text>
          <circle cx="8" cy="18" r="1.5" fill="#FF9800" opacity="0.6" />
          <text x="15" y="20" fontSize="4" fill="#111827" fontWeight="500">
            Missed
          </text>
          <circle cx="55" cy="12" r="1.5" fill="#F44336" opacity="0.6" />
          <text x="62" y="14" fontSize="4" fill="#111827" fontWeight="500">
            Blocked
          </text>
        </g>
        {hoveredShot && (
          <g>
            <rect
              x={hoveredShot.x + 5}
              y={hoveredShot.y - 35}
              width={hoveredShot.shot.shooterHeadshot ? 65 : 45}
              height={hoveredShot.shot.shooterHeadshot ? 40 : 35}
              fill="#FFFFFF"
              opacity="0.98"
              rx="3"
              stroke="#D1D5DB"
              strokeWidth="0.8"
            />
            {hoveredShot.shot.shooterHeadshot && (
              <>
                <defs>
                  <clipPath id={`clip-${hoveredShot.shot.shootingPlayerId}`}>
                    <circle cx={hoveredShot.x + 58} cy={hoveredShot.y - 21} r="6" />
                  </clipPath>
                </defs>
                <image
                  href={hoveredShot.shot.shooterHeadshot}
                  x={hoveredShot.x + 52}
                  y={hoveredShot.y - 27}
                  width="12"
                  height="12"
                  clipPath={`url(#clip-${hoveredShot.shot.shootingPlayerId})`}
                />
                <circle
                  cx={hoveredShot.x + 58}
                  cy={hoveredShot.y - 21}
                  r="6"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="0.5"
                />
              </>
            )}
            <text
              x={hoveredShot.x + 8}
              y={hoveredShot.y - 28}
              fontSize="3.5"
              fill="#111827"
              fontWeight="bold"
            >
              {hoveredShot.shot.isGoal
                ? "GOAL!"
                : hoveredShot.shot.typeDescKey.toUpperCase()}
            </text>
            <text
              x={hoveredShot.x + 8}
              y={hoveredShot.y - 23}
              fontSize="3"
              fill="#374151"
              fontWeight="500"
            >
              {hoveredShot.shot.teamAbbrev} - {hoveredShot.shot.shotType}
            </text>
            <text
              x={hoveredShot.x + 8}
              y={hoveredShot.y - 18}
              fontSize="3"
              fill="#6B7280"
            >
              Period {hoveredShot.shot.period} - {hoveredShot.shot.timeInPeriod}
            </text>
            <text
              x={hoveredShot.x + 8}
              y={hoveredShot.y - 13}
              fontSize="3"
              fill="#6B7280"
            >
              ({hoveredShot.shot.x.toFixed(0)}ft,{" "}
              {hoveredShot.shot.y.toFixed(0)}ft)
            </text>
            {hoveredShot.shot.shooterName && (
              <text
                x={hoveredShot.x + 8}
                y={hoveredShot.y - 8}
                fontSize="2.5"
                fill="#9CA3AF"
              >
                {hoveredShot.shot.shooterName}
              </text>
            )}
          </g>
        )}
      </g>
    </>
  );
}
