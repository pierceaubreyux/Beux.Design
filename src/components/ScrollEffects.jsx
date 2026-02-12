import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ScrollEffects.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollEffects() {
  const ref = useRef(null)

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Skip all scroll effects on mobile or reduced motion
    if (isMobile || prefersReducedMotion) return

    const ctx = gsap.context(() => {
      /* ── Guide line fill — draws top→bottom with scroll ── */
      gsap.to('[data-guide-fill]', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })

      /* ── Floating rings — parallax + scale ── */
      gsap.utils.toArray('[data-float]').forEach((el) => {
        const speed = parseFloat(el.dataset.float)
        const scaleStart = parseFloat(el.dataset.floatScale) || 1
        const scaleEnd = parseFloat(el.dataset.floatScaleEnd) || scaleStart

        gsap.fromTo(el, {
          y: 0,
          scale: scaleStart,
        }, {
          y: () => speed * window.innerHeight,
          scale: scaleEnd,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        })
      })

      /* ── Ring circles draw-out on scroll ── */
      gsap.utils.toArray('[data-ring-draw]').forEach((circle) => {
        const length = circle.getTotalLength()
        gsap.set(circle, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
        gsap.to(circle, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: '40% top',
            scrub: 1.5,
          },
        })
      })

      /* ── Accent dots — subtle drift ── */
      gsap.utils.toArray('[data-drift]').forEach((el) => {
        const speed = parseFloat(el.dataset.drift)
        gsap.to(el, {
          y: () => speed * window.innerHeight * 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        })
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={styles.wrapper} aria-hidden="true">
      {/* ── Vertical guide line ── */}
      <div className={styles.guideWrap}>
        <div className={styles.guideTrack} />
        <div className={styles.guideFill} data-guide-fill />
        <div className={styles.guideGlow} data-guide-fill />
      </div>

      {/* ── Floating rings — gradient strokes, animated ── */}
      <div
        className={`${styles.ring} ${styles.ring1}`}
        data-float="-0.2"
        data-float-scale="0.8"
        data-float-scale-end="1.15"
      >
        <svg viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id="ringGrad1" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(74,144,217,0.4)" />
              <stop offset="50%" stopColor="rgba(208,255,113,0.15)" />
              <stop offset="100%" stopColor="rgba(74,144,217,0.05)" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="96" stroke="url(#ringGrad1)" strokeWidth="0.8" data-ring-draw />
          <circle cx="100" cy="100" r="80" stroke="rgba(74,144,217,0.12)" strokeWidth="0.4" strokeDasharray="4 8" />
        </svg>
      </div>

      <div
        className={`${styles.ring} ${styles.ring2}`}
        data-float="0.25"
        data-float-scale="1"
        data-float-scale-end="0.85"
      >
        <svg viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id="ringGrad2" x1="0" y1="200" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(208,255,113,0.2)" />
              <stop offset="100%" stopColor="rgba(74,144,217,0.3)" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="96" stroke="url(#ringGrad2)" strokeWidth="0.6" data-ring-draw />
          <circle cx="100" cy="100" r="60" stroke="rgba(74,144,217,0.1)" strokeWidth="0.3" strokeDasharray="4 8" />
        </svg>
      </div>

      <div
        className={`${styles.ring} ${styles.ring3}`}
        data-float="-0.12"
        data-float-scale="0.9"
        data-float-scale-end="1.1"
      >
        <svg viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id="ringGrad3" x1="200" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(74,144,217,0.25)" />
              <stop offset="40%" stopColor="rgba(208,255,113,0.1)" />
              <stop offset="100%" stopColor="rgba(74,144,217,0.03)" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="98" stroke="url(#ringGrad3)" strokeWidth="0.6" data-ring-draw />
          <circle cx="100" cy="100" r="72" stroke="rgba(74,144,217,0.1)" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="48" stroke="rgba(74,144,217,0.06)" strokeWidth="0.2" strokeDasharray="3 9" />
        </svg>
      </div>

      {/* ── Accent dots ── */}
      <div className={`${styles.dot} ${styles.dot1}`} data-drift="-0.3" />
      <div className={`${styles.dot} ${styles.dot2}`} data-drift="0.25" />
      <div className={`${styles.dot} ${styles.dot3}`} data-drift="-0.15" />
      <div className={`${styles.dot} ${styles.dot4}`} data-drift="0.35" />
      <div className={`${styles.dot} ${styles.dot5}`} data-drift="-0.2" />

      {/* ── Luminous cross accents ── */}
      <div className={`${styles.cross} ${styles.cross1}`} data-float="0.12" data-float-scale="1" data-float-scale-end="1.3">
        <svg viewBox="0 0 20 20" fill="none">
          <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="0.5" />
          <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className={`${styles.cross} ${styles.cross2}`} data-float="-0.18" data-float-scale="1" data-float-scale-end="0.7">
        <svg viewBox="0 0 20 20" fill="none">
          <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="0.5" />
          <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  )
}
