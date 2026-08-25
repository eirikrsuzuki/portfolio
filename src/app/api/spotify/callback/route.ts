import { NextRequest, NextResponse } from 'next/server'
import {
  buildAuthorizationHeader,
  getRedirectUri,
  persistTokens,
} from '../spotifyAuth'

export const dynamic = 'force-dynamic'

/**
 * Completes the Spotify authorization code flow and stores the resulting
 * tokens. This is the piece the repo never had: AuthorizeButton sent users to
 * Spotify with `response_type=code`, but nothing ever exchanged that code, so
 * the `spotify` row had to be seeded by hand.
 *
 * Spotify redirects here with `?code=...&state=...`.
 */
export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams
  const code = params.get('code')
  const returnedState = params.get('state')
  const denied = params.get('error')

  if (denied) {
    return NextResponse.json(
      { error: `Spotify authorization was denied: ${denied}` },
      { status: 400 }
    )
  }

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code.' },
      { status: 400 }
    )
  }

  // CSRF check: the state must match the cookie set by /api/spotify/authorize.
  const expectedState = request.cookies.get('spotify_oauth_state')?.value
  if (!expectedState || !returnedState || returnedState !== expectedState) {
    return NextResponse.json(
      {
        error:
          'Invalid or expired OAuth state. Start again from /api/spotify/authorize.',
      },
      { status: 400 }
    )
  }

  const authorization = buildAuthorizationHeader()
  const redirectUri = getRedirectUri()

  if (!authorization || !redirectUri) {
    return NextResponse.json(
      { error: 'Spotify client credentials or redirect URI are not configured.' },
      { status: 503 }
    )
  }

  let payload: any = null

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        // Must match the /authorize call byte for byte.
        redirect_uri: redirectUri,
      }),
      cache: 'no-store',
    })

    payload = await tokenResponse.json().catch(() => null)

    if (!tokenResponse.ok || !payload?.access_token || !payload?.refresh_token) {
      return NextResponse.json(
        {
          error:
            payload?.error_description ??
            payload?.error ??
            `Token exchange failed with status ${tokenResponse.status}.`,
        },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('[spotify] token exchange threw:', error)
    return NextResponse.json(
      { error: 'Could not reach Spotify to exchange the authorization code.' },
      { status: 502 }
    )
  }

  // Confirm who authorized before overwriting the stored tokens — otherwise
  // anyone reaching this endpoint could point the site at their own account.
  let profile: any = null
  try {
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${payload.access_token}` },
      cache: 'no-store',
    })
    profile = await profileResponse.json().catch(() => null)
  } catch (error) {
    console.error('[spotify] profile lookup threw:', error)
  }

  const ownerId = process.env.SPOTIFY_OWNER_ID?.trim()

  if (ownerId && profile?.id !== ownerId) {
    return NextResponse.json(
      { error: 'This Spotify account is not the owner of this site.' },
      { status: 403 }
    )
  }

  if (!ownerId) {
    console.warn(
      `[spotify] SPOTIFY_OWNER_ID is not set. Authorized as "${profile?.id}" — set SPOTIFY_OWNER_ID to that value to lock this endpoint down.`
    )
  }

  const persisted = await persistTokens(payload)

  if (!persisted.ok) {
    console.error('[spotify] failed to store tokens:', persisted.message)
    return NextResponse.json(
      { error: `Tokens obtained but could not be stored: ${persisted.message}` },
      { status: 500 }
    )
  }

  const response = NextResponse.json({
    connected: true,
    account: profile?.display_name ?? profile?.id ?? 'unknown',
    spotify_user_id: profile?.id ?? null,
    scope: payload.scope ?? null,
    expires_in_seconds: Number(payload.expires_in) || 3600,
  })

  // One-time value — clear it so a replay cannot reuse it.
  response.cookies.delete('spotify_oauth_state')

  return response
}
