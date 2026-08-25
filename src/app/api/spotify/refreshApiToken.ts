import { createClient } from '@/utils/supabase/server'

export type RefreshResult =
  | { ok: true; accessToken: string; refreshToken?: string }
  | { ok: false; message: string }

/**
 * Builds the `Authorization: Basic ...` header for the token endpoint.
 *
 * Preferred path is deriving it from the raw client id/secret so the base64
 * padding is always correct. The previous implementation hardcoded a trailing
 * "=" onto SPOTIFY_AUTHORIZATION_STRING, which produced a malformed header
 * whenever the stored value was already padded.
 */
function buildAuthorizationHeader(): string | null {
  const clientId =
    process.env.SPOTIFY_CLIENT_ID ?? process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (clientId && clientSecret) {
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    return `Basic ${encoded}`
  }

  // Fallback: a pre-encoded string in the environment. Re-pad it rather than
  // appending "=" blindly, since some hosts strip trailing padding.
  const preEncoded = process.env.SPOTIFY_AUTHORIZATION_STRING?.trim()
  if (!preEncoded) return null

  const unpadded = preEncoded.replace(/=+$/, '')
  const remainder = unpadded.length % 4
  const padding = remainder === 0 ? '' : '='.repeat(4 - remainder)
  return `Basic ${unpadded}${padding}`
}

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
      return {
        ok: false,
        message:
          payload?.error_description ??
          payload?.error ??
          `Spotify token refresh failed with status ${response.status}.`,
      }
    }
  } catch (error) {
    // The old code caught this but carried on, then read `response.refresh_token`
    // off an undefined value and threw a second, more confusing error.
    console.error('[spotify] token refresh request threw:', error)
    return {
      ok: false,
      message: 'An error occurred when refreshing the Spotify token.',
    }
  }

  // Only persist once the refresh has actually succeeded. Previously a failed
  // call wrote `undefined` over the stored access token.
  const expiresInMs = (Number(payload.expires_in) || 3600) * 1000

  const { error: dbError } = await createClient()
    .from('spotify')
    .update({
      access_token: payload.access_token,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + expiresInMs).toISOString(),
      // Spotify only returns a new refresh token occasionally; keep the
      // existing one when it does not.
      ...(payload.refresh_token
        ? { refresh_token: payload.refresh_token }
        : {}),
    })
    .eq('id', '1')
    .select()

  if (dbError) {
    // The token in hand is still valid, so serve the request and log the
    // write failure rather than failing the whole section.
    console.error('[spotify] failed to persist refreshed token:', dbError)
  }

  return {
    ok: true,
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
  }
}
