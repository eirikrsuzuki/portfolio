import { useMessages, useTranslations } from 'next-intl'

import WorkDescription from '@/components/common/WorkDescription'
import SocialLinks from '@/components/common/SocialLinks'
import { socialLinkData } from '../socialLinkData'
import LanguagePicker from '@/components/common/LanguageSwitcher'

import LinkImage from '@/assets/desk_illustration.jpg'

import SpotifySection from '@/app/[locale]/Spotify'
import BlockscopeSection from './Blockscope'
import FreeportSection from './Freeport'
import GeminiSection from './Gemini'
import FreelanceSection from './Freelance'
import SteamSection from './Steam'
import ReadingSection from './Reading'
import AkamiSection from './Akami'

export default function Home() {
  const t = useTranslations('header')
  const messages = useMessages() as any
  const paragraphsArray = Object.values(
    messages.header.introduction.paragraphs ?? {},
  )
  const technologiesArray: string[] = [
    'React',
    'Next.js 14',
    'Expo React Native',
    'Tailwind CSS',
    'Supabase',
    'Vercel',
    'Contentful',
    'Gsap',
    'Framer Motion',
    'Mantine UI',
    'Radix UI',
    'Zustand',
  ]

  return (
    <div>
      <main className="bg-black">
        <section className="text-left gap-y-6 grid grid-cols-1 md:grid-cols-2 py-24 px-4 md:px-8 w-full mx-auto max-w-[1024px] relative">
          <div className="absolute top-4 md:top-24 right-4">
            <LanguagePicker />
          </div>
          <div className="md:order-1 order-2">
            <WorkDescription
              label={t('introduction.heading')}
              title={t('introduction.name')}
              headerTitle
              paragraphs={paragraphsArray}
              technologies={technologiesArray}
              technologiesLabel={t('introduction.technologyline')}
            />
            <SocialLinks
              data={socialLinkData}
              className="mt-4"
              label="Find me on:"
            />
          </div>
          <div className="md:order-2 order-1 flex flex-col justify-center items-center">
            <img
              src="/fornace-4799f6b4-c827-4874-a99d-c1a0b0aca168-1778833893829.jpg"
              alt={'LinkGifImage'}
              className="w-full h-auto"
            />
          </div>
        </section>
        {/* 
        <section className="text-left mb-8">
          <h1 className="text-theme-heading-xs font-poppins mb-3">
            Recent Blog Articles
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md border border-white">some content</div>
            <div className="p-4 rounded-md border border-white">some content</div>
            <div className="p-4 rounded-md border border-white">some content</div>
          </div>
        </section> 
      */}
      </main>
      <SpotifySection />
      <div className="py-24 px-4 md:px-8 w-full mx-auto max-w-[1024px]">
        <AkamiSection />
        <BlockscopeSection columnsReversed />
        <FreeportSection />
        <GeminiSection columnsReversed />
        <FreelanceSection />
      </div>
      <ReadingSection />
      <SteamSection />
    </div>
  )
}
