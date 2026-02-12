import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Capabilities.module.css'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <circle cx="17.5" cy="17.5" r="3.5" />
      </svg>
    ),
    title: 'UX Design',
    description:
      'Intuitive experiences that feel natural. We map user journeys, design interactions, and create interfaces that guide without effort.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Product Design',
    description:
      'End-to-end product thinking. From concept to launch, we shape digital products that users love and businesses rely on.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    title: 'User Research',
    description:
      'Deep understanding drives great design. We conduct interviews, usability tests, and data analysis to uncover what truly matters.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
    title: 'Development',
    description:
      'Pixel-perfect implementation. We bring designs to life with clean, performant code that scales beautifully.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" />
        <path d="M22 4L12 14" />
      </svg>
    ),
    title: 'UX Audits',
    description:
      'Identify what\'s working and what isn\'t. We evaluate existing products with fresh eyes and provide actionable improvements.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: 'Design Systems',
    description:
      'Consistent, scalable design. We build comprehensive systems that ensure brand coherence across every touchpoint.',
  },
]

export default function Capabilities() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Label line draws */
      gsap.from('[data-cap-line]', {
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

      /* Header elements stagger */
      gsap.from('[data-cap-reveal]', {
        y: 60,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1.2,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      /* Cards — clean staggered rise */
      gsap.from('[data-cap-card]', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: {
          each: 0.08,
          grid: [2, 3],
          from: 'start',
        },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-cap-grid]',
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="capabilities" ref={sectionRef} className={styles.capabilities}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.label}>
            <span className={styles.labelLine} data-cap-line />
            <span data-cap-reveal>What We Do</span>
          </div>
          <h2 className={styles.heading} data-cap-reveal>
            Capabilities
          </h2>
          <p className={styles.intro} data-cap-reveal>
            From research to launch, we bring a full spectrum of design and
            development expertise to every project.
          </p>
        </div>

        <div className={styles.grid} data-cap-grid>
          {SERVICES.map((service) => (
            <div key={service.title} className={styles.card} data-cap-card>
              <div className={styles.cardIcon} data-cap-icon>{service.icon}</div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
              <div className={styles.cardShine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
