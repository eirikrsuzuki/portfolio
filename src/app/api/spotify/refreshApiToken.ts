import { buildAuthorizationHeader, persistTokens } from './spotifyAuth'

export type RefreshResult =
  | { ok: true; accessToken: string; refreshToken?: string }
  | { ok: false; message: string }

export async function refreshApiToken(
  refreshToken?: string | null
): Promise<RefreshResult> {
  if (!refreshToken) {
    return { ok: false, message: 'No Spotify refresh token is stored.' }
  }

  const authorization = buildAuthorizationHeader()
  if (!authorization) {
    return {
      ok: false,
      message:
        'Spotify client credentials are not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET (or SPOTIFY_AUTHORIZATION_STRING).',
    }
  }

  let payload: any = null

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      cache: 'no-store',
    })

    payload = await response.json().catch(() => null)

    if (!response.ok || !payload?.access_token) {
      const message =
        payload?.error_description ??
        payload?.error ??
        `Spotify token refresh failed with status ${response.status}.`

      // `invalid_grant` means the grant is gone for good — no amount of
      // retrying helps, the flow at /api/spotify/authorize has to be re-run.
      if (payload?.error === 'invalid_grant') {
        console.error(
          `[spotify] refresh token is no longer valid (${message}). Re-run /api/spotify/authorize to issue a new one.`
        )
      }

      return { ok: false, message }
    }
  } catch (error) {
    console.error('[spotify] token refresh request threw:', error)
    return {
      ok: false,
      message: 'An error occurred when refreshing the Spotify token.',
    }
  }

  const persisted = await persistTokens(payload)
  if (!persisted.ok) {
    // The token in hand is still valid, so serve the request and log the write
    // failure rather than failing the whole section.
    console.error(
      '[spotify] failed to persist refreshed token:',
      persisted.message
    )
  }

  return {
    ok: true,
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
  }
}
