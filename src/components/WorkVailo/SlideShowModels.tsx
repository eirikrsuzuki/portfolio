import Image from 'next/image'

import IconKling from '@/assets/vailo/model-icons/kling-color.svg'
import IconSora from '@/assets/vailo/model-icons/sora-color.svg'
import IconHailuo from '@/assets/vailo/model-icons/hailuo-color.svg'
import IconLuma from '@/assets/vailo/model-icons/luma-color.svg'
import IconVidu from '@/assets/vailo/model-icons/vidu-color.svg'
import IconPika from '@/assets/vailo/model-icons/pika.svg'
import IconRunway from '@/assets/vailo/model-icons/runway.svg'
import IconFlux from '@/assets/vailo/model-icons/flux.svg'
import IconMidjourney from '@/assets/vailo/model-icons/midjourney.svg'
import IconRecraft from '@/assets/vailo/model-icons/recraft.svg'
import IconIdeogram from '@/assets/vailo/model-icons/ideogram.svg'
import IconTopazLabs from '@/assets/vailo/model-icons/topazlabs.svg'

const models = [
  { name: 'Kling', iconSrc: IconKling.src },
  { name: 'Sora', iconSrc: IconSora.src },
  { name: 'Hailuo', iconSrc: IconHailuo.src },
  { name: 'Luma', iconSrc: IconLuma.src },
  { name: 'Vidu', iconSrc: IconVidu.src },
  { name: 'Pika', iconSrc: IconPika.src },
  { name: 'Runway', iconSrc: IconRunway.src },
  { name: 'Flux', iconSrc: IconFlux.src },
  { name: 'Midjourney', iconSrc: IconMidjourney.src },
  { name: 'Recraft', iconSrc: IconRecraft.src },
  { name: 'Ideogram', iconSrc: IconIdeogram.src },
  { name: 'Topaz Labs', iconSrc: IconTopazLabs.src },
]

const SlideShowModels = () => {
  return (
    <div className="overflow-hidden w-full h-[500px] flex justify-center items-center absolute top-0 left-0">
      <div className="vailo-models flex flex-col items-center text-white">
        <h2 className="vailo-models-heading font-bold text-theme-lg mb-8 text-center">
          Top-Tier Models <span className="opacity-60">+</span> Early Releases
        </h2>
        <div className="grid grid-cols-4 gap-x-8 gap-y-5">
          {models.map((model) => (
            <div
              key={model.name}
              className="vailo-model-chip flex flex-col items-center gap-y-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex justify-center items-center shadow-lg">
                <Image
                  src={model.iconSrc}
                  width={32}
                  height={32}
                  alt={model.name}
                />
              </div>
              <span className="text-theme-xs opacity-80">{model.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideShowModels
