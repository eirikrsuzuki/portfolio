import { createClient } from '@/utils/supabase/server'

/** Primary key of the single token record in the `spotify` table. */
export const SPOTIFY_TOKEN_ROW_ID = '1'

/** The scopes this portfolio's Spotify section actually needs. */
export const SPOTIFY_SCOPES = [
  'user-top-read', // top/artists
  'user-read-recently-played', // player/recently-played
  'user-read-currently-playing', // player
  'user-read-playback-state', // player
].join(' ')

/**
 * Builds the `Authorization: Basic ...` header for the Spotify token endpoint.
 *
 * Preferred path is deriving it from the raw client id/secret so the base64
 * padding is always correct. The `SPOTIFY_AUTHORIZATION_STRING` fallback is
 * re-padded rather than having a "=" appended, which is what used to produce a
 * malformed header when the stored value was already padded.
 */
export function buildAuthorizationHeader(): string | null {
  const clientId =
    process.env.SPOTIFY_CLIENT_ID ?? process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (clientId && clientSecret) {
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    return `Basic ${encoded}`
  }

  const preEncoded = process.env.SPOTIFY_AUTHORIZATION_STRING?.trim()
  if (!preEncoded) return null

  const unpadded = preEncoded.replace(/=+$/, '')
  const remainder = unpadded.length % 4
  const padding = remainder === 0 ? '' : '='.repeat(4 - remainder)
  return `Basic ${unpadded}${padding}`
}

/**
 * The redirect URI used for the authorization code flow. This exact string has
 * to be registered in the Spotify dashboard *and* sent identically on both the
 * /authorize and /api/token calls, or Spotify rejects the exchange.
 */
export function getRedirectUri(): string | null {
  const explicit = process.env.SPOTIFY_REDIRECT_URI?.trim()
  if (explicit) return explicit

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!site) return null

  return `${site.replace(/\/+$/, '')}/api/spotify/callback`
}

interface TokenPayload {
  access_token: string
  refresh_token?: string
  expires_in?: number | string
}

/**
 * Writes a token set to Supabase. Updates the existing row, and falls back to
 * an insert so a first-time setup works even when the row is absent.
 */
export async function persistTokens(
  tokens: TokenPayload
): Promise<{ ok: true } | { ok: false; message: string }> {
  const expiresInMs = (Number(tokens.expires_in) || 3600) * 1000
  const nowIso = new Date().toISOString()
  const expiresAtIso = new Date(Date.now() + expiresInMs).toISOString()

  const record = {
    access_token: tokens.access_token,
    created_at: nowIso,
    expires_at: expiresAtIso,
    // Spotify only returns a new refresh token sometimes; never overwrite a
    // good one with undefined.
    ...(tokens.refresh_token ? { refresh_token: tokens.refresh_token } : {}),
  }

  const supabase = createClient()

  const { data: updated, error: updateError } = await supabase
    .from('spotify')
    .update(record)
    .eq('id', SPOTIFY_TOKEN_ROW_ID)
    .select()

  if (updateError) {
    return { ok: false, message: updateError.message }
  }

  if (!updated || updated.length === 0) {
    const { error: insertError } = await supabase
      .from('spotify')
      .insert({ id: SPOTIFY_TOKEN_ROW_ID, ...record })
      .select()

    if (insertError) {
      return { ok: false, message: insertError.message }
    }
  }

  return { ok: true }
}
