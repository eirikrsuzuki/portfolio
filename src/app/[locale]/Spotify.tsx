'use client'

import { useEffect, useState } from 'react'
import TopArtistsList from '../../components/SpotifySection/TopArtists'
import {
  getSpotifyPlayingNow,
  getSpotifyRecentlyPlayed,
  getSpotifyTopArtists,
} from '@/app/authService'
import SpotifyRecentTracks from '../../components/SpotifySection/RecentTracks'
import SpotifyAlbumMosaic from '../../components/SpotifySection/AlbumMosaic'
import SpotifyErrorBoundary from '../../components/SpotifySection/SpotifyErrorBoundary'
import SpotifyLoadingBackground from '@/assets/backgrounds/spotify.jpg'

const REFRESH_INTERVAL_MS = 300_000 // 5 minutes

const SpotifySection = () => {
  const [topArtists, setTopArtists] = useState<any[]>([])
  const [recentTracks, setRecentTracks] = useState<any[]>([])
  const [playingNow, setPlayingNow] = useState<any>(null)

  useEffect(() => {
    let cancelled = false

    async function getAndSetSpotifyData() {
      const [artists, tracks, nowPlaying] = await Promise.all([
        getSpotifyTopArtists(48, 'medium_term'),
        getSpotifyRecentlyPlayed(10),
        getSpotifyPlayingNow(),
      ])

      if (cancelled) return

      // authService already guarantees arrays, but re-checking here means a
      // malformed payload can never put `undefined` into state. That is what
      // used to crash the render: `setTopArtists(data.items)` with no `items`.
      setTopArtists(Array.isArray(artists) ? artists : [])
      setRecentTracks(Array.isArray(tracks) ? tracks : [])
      setPlayingNow(nowPlaying ?? null)
    }

    getAndSetSpotifyData()
    const interval = setInterval(getAndSetSpotifyData, REFRESH_INTERVAL_MS)

    // The previous version was `return clearInterval(interval)`, which invoked
    // clearInterval on mount and returned undefined — so the 5 minute refresh
    // never ran, and nothing was cleaned up on unmount.
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <section
      style={{
        backgroundImage: `url(${SpotifyLoadingBackground.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
      className="w-full h-[720px] bg-[#000] border-white overflow-hidden relative"
    >
      <SpotifyErrorBoundary>
        {topArtists.length > 0 && (
          <SpotifyAlbumMosaic topArtists={topArtists} />
        )}
        <section className="text-left gap-y-6 grid grid-cols-1 md:grid-cols-2 py-24 px-0 md:px-4 w-full mx-auto max-w-[1024px] relative">
          <SpotifyRecentTracks
            playingNow={playingNow}
            recentTracks={recentTracks}
          />
          <aside className="w-full hidden md:flex items-center justify-center bg-acryllic-black rounded-lg border border-[rgba(255,255,255,0.1)]">
            <div className="md:px-8 px-4 py-8 w-full max-w-[460px]">
              <h2 className="text-theme-sm mb-4">Most Played Artists:</h2>
              <TopArtistsList data={topArtists} />
            </div>
          </aside>
        </section>
      </SpotifyErrorBoundary>
    </section>
  )
}

export default SpotifySection
