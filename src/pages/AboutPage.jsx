import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import styles from './AboutPage.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('[data-hero-title]', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.2,
      })

      gsap.from('[data-hero-subtitle]', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4,
      })

      // Team section
      gsap.from('[data-team-heading]', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-team-heading]',
          start: 'top 80%',
        },
      })

      gsap.from('[data-team-card]', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-team-grid]',
          start: 'top 75%',
        },
      })

      // Story section
      gsap.from('[data-story-heading]', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-story-heading]',
          start: 'top 80%',
        },
      })

      gsap.from('[data-story-text]', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-story-section]',
          start: 'top 75%',
        },
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle} data-hero-title>
            We are Beux Design
          </h1>
          <p className={styles.heroSubtitle} data-hero-subtitle>
            A small team creating meaningful digital experiences with empathy and intention.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading} data-team-heading>
            Meet the Team
          </h2>

          <div className={styles.teamGrid} data-team-grid>
            {/* Team Member 1 */}
            <div className={styles.teamCard} data-team-card>
              <div className={styles.teamImageWrap}>
                <div className={styles.teamImage}>
                  <div className={styles.teamAvatar}>
                    <svg viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="35" r="15" fill="currentColor" opacity="0.3" />
                      <path d="M 25 65 Q 25 50, 50 50 Q 75 50, 75 65 L 75 80 L 25 80 Z" fill="currentColor" opacity="0.3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={styles.teamInfo}>
                <h3 className={styles.teamName}>Your Name</h3>
                <p className={styles.teamRole}>Co-Founder & Creative Director</p>
                <p className={styles.teamBio}>
                  Passionate about creating meaningful digital experiences that bridge
                  the gap between human needs and technological possibility. With 8+ years
                  in UX design, focused on building products that feel natural and intuitive.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className={styles.teamCard} data-team-card>
              <div className={styles.teamImageWrap}>
                <div className={styles.teamImage}>
                  <div className={styles.teamAvatar}>
                    <svg viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="35" r="15" fill="currentColor" opacity="0.3" />
                      <path d="M 25 65 Q 25 50, 50 50 Q 75 50, 75 65 L 75 80 L 25 80 Z" fill="currentColor" opacity="0.3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={styles.teamInfo}>
                <h3 className={styles.teamName}>Partner Name</h3>
                <p className={styles.teamRole}>Co-Founder & Lead Designer</p>
                <p className={styles.teamBio}>
                  Dedicated to designing intuitive interfaces that feel natural, combining
                  aesthetic elegance with functional clarity. Specializes in design systems
                  and turning complex problems into simple, delightful solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className={styles.storySection} data-story-section>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading} data-story-heading>
            Our Story
          </h2>

          <div className={styles.storyContent}>
            <p className={styles.storyText} data-story-text>
              Beux Design was born from a shared belief: that the best digital
              products come from deeply understanding the people who use them.
            </p>
            <p className={styles.storyText} data-story-text>
              We've worked with startups and established companies alike, helping
              them create experiences that users love. Our approach is simple —
              listen first, design with intention, and never stop iterating.
            </p>
            <p className={styles.storyText} data-story-text>
              Every project is an opportunity to make something meaningful.
              We're here to craft digital experiences that feel effortless,
              look beautiful, and make a real impact.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaHeading}>Let us work together</h2>
          <p className={styles.ctaText}>
            Ready to create something meaningful?
          </p>
          <Link to="/contact" className={styles.ctaButton}>
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  )
}
