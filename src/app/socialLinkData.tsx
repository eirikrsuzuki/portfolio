import IconCalendly from '@/assets/icons/common/IconCalendly'
import IconCv from '@/assets/icons/common/IconCv'
import IconGithub from '@/assets/icons/common/IconGithub'
import IconInstagram from '@/assets/icons/common/IconInstagram'
import IconLinkedin from '@/assets/icons/common/IconLinkedin'
import IconTumblr from '@/assets/icons/common/IconTumblr'
import { ReactNode } from 'react'

export interface SocialLink {
  name: string
  href: string
  icon: ReactNode
}

export const socialLinkData: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/erikksuzuki/portfolio/pull/1',
    icon: <IconGithub className="w-6 h-6 hover:text-[#DDDDDD]" />,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/erikksuzuki',
    icon: <IconInstagram className="w-6 h-6 hover:text-[#FAA6A0]" />,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/eric-suzuki-04380449/',
    icon: <IconLinkedin className="w-6 h-6 hover:text-[#4DA6F0]" />,
  },
  {
    name: 'Tumblr',
    href: 'https://emptyblueprints-blog.tumblr.com',
    icon: <IconTumblr className="w-6 h-6 hover:text-[#4DCAE0]" />,
  },
  {
    name: 'Resume',
    href: 'https://alkemyst.online/eric_suzuki_cv_2026.pdf',
    icon: <IconCv className="w-6 h-6 hover:text-[#DDDDDD]" />,
  },
  {
    name: 'Calendly',
    href: 'https://calendly.com/erikksuzuki/generic-meeting',
    icon: <IconCalendly className="w-6 h-6 hover:text-[#DDDDDD]" />,
  },
]
