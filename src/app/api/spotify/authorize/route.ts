import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, timingSafeEqual } from 'crypto'
import { SPOTIFY_SCOPES, getRedirectUri } from '../spotifyAuth'

export const dynamic = 'force-dynamic'

/**
 * Normalises a secret before comparison.
 *
 * Hosting dashboards and `.env` files routinely introduce a trailing newline or
 * wrap values in quotes, so a raw `!==` reports a mismatch on two values that
 * look identical to the eye. Trim, strip one layer of matching quotes, trim
 * again.
 */
function normalizeSecret(value: string | null | undefined): string {
  if (!value) return ''
  const trimmed = value.trim()
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed
  return unquoted.trim()
}

/** Length-safe constant-time comparison. */
function secretsMatch(a: string, b: string): boolean {
  if (!a || !b) return false
  const bufA: any = Buffer.from(a, 'utf8')
  const bufB: any = Buffer.from(b, 'utf8')
  // timingSafeEqual throws on differing lengths, so check that first. The
  // length itself is not sensitive.
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/**
 * Starts the Spotify authorization code flow.
 *
 * Owner-only setup endpoint: it mints a fresh refresh token and the callback
 * overwrites the stored one, so it is gated behind SPOTIFY_SETUP_SECRET and
 * fails closed when that is not configured.
 *
 *   GET /api/spotify/authorize?secret=<SPOTIFY_SETUP_SECRET>
 */
export async function GET(request: NextRequest) {
  const configuredSecret = normalizeSecret(process.env.SPOTIFY_SETUP_SECRET)

  if (!configuredSecret) {
    return NextResponse.json(
      {
        error:
          'SPOTIFY_SETUP_SECRET is not configured. Set it before using this endpoint.',
      },
      { status: 503 },
    )
  }

  const provided = normalizeSecret(
    new URL(request.url).searchParams.get('secret'),
  )

  if (!secretsMatch(provided, configuredSecret)) {
    // Logged server-side only, and lengths rather than values: enough to tell
    // "wrong value" from "stray whitespace" without putting a secret in a log.
    console.warn(
      `[spotify] authorize rejected: secret mismatch (provided ${provided.length} chars, configured ${configuredSecret.length} chars)`,
    )
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
      { status: 503 },
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
    process.env.NEXT_PUBLIC_SPOTIFY_SCOPE ?? SPOTIFY_SCOPES,
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
