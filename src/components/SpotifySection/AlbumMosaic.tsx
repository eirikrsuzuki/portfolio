import AlbumCoverTile from './AlbumCoverTile'

const ROWS = [
  [0, 12],
  [12, 24],
  [24, 36],
  [36, 48],
] as const

const SpotifyAlbumMosaic = ({ topArtists }: any) => {
  // `topArtists.slice(...)` threw if the prop was ever undefined. The parent
  // guards this now, but the component should not depend on that.
  const artists: any[] = Array.isArray(topArtists) ? topArtists : []

  if (!artists.length) return null

  return (
    <div className="w-[4320px] opacity-[0.25] absolute">
      {ROWS.map(([start, end]) => {
        const row = artists.slice(start, end)
        // Each row is duplicated to fill the marquee width.
        return (
          <div className="h-[180px]" key={`mosaic-row-${start}`}>
            {[...row, ...row].map((artist: any, index: number) => (
              <AlbumCoverTile
                key={`${artist?.name ?? 'artist'}-${start}-${index}`}
                artist={artist}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default SpotifyAlbumMosaic
