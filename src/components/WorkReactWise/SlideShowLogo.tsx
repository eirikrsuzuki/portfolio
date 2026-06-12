import Image from 'next/image'
import ReactWiseLogo from '@/assets/reactwise/reactwise-logo-white.svg'

const SlideShowReactWiseLogo = () => {
  return (
    <div className="text-white overflow-hidden w-full h-[500px] flex justify-center items-center gap-x-2">
      <div className="reactwise-logo">
        <Image width={237} height={48} src={ReactWiseLogo.src} alt="ReactWise" />
      </div>
    </div>
  )
}

export default SlideShowReactWiseLogo
