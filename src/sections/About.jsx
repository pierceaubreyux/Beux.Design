import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Label line draws itself */
      gsap.from('[data-about-line]', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })

      /* Label text fades in */
      gsap.from('[data-about-label]', {
        x: -20,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })

      /* Heading — dramatic entrance with scale */
      gsap.from('[data-about-heading]', {
        y: 90,
        opacity: 0,
        scale: 0.96,
        filter: 'blur(12px)',
        duration: 1.3,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
        },
      })

      /* Lead paragraph — left column */
      gsap.from('[data-about-lead]', {
        y: 70,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-about-lead]',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      /* Right column paragraphs — stagger with horizontal offset */
      gsap.from('[data-about-p]', {
        y: 50,
        x: 40,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 1,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-about-grid]',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })

      /* Accent line — extends across below heading */
      gsap.from('[data-about-accent]', {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.6,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '[data-about-accent]',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      /* Parallax on the decorative elements */
      gsap.to('[data-about-deco]', {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className={styles.about}>
      {/* Decorative element */}
      <div className={styles.deco} data-about-deco aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.2" />
        </svg>
      </div>

      <div className={styles.container}>
        <div className={styles.label}>
          <span className={styles.labelLine} data-about-line />
          <span data-about-label>Our Philosophy</span>
        </div>

        <h2 className={styles.heading} data-about-heading>
          Design with Empathy
        </h2>

        <div className={styles.accent} data-about-accent />

        <div className={styles.grid} data-about-grid>
          <div className={styles.col}>
            <p className={styles.lead} data-about-lead>
              At Beux Design, we believe the best digital experiences are born
              from understanding — not just of pixels and interfaces, but of
              the people who use them. We start every project by listening,
              observing, and immersing ourselves in the lives of your users.
            </p>
          </div>
          <div className={styles.col}>
            <p data-about-p>
              Our approach is rooted in human-centered design principles. We
              don't design for screens; we design for moments — the split second
              a user finds exactly what they need, the subtle satisfaction of a
              seamless interaction, the trust that builds through thoughtful
              attention to detail.
            </p>
            <p data-about-p>
              Through careful research, thoughtful iteration, and close
              collaboration, we craft digital experiences that don't just meet
              business goals — they resonate deeply with the people who use them.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
