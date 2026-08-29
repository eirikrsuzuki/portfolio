import { gsap } from 'gsap'

export function runReactWiseAnimations(
  triggerRef: HTMLDivElement | undefined | null
) {
  return gsap
    .timeline({
      scrollTrigger: {
        trigger: triggerRef,
        start: 'center center',
        end: '1200 top',
        scrub: 0.6,
        pin: true,
      },
    })
    .to('.reactwise-logo', {
      opacity: '0',
      translateY: '-30px',
      ease: 'none',
      duration: 1,
    })
    .fromTo(
      '.reactwise-table-card',
      {
        translateY: '30px',
        opacity: 0,
      },
      {
        translateY: '0px',
        opacity: 1,
        ease: 'back',
        duration: 0.5,
      }
    )
    .fromTo(
      '.reactwise-exp-row',
      {
        translateY: '30px',
        opacity: 0,
      },
      {
        translateY: '0px',
        opacity: 1,
        ease: 'back',
        stagger: 0.15,
        duration: 0.5,
      }
    )
    .to('.reactwise-table-card', {
      translateY: '-30px',
      opacity: 0,
      ease: 'back',
      duration: 0.5,
    })
    .fromTo(
      '.reactwise-best-heading',
      {
        translateY: '30px',
        opacity: 0,
      },
      {
        translateY: '0px',
        opacity: 1,
        ease: 'back',
        duration: 0.5,
      }
    )
    .fromTo(
      '.reactwise-best-card',
      {
        translateY: '30px',
        opacity: 0,
      },
      {
        translateY: '0px',
        opacity: 1,
        ease: 'back',
        duration: 0.5,
      }
    )
    .fromTo(
      '.reactwise-yield-bar',
      { width: '0%' },
      {
        width: '92%',
        ease: 'none',
        duration: 1,
      }
    )
    .fromTo(
      '.reactwise-impurity-bar',
      { width: '0%' },
      {
        width: '6%',
        ease: 'none',
        duration: 0.5,
      },
      '<'
    )
    .fromTo(
      '.reactwise-create-btn',
      {
        translateY: '30px',
        opacity: 0,
      },
      {
        translateY: '0px',
        opacity: 1,
        ease: 'back',
        duration: 0.5,
      }
    )
}
