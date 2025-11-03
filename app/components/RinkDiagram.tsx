import { RINK_LENGTH, RINK_WIDTH } from "~/utils/coordinates";

interface RinkDiagramProps {
  children?: React.ReactNode;
}

export function RinkDiagram({ children }: RinkDiagramProps) {
  const viewBoxWidth = RINK_LENGTH;
  const viewBoxHeight = RINK_WIDTH;
  const cornerRadius = 28;
  const goalLineDistance = 11;
  const blueLineDistance = 64;
  const centerX = RINK_LENGTH / 2;
  const creaseRadius = 6;
  const creaseX = goalLineDistance;

  // Create a path for a proper hockey rink shape with rounded ends
  const rinkPath = `
    M ${cornerRadius} 0
    L ${viewBoxWidth - cornerRadius} 0
    Q ${viewBoxWidth} 0 ${viewBoxWidth} ${cornerRadius}
    L ${viewBoxWidth} ${viewBoxHeight - cornerRadius}
    Q ${viewBoxWidth} ${viewBoxHeight} ${viewBoxWidth - cornerRadius} ${viewBoxHeight}
    L ${cornerRadius} ${viewBoxHeight}
    Q 0 ${viewBoxHeight} 0 ${viewBoxHeight - cornerRadius}
    L 0 ${cornerRadius}
    Q 0 0 ${cornerRadius} 0
    Z
  `;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`-5 -5 ${viewBoxWidth + 10} ${viewBoxHeight + 10}`}
        className="w-full h-auto"
        style={{ maxHeight: "70vh" }}
      >
        {/* Outer boards/stadium area */}
        <rect
          x="-5"
          y="-5"
          width={viewBoxWidth + 10}
          height={viewBoxHeight + 10}
          fill="#4B5563"
          rx={cornerRadius + 2}
        />

        {/* Ice surface */}
        <path
          d={rinkPath}
          fill="#FFFFFF"
          stroke="#D1D5DB"
          strokeWidth="0.5"
        />

        <line
          x1={centerX}
          y1="0"
          x2={centerX}
          y2={viewBoxHeight}
          stroke="#C8102E"
          strokeWidth="1"
        />

        <line
          x1={goalLineDistance + blueLineDistance}
          y1="0"
          x2={goalLineDistance + blueLineDistance}
          y2={viewBoxHeight}
          stroke="#003E7E"
          strokeWidth="1"
        />
        <line
          x1={RINK_LENGTH - (goalLineDistance + blueLineDistance)}
          y1="0"
          x2={RINK_LENGTH - (goalLineDistance + blueLineDistance)}
          y2={viewBoxHeight}
          stroke="#003E7E"
          strokeWidth="1"
        />

        <line
          x1={goalLineDistance}
          y1="0"
          x2={goalLineDistance}
          y2={viewBoxHeight}
          stroke="#C8102E"
          strokeWidth="0.5"
        />
        <line
          x1={RINK_LENGTH - goalLineDistance}
          y1="0"
          x2={RINK_LENGTH - goalLineDistance}
          y2={viewBoxHeight}
          stroke="#C8102E"
          strokeWidth="0.5"
        />
        <circle
          cx={centerX}
          cy={viewBoxHeight / 2}
          r="15"
          fill="none"
          stroke="#003E7E"
          strokeWidth="0.5"
        />

        <circle
          cx={centerX}
          cy={viewBoxHeight / 2}
          r="1"
          fill="#003E7E"
        />
        <circle
          cx={goalLineDistance + 20}
          cy={viewBoxHeight / 2 - 22}
          r="15"
          fill="none"
          stroke="#C8102E"
          strokeWidth="0.5"
        />
        <circle
          cx={goalLineDistance + 20}
          cy={viewBoxHeight / 2 + 22}
          r="15"
          fill="none"
          stroke="#C8102E"
          strokeWidth="0.5"
        />
        <circle
          cx={RINK_LENGTH - (goalLineDistance + 20)}
          cy={viewBoxHeight / 2 - 22}
          r="15"
          fill="none"
          stroke="#C8102E"
          strokeWidth="0.5"
        />
        <circle
          cx={RINK_LENGTH - (goalLineDistance + 20)}
          cy={viewBoxHeight / 2 + 22}
          r="15"
          fill="none"
          stroke="#C8102E"
          strokeWidth="0.5"
        />
        <path
          d={`M ${creaseX} ${viewBoxHeight / 2 - creaseRadius}
              L ${creaseX + 4} ${viewBoxHeight / 2 - creaseRadius}
              A ${creaseRadius} ${creaseRadius} 0 0 1 ${creaseX + 4} ${viewBoxHeight / 2 + creaseRadius}
              L ${creaseX} ${viewBoxHeight / 2 + creaseRadius}
              Z`}
          fill="none"
          stroke="#C8102E"
          strokeWidth="0.5"
        />
        <path
          d={`M ${RINK_LENGTH - creaseX} ${viewBoxHeight / 2 - creaseRadius}
              L ${RINK_LENGTH - creaseX - 4} ${viewBoxHeight / 2 - creaseRadius}
              A ${creaseRadius} ${creaseRadius} 0 0 0 ${RINK_LENGTH - creaseX - 4} ${viewBoxHeight / 2 + creaseRadius}
              L ${RINK_LENGTH - creaseX} ${viewBoxHeight / 2 + creaseRadius}
              Z`}
          fill="none"
          stroke="#C8102E"
          strokeWidth="0.5"
        />
        {children}
      </svg>
    </div>
  );
}
