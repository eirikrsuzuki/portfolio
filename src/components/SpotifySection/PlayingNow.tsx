'use client'

import IconExternalPage from '@/assets/icons/common/IconExternalPage'
import { useResponsive } from '@/hooks/useResponsive'
import { formatMilliseconds } from '@/utils/formatMilliseconds'
import { truncateParagraph } from '@/utils/formatString'
import * as Tooltip from '@radix-ui/react-tooltip'
import Image from 'next/image'
import Link from 'next/link'

const SpotifyPlayingNow = ({ data }: any) => {
  const { isAboveMd } = useResponsive('md')

  // The old version built `listItem` — which reads data.item.album.images[0].url
  // — *before* the `if (data)` guard, so an error payload (truthy, but with no
  // `item`) threw before the guard could help. Resolve every field up front and
  // bail early instead.
  const track = data?.item
  const trackUrl = track?.external_urls?.spotify
  const albumImage = track?.album?.images?.[0]?.url
  const trackName = track?.name

  if (!track || !trackUrl || !trackName) return null

  const attributions = Array.isArray(track.artists)
    ? track.artists.map((artist: any) => artist?.name).filter(Boolean).join(', ')
    : 'Unknown Artist'

  const listItem = (
    <li className="flex items-center justify-between w-full mb-3 pb-3 border-b border-[rgba(255,255,255,0.1)]">
      <div className="flex items-center gap-x-4">
        <div className="min-w-[36px] min-h-[36px] overflow-hidden rounded-sm border border-[rgba(255,255,255,0.2)]">
          {albumImage ? (
            <Image
              alt={track.album?.name ?? trackName}
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
            {truncateParagraph(trackName, isAboveMd ? 39 : 20, false)}
          </p>
          <p className="text-theme-xs opacity-[0.8]">
            {attributions || 'Unknown Artist'}
          </p>
        </div>
      </div>
      <div className="text-right min-w-[100px]">
        {data.is_playing ? (
          <div className="ml-auto h-[17px] w-[42px] relative opacity-[0.7] mb-[2px]">
            {Array.from(Array(10).keys()).map((index: number) => (
              <i key={index + 'audiobar'} className="spotify-audio-bar" />
            ))}
          </div>
        ) : (
          <p className="text-theme-xs opacity-[0.7] mb-[2px]">
            {formatMilliseconds(data.progress_ms ?? 0)} /{' '}
            {formatMilliseconds(track.duration_ms ?? 0)}
          </p>
        )}
        <p className="text-theme-xs opacity-[0.5]">
          {data.is_playing ? 'playing now' : 'paused'}
        </p>
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

export default SpotifyPlayingNow
