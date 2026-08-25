import IconSpotify from '@/assets/icons/common/SpotifyLogo'
import SpotifyPlayingNow from './PlayingNow'
import SpotifyTrackListing from './TrackListing'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import SpotifyLoadingSpinner from './LoadingSpinner'
import clsx from 'clsx'

// Register the locale once at module load. It was previously done in the render
// body, so it re-ran on every render for no benefit.
TimeAgo.addLocale(en)
TimeAgo.setDefaultLocale(en.locale)

const SpotifyRecentTracks = ({ playingNow, recentTracks }: any) => {
  // `recentTracks.length` on an undefined prop was the second crash site.
  // Normalise, then drop any entry that is not a real track so the listing
  // component never has to defend itself against a half-shaped payload.
  const tracks: any[] = (Array.isArray(recentTracks) ? recentTracks : []).filter(
    (entry: any) => entry?.track?.name
  )
  const nowPlaying = playingNow?.item ? playingNow : null
  const isEmpty = tracks.length === 0 && !nowPlaying

  return (
    <article className="rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-7 bg-acryllic-black">
      <header className="flex items-center justify-between">
        <div>
          <label className="uppercase text-[#0f0] text-[10px] tracking-widest font-semibold">
            What I&apos;m Listening To
          </label>
          <h1 className="text-theme-heading-xs font-poppins mb-7">
            Recent Tracks
          </h1>
        </div>
        <IconSpotify className="w-[24px] h-[24px] text-[rgba(0,255,0,0.4)]" />
      </header>

      <ul
        className={clsx('w-full h-[376px] flex flex-col items-center', {
          'justify-center': isEmpty,
        })}
      >
        {nowPlaying && <SpotifyPlayingNow data={nowPlaying} />}

        {tracks
          .slice(0, nowPlaying ? 6 : 7)
          .map((track: any, index: number) => (
            <SpotifyTrackListing
              key={track.track.name + index}
              track={track}
              lastItem={nowPlaying ? index === 5 : index === 6}
            />
          ))}

        {isEmpty && (
          <div className="text-white flex flex-col justify-center items-center opacity-[0.4]">
            <SpotifyLoadingSpinner />
            <span className="text-theme-xs mt-4 mb-12">Loading...</span>
          </div>
        )}
      </ul>
    </article>
  )
}

export default SpotifyRecentTracks
