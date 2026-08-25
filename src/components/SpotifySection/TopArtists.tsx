import Link from 'next/link'

// Fixed skeleton widths. These were previously Math.random() calls evaluated
// during render, which produced different values on the server and the client
// and triggered a React hydration mismatch on every load.
const SKELETON_WIDTHS = [
  118, 64, 152, 96, 74, 133, 88, 171, 59, 142, 105, 80, 126, 67, 158, 92, 113,
  71, 147, 84, 136, 61, 165, 99, 122, 76, 154, 90,
]

const TopArtistsList = ({ data }: any) => {
  // The crash used to start here: `data.length` on an undefined prop threw
  // "Cannot read properties of undefined (reading 'length')", which took out
  // the whole page. Normalise the prop instead of trusting it.
  const artists: any[] = Array.isArray(data) ? data : []

  return (
    <ul className="grid grid-cols-2 gap-x-4 md:gap-x-8 text-theme-sm">
      {!artists.length &&
        SKELETON_WIDTHS.map((width: number, index: number) => (
          <p
            key={index + 'artistskeleton'}
            className="rounded-md bg-[rgba(255,255,255,0.05)] mb-1"
            style={{ width: `${width}px` }}
          >
            &nbsp;
          </p>
        ))}

      {artists.slice(0, 28).map((artist: any, index: number) => {
        const href = artist?.external_urls?.spotify
        const name = artist?.name
        // Spotify does not guarantee three image sizes, so fall back through
        // them rather than indexing straight into images[1].
        const imageUrl =
          artist?.images?.[1]?.url ?? artist?.images?.[0]?.url ?? ''

        // Skip anything malformed instead of throwing mid-render.
        if (!href || !name) return null

        return (
          <Link key={name + index + 'list'} href={href} target="_blank">
            <li className="flex items-center gap-2 mb-1">
              <div
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                  backgroundColor: imageUrl
                    ? undefined
                    : 'rgba(255,255,255,0.1)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                }}
                className="rounded-full inline-block w-[16px] h-[16px] border border-[rgba(255,255,255,0.3)]"
              />
              <span className="opacity-[0.75]">{name}</span>
            </li>
          </Link>
        )
      })}
    </ul>
  )
}

export default TopArtistsList
