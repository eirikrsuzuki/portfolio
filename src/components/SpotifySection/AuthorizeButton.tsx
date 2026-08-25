/**
 * Kicks off the Spotify authorization flow.
 *
 * The previous version linked straight to accounts.spotify.com with
 * `redirect_uri=NEXT_PUBLIC_SITE_URL`, so Spotify bounced back to the homepage
 * with a `?code=` nothing ever read. It now points at /api/spotify/authorize,
 * which sets the CSRF state cookie and hands off to Spotify properly.
 *
 * Note: /api/spotify/authorize requires `?secret=<SPOTIFY_SETUP_SECRET>`, which
 * must not be exposed to the browser — so in production, open that URL directly
 * rather than rendering this button. It is kept for local development, where
 * NEXT_PUBLIC_SPOTIFY_SETUP_SECRET can be set safely.
 *
 * This component is currently imported nowhere; it is safe to delete if you'd
 * rather just hit the endpoint by hand.
 */
const SpotifyAuthorizeButton = () => {
  const devSecret = process.env.NEXT_PUBLIC_SPOTIFY_SETUP_SECRET

  const href = devSecret
    ? `/api/spotify/authorize?secret=${encodeURIComponent(devSecret)}`
    : '/api/spotify/authorize'

  return (
    <a href={href}>
      <button>Login and authorize user data</button>
    </a>
  )
}

export default SpotifyAuthorizeButton
