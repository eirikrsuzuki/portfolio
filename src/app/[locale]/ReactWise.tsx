'use client'

import WorkSection from '@/components/common/WorkSection'

import CrunchbaseIcon from '@/assets/link-icons/crunchbase.png'
import YCombinatorIcon from '@/assets/link-icons/ycombinator.ico'
import ReactWiseIcon from '@/assets/link-icons/reactwise.png'
import ReactWiseBackground from '@/assets/backgrounds/reactwise.svg'
import { runReactWiseAnimations } from '@/components/WorkReactWise/animations'
import SlideShowReactWiseLogo from '@/components/WorkReactWise/SlideShowLogo'
import SlideShowExperiments from '@/components/WorkReactWise/SlideShowExperiments'
import SlideShowOptimize from '@/components/WorkReactWise/SlideShowOptimize'

const ReactWiseSection = ({
  columnsReversed = false,
}: {
  columnsReversed?: boolean
}) => {
  return (
    <WorkSection
      translationKey={'reactwise'}
      columnsReversed={columnsReversed}
      linkArray={[
        {
          label: 'Y Combinator',
          href: 'https://www.ycombinator.com/companies/reactwise',
          iconSrc: YCombinatorIcon.src,
        },
        {
          label: 'Crunchbase',
          href: 'https://www.crunchbase.com/organization/reactwise',
          iconSrc: CrunchbaseIcon.src,
        },
        {
          label: 'Website',
          href: 'https://www.reactwise.com',
          iconSrc: ReactWiseIcon.src,
        },
      ]}
      technologiesArray={[
        'React + Vite',
        'Tanstack Router',
        'Tanstack Query',
        'REST APIs',
        'React Router',
      ]}
      illustrationBgSrc={ReactWiseBackground.src}
      animationFunction={runReactWiseAnimations}
      illustrationSlides={[
        <SlideShowReactWiseLogo key={'reactwise1'} />,
        <SlideShowExperiments key={'reactwise2'} />,
        <SlideShowOptimize key={'reactwise3'} />,
      ]}
    />
  )
}

export default ReactWiseSection
