import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './CaseStudies.module.css'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    client: 'Meridian Health',
    title: 'Reimagining Patient Care',
    description:
      'A complete redesign of the patient portal, making healthcare navigation intuitive and stress-free for millions of users.',
    metric: '40%',
    metricLabel: 'increase in patient engagement',
    tags: ['UX Design', 'User Research', 'Development'],
    gradient: 'linear-gradient(135deg, #0a2a4a 0%, #1a4a6a 40%, #0d3d5c 100%)',
  },
  {
    client: 'Luminary Finance',
    title: 'Making Finance Feel Human',
    description:
      'Transforming complex financial tools into clear, approachable experiences that build trust and reduce user friction.',
    metric: '60%',
    metricLabel: 'reduction in support tickets',
    tags: ['Product Design', 'UX Audit'],
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2a2a5e 40%, #151540 100%)',
  },
  {
    client: 'Atlas Education',
    title: 'Learning Without Limits',
    description:
      'An adaptive learning platform that personalizes education to each student\'s unique journey, setting new industry benchmarks.',
    metric: '85%',
    metricLabel: 'completion rate (vs 23% avg)',
    tags: ['Product Design', 'User Research', 'Development'],
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #2e1a4a 40%, #1a1040 100%)',
  },
]

export default function CaseStudies() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Label line draws */
      gsap.from('[data-cs-line]', {
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

      /* Header */
      gsap.from('[data-cs-reveal]', {
        y: 50,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 1.2,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      /* Per-card animations */
      const cards = sectionRef.current.querySelectorAll('[data-cs-card]')
      cards.forEach((card, i) => {
        const isReversed = i % 2 !== 0

        /* Divider draws in */
        const divider = card.querySelector('[data-cs-divider]')
        if (divider) {
          gsap.from(divider, {
            scaleX: 0,
            transformOrigin: isReversed ? 'right' : 'left',
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          })
        }

        /* Number slides up */
        const num = card.querySelector('[data-cs-num]')
        if (num) {
          gsap.from(num, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })

          /* Number parallax on scroll */
          gsap.to(num, {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        /* Image clip reveal */
        const imgWrap = card.querySelector('[data-cs-img-wrap]')
        if (imgWrap) {
          gsap.from(imgWrap, {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          })
        }

        /* Image parallax within container */
        const imgInner = card.querySelector('[data-cs-image]')
        if (imgInner) {
          gsap.to(imgInner, {
            y: -40,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        /* Info content stagger */
        const infoEls = card.querySelectorAll('[data-cs-info-item]')
        if (infoEls.length) {
          gsap.from(infoEls, {
            y: 40,
            opacity: 0,
            filter: 'blur(4px)',
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          })
        }
      })

      /* Metric counter animations */
      gsap.utils.toArray('[data-counter]').forEach((el) => {
        const raw = el.dataset.countTo
        const numericMatch = raw.match(/[\d.]+/)
        if (!numericMatch) return

        const target = parseFloat(numericMatch[0])
        const suffix = raw.replace(numericMatch[0], '')
        const hasDecimal = raw.includes('.')

        el.textContent = '0' + suffix

        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            el.textContent =
              (hasDecimal ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix
          },
        })
      })

      /* Tag stagger per card */
      gsap.utils.toArray('[data-cs-tags]').forEach((tagWrap) => {
        gsap.from(tagWrap.children, {
          y: 10,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: tagWrap,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={sectionRef} className={styles.caseStudies}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.label}>
            <span className={styles.labelLine} data-cs-line />
            <span data-cs-reveal>Selected Work</span>
          </div>
          <h2 className={styles.heading} data-cs-reveal>
            Case Studies
          </h2>
        </div>

        <div className={styles.list}>
          {PROJECTS.map((project, i) => (
            <article
              key={project.title}
              className={`${styles.card} ${i % 2 !== 0 ? styles.cardReverse : ''}`}
              data-cs-card
            >
              {/* Divider line above each card */}
              <div className={styles.divider} data-cs-divider />

              {/* Large project number */}
              <span className={styles.index} data-cs-num>
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className={styles.cardInner}>
                <div className={styles.imageWrap} data-cs-img-wrap>
                  <div
                    className={styles.imagePlaceholder}
                    data-cs-image
                    style={{ background: project.gradient }}
                  >
                    <div className={styles.imageOverlay} />
                    <span className={styles.placeholderInitial}>
                      {project.client.charAt(0)}
                    </span>
                  </div>
                  {/* Hover CTA */}
                  <div className={styles.imageHoverCta}>
                    <span>View Project</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                <div className={styles.info}>
                  <span className={styles.client} data-cs-info-item>{project.client}</span>
                  <h3 className={styles.projectTitle} data-cs-info-item>{project.title}</h3>
                  <p className={styles.projectDesc} data-cs-info-item>{project.description}</p>

                  <div className={styles.metric} data-cs-info-item>
                    <span
                      className={styles.metricValue}
                      data-counter
                      data-count-to={project.metric}
                    >
                      {project.metric}
                    </span>
                    <span className={styles.metricLabel}>
                      {project.metricLabel}
                    </span>
                  </div>

                  <div className={styles.tags} data-cs-tags>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
