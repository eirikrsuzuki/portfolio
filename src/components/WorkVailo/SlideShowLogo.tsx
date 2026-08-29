import Image from 'next/image'
import VailoLogo from '@/assets/vailo/vailo-logo.svg'

const SlideShowVailoLogo = () => {
  return (
    <div className="text-white overflow-hidden w-full h-[500px] flex justify-center items-center gap-x-2">
      <div className="vailo-logo flex items-center gap-x-3">
        <Image width={40} height={41} src={VailoLogo.src} alt="Vailo AI" />
        <span className="font-bold text-[34px] tracking-tight">Vailo</span>
      </div>
    </div>
  )
}

export default SlideShowVailoLogo
