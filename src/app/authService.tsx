const getHeaders = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': `application/json`,
  },
}

type SpotifyTimeRange = 'short_term' | 'medium_term' | 'long_term'

/**
 * Fetches one of our /api/spotify proxies and returns the parsed body, or null
 * on any failure. Error payloads (`{ error: ... }`) are turned into null here
 * so callers never mistake them for data.
 */
async function fetchSpotify(path: string): Promise<any | null> {
  try {
    const response = await fetch(path, getHeaders)
    if (!response.ok) {
      console.error(`[spotify] ${path} responded with ${response.status}`)
      return null
    }
    return await response.json()
  } catch (error) {
    console.log(error)
    return null
  }
}

/** Spotify wraps list endpoints in `{ items: [...] }`; unwrap to a plain array. */
function toItems(body: any): any[] {
  return Array.isArray(body?.items) ? body.items : []
}

export async function getSpotifyTopArtists(
  limit: number = 48,
  timeRange: SpotifyTimeRange = 'medium_term'
): Promise<any[]> {
  return toItems(
    await fetchSpotify(
      `/api/spotify?endpoint=top/artists&limit=${limit}&time_range=${timeRange}`
    )
  )
}

export async function getSpotifyRecentlyPlayed(
  limit: number = 10
): Promise<any[]> {
  return toItems(
    await fetchSpotify(
      `/api/spotify?endpoint=player/recently-played&limit=${limit}`
    )
  )
}

/** Returns the playback state, or null when nothing is playing or on error. */
export async function getSpotifyPlayingNow(): Promise<any | null> {
  return await fetchSpotify(`/api/spotify?endpoint=player`)
}

export async function getSteamGameInfo(steamAppID: number) {
  try {
    const response = await fetch(
      `/api/steam/game-details?appid=${steamAppID}`,
      getHeaders
    )
    if (response) return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export async function getSteamPlayerInfo() {
  try {
    const response = await fetch(`/api/steam/player-details`, getHeaders)
    if (response) return await response.json()
  } catch (error) {
    console.log(error)
  }
}

export async function getTemperatureFromSmile(smile: string) {
  try {
    const response = await fetch(
      `/api/coding-interview?smile=${smile}`,
      getHeaders
    )
    if (response) return await response.json()
  } catch (error) {
    console.log(error)
  }
}
