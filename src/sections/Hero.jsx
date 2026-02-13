import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CrowdScene from '../components/CrowdScene'
import MagneticButton from '../components/MagneticButton'
import styles from './Hero.module.css'

export default function Hero() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      /* Title lines stagger in */
      tl.fromTo('[data-hero-line]',
        {
          y: 60,
          opacity: 0,
          filter: 'blur(12px)',
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
        }
      )

      /* Subtitle */
      tl.fromTo(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          filter: 'blur(8px)',
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.6'
      )

      /* CTAs */
      tl.fromTo(
        ctaRef.current.children,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.5'
      )

      /* Scroll indicator */
      tl.fromTo(
        scrollRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.3'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  function handleScroll(e) {
    e.preventDefault()
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" ref={sectionRef} className={styles.hero}>
      <CrowdScene className={styles.canvas} data-crowd-canvas />

      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.title}>
          <span className={styles.line} data-hero-line>
            <span className={styles.prefix}>Be<span className={styles.dot}>.</span></span>
            <span className={styles.italic}>inspired</span>
          </span>
          <span className={styles.line} data-hero-line>
            <span className={styles.prefix}>Be<span className={styles.dot}>.</span></span>
            <span className={styles.italic}>immersed</span>
          </span>
          <span className={styles.line} data-hero-line>
            <span className={styles.prefix}>Be<span className={styles.dot}>.</span></span>
            <span className={styles.italic}>intentional</span>
          </span>
        </h1>

        <p ref={subtitleRef} className={styles.subtitle}>
          We craft digital experiences rooted in human empathy — where every
          pixel serves a purpose and every interaction tells a story.
        </p>

        <div ref={ctaRef} className={styles.ctas}>
          <MagneticButton strength={0.4}>
            <a href="#contact" className={styles.btnPrimary} onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Start a Project
            </a>
          </MagneticButton>
          <MagneticButton strength={0.35}>
            <a href="#work" className={styles.btnSecondary} onClick={(e) => {
              e.preventDefault()
              document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Our Work
            </a>
          </MagneticButton>
        </div>
      </div>

      <button
        ref={scrollRef}
        className={styles.scrollIndicator}
        onClick={handleScroll}
        aria-label="Scroll to content"
      >
        <span className={styles.scrollText}>Scroll</span>
        <span className={styles.scrollLine} />
      </button>
    </section>
  )
}
