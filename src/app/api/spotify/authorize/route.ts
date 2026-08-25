import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { SPOTIFY_SCOPES, getRedirectUri } from '../spotifyAuth'

export const dynamic = 'force-dynamic'

/**
 * Starts the Spotify authorization code flow.
 *
 * This is an owner-only setup endpoint: it mints a fresh refresh token and the
 * callback overwrites the stored one, so it is gated behind
 * SPOTIFY_SETUP_SECRET and fails closed when that is not configured.
 *
 *   GET /api/spotify/authorize?secret=<SPOTIFY_SETUP_SECRET>
 */
export async function GET(request: NextRequest) {
  const setupSecret = process.env.SPOTIFY_SETUP_SECRET

  if (!setupSecret) {
    return NextResponse.json(
      {
        error:
          'SPOTIFY_SETUP_SECRET is not configured. Set it before using this endpoint.',
      },
      { status: 503 }
    )
  }

  const provided = new URL(request.url).searchParams.get('secret')
  if (provided !== setupSecret) {
    // Answer 404 rather than 403 so the endpoint does not advertise itself.
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  const clientId =
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? process.env.SPOTIFY_CLIENT_ID
  const redirectUri = getRedirectUri()

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        error:
          'Missing Spotify client id or redirect URI. Set NEXT_PUBLIC_SPOTIFY_CLIENT_ID and SPOTIFY_REDIRECT_URI (or NEXT_PUBLIC_SITE_URL).',
      },
      { status: 503 }
    )
  }

  // CSRF token, verified against an httpOnly cookie in the callback.
  const state = randomBytes(16).toString('hex')

  const authorizeUrl = new URL('https://accounts.spotify.com/authorize')
  authorizeUrl.searchParams.set('client_id', clientId)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('redirect_uri', redirectUri)
  authorizeUrl.searchParams.set(
    'scope',
    process.env.NEXT_PUBLIC_SPOTIFY_SCOPE ?? SPOTIFY_SCOPES
  )
  authorizeUrl.searchParams.set('state', state)
  // Force the consent screen. After a revoked grant, reusing a cached approval
  // can hand back the same dead authorization.
  authorizeUrl.searchParams.set('show_dialog', 'true')

  const response = NextResponse.redirect(authorizeUrl.toString())

  response.cookies.set('spotify_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // 'lax' so the cookie survives the top-level redirect back from Spotify.
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })

  return response
}
