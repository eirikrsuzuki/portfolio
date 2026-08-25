import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { refreshApiToken } from './refreshApiToken'

export const dynamic = 'force-dynamic'

/**
 * Result of a call to the Spotify Web API, normalised so that callers never
 * have to guess whether they are holding data or an error payload.
 */
type SpotifyResult =
  | { ok: true; data: any }
  | { ok: false; status: number; message: string }

/** Spotify only accepts `time_range` on the `top/*` endpoints. */
const acceptsTimeRange = (endpoint: string) => endpoint.startsWith('top/')

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams
  const endpoint = searchParams.get('endpoint')
  const timeRange = searchParams.get('time_range') ?? 'medium_term'
  const limit = searchParams.get('limit') ?? '20'

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Missing required "endpoint" query parameter.' },
      { status: 400 }
    )
  }

  async function fetchData(accessToken: string): Promise<SpotifyResult> {
    const url = new URL(`https://api.spotify.com/v1/me/${endpoint}`)
    url.searchParams.set('limit', limit)
    if (acceptsTimeRange(endpoint!)) {
      url.searchParams.set('time_range', timeRange)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    // `/me/player` answers 204 with an empty body when nothing is playing.
    // That is a valid state, not a failure.
    if (response.status === 204) return { ok: true, data: null }

    const body = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message:
          body?.error?.message ??
          `Spotify responded with status ${response.status}.`,
      }
    }

    return { ok: true, data: body }
  }

  try {
    const { data: existingTokens, error: dbError } = await createClient()
      .from('spotify')
      .select('*')
      .single()

    // The old version dereferenced `existingTokens.expires_at` immediately,
    // which threw a 500 whenever the row was missing or the query errored.
    if (dbError || !existingTokens?.access_token) {
      console.error('[spotify] token lookup failed:', dbError)
      return NextResponse.json(
        { error: 'Spotify credentials are unavailable.' },
        { status: 503 }
      )
    }

    const expiresAt = new Date(existingTokens.expires_at).getTime()
    // Treat an unparseable timestamp as expired, and refresh 60s early so a
    // token cannot lapse in the middle of a request.
    const tokenHasExpired =
      Number.isNaN(expiresAt) || Date.now() > expiresAt - 60_000

    let accessToken: string = existingTokens.access_token

    if (tokenHasExpired) {
      const refreshed = await refreshApiToken(existingTokens.refresh_token)
      if (!refreshed.ok) {
        console.error('[spotify] token refresh failed:', refreshed.message)
        return NextResponse.json({ error: refreshed.message }, { status: 502 })
      }
      accessToken = refreshed.accessToken
    }

    let result = await fetchData(accessToken)

    // A token can be revoked before its recorded expiry. Retry once so a stale
    // row in Supabase does not take the whole section down.
    if (!result.ok && result.status === 401 && !tokenHasExpired) {
      const refreshed = await refreshApiToken(existingTokens.refresh_token)
      if (refreshed.ok) {
        result = await fetchData(refreshed.accessToken)
      }
    }

    if (!result.ok) {
      console.error(
        `[spotify] request to "${endpoint}" failed:`,
        result.status,
        result.message
      )
      // Return a real error status. Previously Spotify's `{ error: ... }` body
      // was forwarded with a 200, so the client parsed it as if it were data.
      return NextResponse.json(
        { error: result.message },
        { status: result.status }
      )
    }

    return NextResponse.json(result.data ?? null, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('[spotify] unexpected error:', error)
    return NextResponse.json(
      { error: 'Unable to reach Spotify.' },
      { status: 500 }
    )
  }
}
