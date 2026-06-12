'use client'

import WorkSection from '@/components/common/WorkSection'

import CrunchbaseIcon from '@/assets/link-icons/crunchbase.png'
import YoutubeIcon from '@/assets/link-icons/youtube.png'
import VailoLogo from '@/assets/vailo/vailo-logo.svg'
import VailoBackground from '@/assets/backgrounds/vailo.svg'
import { runVailoAnimations } from '@/components/WorkVailo/animations'
import SlideShowVailoLogo from '@/components/WorkVailo/SlideShowLogo'
import SlideShowModels from '@/components/WorkVailo/SlideShowModels'
import SlideShowPrompt from '@/components/WorkVailo/SlideShowPrompt'

const VailoSection = ({
  columnsReversed = false,
}: {
  columnsReversed?: boolean
}) => {
  return (
    <WorkSection
      translationKey={'vailo'}
      columnsReversed={columnsReversed}
      linkArray={[
        {
          label: 'Website',
          href: 'https://vailo.ai',
          iconSrc: VailoLogo.src,
        },
        {
          label: 'Crunchbase',
          href: 'https://www.crunchbase.com/organization/vailo-ai',
          iconSrc: CrunchbaseIcon.src,
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/@Vailo-ai',
          iconSrc: YoutubeIcon.src,
        },
      ]}
      technologiesArray={[
        'React + Vite',
        'Next.js',
        'TypeScript',
        'Stripe',
        'Contentful',
        'Storybook',
        'Motion (Animations)',
        'Embla Carousel',
        'Radix Primitives',
      ]}
      illustrationBgSrc={VailoBackground.src}
      animationFunction={runVailoAnimations}
      illustrationSlides={[
        <SlideShowVailoLogo key={'vailo1'} />,
        <SlideShowModels key={'vailo2'} />,
        <SlideShowPrompt key={'vailo3'} />,
      ]}
    />
  )
}

export default VailoSection
