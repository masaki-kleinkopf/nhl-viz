import type { PlayByPlayResponse } from "~/utils/nhlTypes";

const NHL_API_BASE = "https://api-web.nhle.com/v1";

export async function fetchPlayByPlay(
  gameId: string
): Promise<PlayByPlayResponse> {
  const url = `${NHL_API_BASE}/gamecenter/${gameId}/play-by-play`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `NHL API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Failed to fetch play-by-play for game ${gameId}:`, error);
    throw error;
  }
}

export async function fetchScheduleByDate(date: string): Promise<any> {
  const url = `${NHL_API_BASE}/schedule/${date}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `NHL API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch schedule for ${date}:`, error);
    throw error;
  }
}

export async function fetchSchedule(): Promise<any> {
  const url = `${NHL_API_BASE}/schedule/now`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `NHL API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    throw error;
  }
}
