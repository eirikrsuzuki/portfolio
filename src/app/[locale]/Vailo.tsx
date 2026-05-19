'use client'

import WorkSection from '@/components/common/WorkSection'

import CrunchbaseIcon from '@/assets/link-icons/crunchbase.png'
import YoutubeIcon from '@/assets/link-icons/youtube.png'

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
          iconSrc: undefined,
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
        'React',
        'Vite',
        'Next.js',
        'TypeScript',
        'Supabase',
        'Stripe',
        'Contentful',
        'TanStack Router',
        'Zustand',
        'Storybook',
      ]}
      illustrationBgSrc={''}
      illustrationSlides={[]}
    />
  )
}

export default VailoSection
