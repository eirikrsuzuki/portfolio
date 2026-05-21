'use client'

import WorkSection from '@/components/common/WorkSection'

import CrunchbaseIcon from '@/assets/link-icons/crunchbase.png'
import YCombinatorIcon from '@/assets/link-icons/ycombinator.ico'

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
          iconSrc: undefined,
        },
      ]}
      technologiesArray={[
        'React + Vite',
        'Tanstack Router',
        'Tanstack Query',
        'Python',
        'REST APIs',
        'React Router',
      ]}
      illustrationBgSrc={''}
      illustrationSlides={[]}
    />
  )
}

export default ReactWiseSection
