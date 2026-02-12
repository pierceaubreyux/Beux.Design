import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ onComplete }) {
  const overlayRef = useRef(null)
  const logoRef = useRef(null)
  const barFillRef = useRef(null)
  const percentRef = useRef(null)
  const modelAreaRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    /* Entrance animation */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(logoRef.current, {
        opacity: 0,
        y: 20,
        filter: 'blur(8px)',
        duration: 0.8,
        ease: 'power3.out',
      })

      tl.from(
        modelAreaRef.current,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      )

      tl.from(
        barFillRef.current?.parentElement,
        {
          opacity: 0,
          y: 10,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.3'
      )
    }, overlayRef)

    return () => ctx.revert()
  }, [])

  /* Simulate loading progress — this will sync with real asset loading */
  useEffect(() => {
    let frame
    let current = 0

    function tick() {
      /* Fast to 70%, slow to 90%, then wait for real completion */
      const target = current < 70 ? current + 2.5 : current < 90 ? current + 0.4 : 90
      current = Math.min(target, 90)
      setProgress(Math.round(current))

      if (barFillRef.current) {
        barFillRef.current.style.width = `${current}%`
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(current)}%`
      }

      if (current < 90) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  /* Listen for the 3D scene to signal it's loaded */
  useEffect(() => {
    function handleSceneLoaded() {
      finishLoading()
    }

    /* Also listen for a global event from CrowdScene */
    window.addEventListener('beux-scene-ready', handleSceneLoaded)

    /* Fallback: auto-complete after 5s max */
    const fallback = setTimeout(() => finishLoading(), 5000)

    return () => {
      window.removeEventListener('beux-scene-ready', handleSceneLoaded)
      clearTimeout(fallback)
    }
  }, [])

  function finishLoading() {
    /* Animate to 100% */
    if (barFillRef.current) {
      gsap.to(barFillRef.current, {
        width: '100%',
        duration: 0.4,
        ease: 'power2.out',
      })
    }
    if (percentRef.current) {
      percentRef.current.textContent = '100%'
    }
    setProgress(100)

    /* Exit animation */
    const tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => onComplete?.(),
    })

    tl.to(logoRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power3.in',
    })

    tl.to(
      modelAreaRef.current,
      {
        opacity: 0,
        scale: 1.05,
        duration: 0.4,
        ease: 'power3.in',
      },
      '-=0.3'
    )

    tl.to(
      barFillRef.current?.parentElement,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
      },
      '-=0.3'
    )

    /* Curtain split — top half goes up, bottom half goes down */
    tl.to(overlayRef.current.querySelector('[data-curtain-top]'), {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    })

    tl.to(
      overlayRef.current.querySelector('[data-curtain-bottom]'),
      {
        yPercent: 100,
        duration: 0.9,
        ease: 'power4.inOut',
      },
      '<'
    )
  }

  return (
    <div ref={overlayRef} className={styles.overlay}>
      {/* Curtain panels for the exit reveal */}
      <div className={styles.curtainTop} data-curtain-top />
      <div className={styles.curtainBottom} data-curtain-bottom />

      {/* Content layer */}
      <div className={styles.content}>
        {/* Logo */}
        <div ref={logoRef} className={styles.logo}>
          <span className={styles.logoBeux}>Beux<span className={styles.dot}>.</span></span>
          <span className={styles.logoDesign}>Design</span>
        </div>

        {/* Walking figure */}
        <div ref={modelAreaRef} className={styles.modelArea}>
          <img
            src="/walking-loader.gif"
            alt="Loading"
            className={styles.walkerGif}
          />
          <div className={styles.groundLine} />
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div ref={barFillRef} className={styles.progressFill} />
          </div>
          <span ref={percentRef} className={styles.percent}>0%</span>
        </div>
      </div>
    </div>
  )
}
