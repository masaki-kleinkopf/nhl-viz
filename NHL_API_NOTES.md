# NHL API - Shot Heat Map Project Notes

## Project Idea
Build an NHL shot quality heat map visualization using React Router v7 (framework mode) to experiment with data visualization and using an AI coding assistant (no vibe coding).

## Working API Endpoint

### Play-by-Play Data (Current API - 2025)
```
https://api-web.nhle.com/v1/gamecenter/{game-id}/play-by-play
```

**Example:**
```
https://api-web.nhle.com/v1/gamecenter/2024020240/play-by-play
```

**Response includes:**
- All game events in `plays` array
- Shot events with coordinates
- Player info, timestamps, shot types, etc.

### Finding Game IDs
```
https://api-web.nhle.com/v1/schedule/now
```

Returns current/recent games with their IDs.

### Game ID Format
Format: `2024020001`
- `2024` = season year
- `02` = game type (01=preseason, 02=regular season, 03=playoffs)
- `0001` = game number

### Legacy API (Still Works, More Documented)
```
https://statsapi.web.nhl.com/api/v1/game/{game-id}/feed/live
```

## Shot Coordinate Data Structure

Each shot event in the `plays` array contains:
- `typeDescKey`: "shot-on-goal", "missed-shot", "blocked-shot", "goal"
- `details.xCoord`: X coordinate in US feet
- `details.yCoord`: Y coordinate in US feet
- `details.shotType`: Wrist shot, slap shot, snap shot, etc.
- `details.scoringChance`: Whether it was a scoring chance (if available)
- Player information
- Time, period, team info

## Rink Coordinate System

**Dimensions:**
- Rink: 200ft × 85ft
- Corners: 28ft radius
- Goal line: 11ft from boards (89ft from center)
- Blue line: 64ft from goal line (25ft from center)
- Origin: Center ice (0, 0)

**IMPORTANT:** Coordinate system orientation (which direction is positive X) varies by home/away between games. You'll need to normalize this so all shots go the same direction for visualization.

## Tech Stack Recommendations

### React Router v7 (Framework Mode)
- Use loaders for server-side data fetching
- Transform data server-side before sending to client
- Resource routes for JSON APIs if needed
- Easy deployment to Cloudflare/Vercel/Netlify

### Visualization Libraries
- **D3.js** - Most powerful, steeper learning curve
- **Recharts** - React-friendly, good for standard charts
- **Visx** (Airbnb) - D3 primitives as React components, great for custom viz
- **Nivo** - Beautiful defaults, less customization
- **Raw SVG** - Full control for rink overlay + hexbins

## Implementation Approach

### 1. Data Fetching (Loader)
```typescript
// routes/game.$gameId.tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const playByPlay = await fetch(
    `https://api-web.nhle.com/v1/gamecenter/${params.gameId}/play-by-play`
  );
  const data = await playByPlay.json();

  // Transform shots server-side
  const shots = data.plays.filter(play =>
    ['shot-on-goal', 'goal', 'missed-shot'].includes(play.typeDescKey)
  );

  const heatmapData = transformToHeatmap(shots);

  return json({ heatmapData, gameInfo: data.gameInfo });
}
```

### 2. Coordinate Normalization
Normalize all shots to shoot in the same direction (e.g., always left-to-right) to make heat maps comparable across games.

### 3. Visualization Options
- **Hexbin heat map** - Group shots into hexagonal bins, color by frequency/success rate
- **Scatter plot with opacity** - Raw shot locations with alpha blending
- **Contour/density map** - Smooth interpolation showing hot zones
- **Rink overlay** - SVG rink diagram with accurate dimensions

### 4. Features to Consider
- Filter by shot type (wrist, slap, snap, etc.)
- Filter by player or team
- Compare multiple games/seasons
- Show shot success rate by zone
- Animate shots chronologically through game

## Project Structure
```
my-nhl-viz/
├── app/
│   ├── routes/
│   │   ├── _index.tsx           # Home - game picker
│   │   ├── game.$gameId.tsx     # Heat map visualization
│   │   └── api.games.ts         # Resource route for game list
│   ├── components/
│   │   ├── RinkDiagram.tsx
│   │   ├── ShotHeatMap.tsx
│   │   └── GameSelector.tsx
│   └── utils/
│       ├── nhlApi.ts            # API fetch helpers
│       └── coordinates.ts       # Normalization logic
```

## Additional Resources
- [NHL API Reference (Zmalski)](https://github.com/Zmalski/NHL-API-Reference)
- [NHL API Docs (dword4)](https://github.com/dword4/nhlapi)
- React Router v7 Docs: https://reactrouter.com

## Notes
- API responses can be large (200KB-800KB for live games)
- No authentication required
- API is unofficial and could change
- Consider caching transformed data in loaders
- Use TypeScript for better API response typing
