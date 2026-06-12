import { gsap } from 'gsap'

export function runVailoAnimations(
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
    .to('.vailo-logo', {
      opacity: '0',
      translateY: '-30px',
      ease: 'none',
      duration: 1,
    })
    .fromTo(
      '.vailo-models-heading',
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
      '.vailo-model-chip',
      {
        translateY: '30px',
        opacity: 0,
      },
      {
        translateY: '0px',
        opacity: 1,
        ease: 'back',
        stagger: 0.08,
        duration: 0.5,
      }
    )
    .to('.vailo-models', {
      translateY: '-30px',
      opacity: 0,
      ease: 'back',
      duration: 0.5,
    })
    .fromTo(
      '.vailo-prompt-heading',
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
      '.vailo-action-chip',
      {
        translateY: '30px',
        opacity: 0,
      },
      {
        translateY: '0px',
        opacity: 1,
        ease: 'back',
        stagger: 0.1,
        duration: 0.5,
      }
    )
    .fromTo(
      '.vailo-prompt-bar',
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
