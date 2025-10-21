import { useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { fetchScheduleByDate, fetchPlayByPlay } from "~/models/nhl.server";
import { transformToHeatmapData } from "~/utils/coordinates";
import { GameThumbnail } from "~/components/GameThumbnail";
import type { HeatMapData } from "~/utils/nhlTypes";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");
  const today = new Date();
  const selectedDate = dateParam || today.toISOString().split("T")[0];

  try {
    const scheduleData = await fetchScheduleByDate(selectedDate);
    const gamesWithData: Array<{ gameId: string; heatmapData: HeatMapData }> =
      [];

    if (scheduleData.gameWeek && scheduleData.gameWeek.length > 0) {
      const selectedDay = scheduleData.gameWeek.find(
        (day: any) => day.date === selectedDate
      );

      if (selectedDay && selectedDay.games) {
        const now = new Date();

        for (const game of selectedDay.games) {
          // Skip games that haven't started yet
          if (game.startTimeUTC) {
            const gameStartTime = new Date(game.startTimeUTC);
            if (gameStartTime > now) {
              continue;
            }
          }

          try {
            const playByPlayData = await fetchPlayByPlay(game.id.toString());
            const heatmapData = transformToHeatmapData(playByPlayData);
            gamesWithData.push({
              gameId: game.id.toString(),
              heatmapData,
            });
          } catch (error) {
            console.error(`Failed to load game ${game.id}:`, error);
          }
        }
      }
    }

    return {
      games: gamesWithData,
      selectedDate,
    };
  } catch (error) {
    console.error("Failed to load schedule:", error);
    return {
      games: [],
      selectedDate,
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NHL Shot Attempt Chart Visualization" },
    { name: "description", content: "Visualize NHL shot data with heat maps" },
  ];
}

export default function Home() {
  const { games, selectedDate } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    navigate(`/?date=${newDate}`, { viewTransition: true });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            NHL Shot Attempt Chart Visualization
          </h1>
          <p className="text-xl text-gray-300">
            Select a date to view games and their shot charts
          </p>
        </header>
        <main>
          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium mb-2"
                >
                  Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
            </div>
          </div>
          {games.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Games on {selectedDate}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <GameThumbnail
                    key={game.gameId}
                    gameId={game.gameId}
                    heatmapData={game.heatmapData}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-400">No games found for {selectedDate}</p>
              <p className="text-sm text-gray-500 mt-2">
                Try selecting a different date during the NHL season
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
