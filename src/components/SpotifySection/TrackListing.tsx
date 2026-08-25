'use client'

import { formatAMPM } from '@/utils/formatDateTime'
import Image from 'next/image'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import clsx from 'clsx'
import Link from 'next/link'
import { truncateParagraph } from '@/utils/formatString'
import { useResponsive } from '@/hooks/useResponsive'
import * as Tooltip from '@radix-ui/react-tooltip'
import IconExternalPage from '@/assets/icons/common/IconExternalPage'

// Registered at module load rather than in a useEffect. `new TimeAgo('en-US')`
// runs during render, i.e. before effects fire — the old ordering only worked
// by accident because the parent happened to register the locale first.
TimeAgo.addLocale(en)
TimeAgo.setDefaultLocale(en.locale)

const timeAgo = new TimeAgo('en-US')

const SpotifyTrackListing = ({ track, lastItem }: any) => {
  const { isAboveMd } = useResponsive('md')

  const item = track?.track
  const trackUrl = item?.external_urls?.spotify
  const trackName = item?.name
  const albumImage = item?.album?.images?.[0]?.url

  // Render nothing rather than throwing on a malformed entry.
  if (!item || !trackUrl || !trackName) return null

  const attributions = Array.isArray(item.artists)
    ? item.artists.map((artist: any) => artist?.name).filter(Boolean).join(', ')
    : ''

  const playedAtMs = track?.played_at ? new Date(track.played_at).getTime() : NaN
  const hasPlayedAt = !Number.isNaN(playedAtMs)

  const listItem = (
    <li
      className={clsx('flex items-center justify-between w-full', {
        'border-b border-[rgba(255,255,255,0.1)] mb-2 pb-2': !lastItem,
      })}
    >
      <div className="flex items-center gap-x-4">
        <div className="min-w-[36px] min-h-[36px] overflow-hidden rounded-sm border border-[rgba(255,255,255,0.2)]">
          {albumImage ? (
            <Image
              alt={item.album?.name ?? trackName}
              src={albumImage}
              height={36}
              width={36}
            />
          ) : (
            <div className="w-[36px] h-[36px] bg-[rgba(255,255,255,0.08)]" />
          )}
        </div>
        <div>
          <p className="text-theme-sm">
            {truncateParagraph(trackName, isAboveMd ? 39 : 26, false)}
          </p>
          <p className="text-theme-xs opacity-[0.8]">
            {attributions || 'Unknown Artist'}
          </p>
        </div>
      </div>
      <div className="text-right min-w-[100px]">
        {hasPlayedAt && (
          <>
            <p className="text-theme-xs opacity-[0.7] mb-[2px]">
              {formatAMPM(track.played_at)}
            </p>
            <p className="text-theme-xs opacity-[0.5]">
              {timeAgo.format(playedAtMs)}
            </p>
          </>
        )}
      </div>
    </li>
  )

  return (
    <Link href={trackUrl} target="_blank" className="w-full">
      {isAboveMd ? (
        <Tooltip.Provider delayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>{listItem}</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="TooltipContent"
                sideOffset={5}
                side="right"
              >
                <div className="flex flex-row justify-center items-center gap-x-2">
                  <h2 className="text-theme-sm">View in Spotify</h2>
                  <IconExternalPage className="w-4 h-4" />
                </div>
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ) : (
        listItem
      )}
    </Link>
  )
}

export default SpotifyTrackListing
