import { useLoaderData } from "react-router";
import type { Route } from "./+types/game.$gameId";
import { fetchPlayByPlay } from "~/models/nhl.server";
import { transformToHeatmapData } from "~/utils/coordinates";
import { RinkDiagram } from "~/components/RinkDiagram";
import { ShotPlot } from "~/components/ShotPlot";

export async function loader({ params }: Route.LoaderArgs) {
  const { gameId } = params;

  if (!gameId) {
    throw new Response("Game ID is required", { status: 400 });
  }

  try {
    const playByPlayData = await fetchPlayByPlay(gameId);
    const heatmapData = transformToHeatmapData(playByPlayData);

    return {
      heatmapData,
    };
  } catch (error) {
    console.error("Error loading game data:", error);
    throw new Response("Failed to load game data", { status: 500 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Game Not Found" }];
  }

  return [
    {
      title: `${data.heatmapData.gameInfo.awayTeam} @ ${data.heatmapData.gameInfo.homeTeam} - Shot Chart`,
    },
    {
      name: "description",
      content: `Shot chart visualization for NHL game on ${data.heatmapData.gameInfo.gameDate}`,
    },
  ];
}

export default function Game() {
  const { heatmapData } = useLoaderData<typeof loader>();
  const { shots, gameInfo } = heatmapData;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shot Chart Visualization</h1>
          <div className="text-gray-300">
            <p className="text-xl mb-1">
              {gameInfo.awayTeam} @ {gameInfo.homeTeam}
            </p>
            <p className="text-sm text-gray-400">
              Game Date: {new Date(gameInfo.gameDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400">Total Shots: {shots.length}</p>
          </div>
        </header>
        <main>
          <div className="bg-gray-800 rounded-lg p-6">
            <RinkDiagram>
              <ShotPlot shots={shots} />
            </RinkDiagram>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">By Team</h3>
              <div className="text-sm text-gray-300">
                {Object.entries(
                  shots.reduce(
                    (acc, shot) => {
                      acc[shot.teamAbbrev] = (acc[shot.teamAbbrev] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number>
                  )
                ).map(([team, count]) => (
                  <p key={team}>
                    {team}: {count}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
