const AlbumCoverTile = ({ artist }: any) => {
  // `artist?.images[0]?.url` only guarded `artist` — if `images` was missing it
  // still threw on `undefined[0]`. The optional chain has to continue through
  // the index access.
  const imageUrl = artist?.images?.[0]?.url ?? ''

  return (
    <div
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundColor: imageUrl ? undefined : 'rgba(255,255,255,0.06)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
      className="inline-block w-[180px] h-[180px]"
    />
  )
}

export default AlbumCoverTile
