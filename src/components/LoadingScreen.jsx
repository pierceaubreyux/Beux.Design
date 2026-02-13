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

  /* Track fonts + window load, then smoothly complete */
  useEffect(() => {
    let completed = false
    let resourcesReady = false
    const startTime = Date.now()
    const MIN_DISPLAY_TIME = 2500 // Show loader for at least 2.5s

    const readyState = {
      fonts: false,
      window: false,
    }

    function checkAllReady() {
      if (readyState.fonts && readyState.window) {
        resourcesReady = true

        /* Wait for minimum display time before completing */
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed)

        setTimeout(() => {
          if (!completed) {
            completed = true
            animateToComplete()
          }
        }, remaining)
      }
    }

    /* 1. Wait for fonts to load */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        readyState.fonts = true
        checkAllReady()
      })
    } else {
      readyState.fonts = true
    }

    /* 2. Wait for all resources (images, etc.) */
    if (document.readyState === 'complete') {
      readyState.window = true
      checkAllReady()
    } else {
      window.addEventListener('load', () => {
        readyState.window = true
        checkAllReady()
      })
    }

    /* Fallback: auto-complete after 5s max */
    const fallback = setTimeout(() => {
      if (!completed) {
        completed = true
        animateToComplete()
      }
    }, 5000)

    return () => clearTimeout(fallback)
  }, [])

  /* Smoothly animate progress from 90 to 100, then finish */
  function animateToComplete() {
    let current = 90

    function tick() {
      current += (100 - current) * 0.15

      if (barFillRef.current) {
        barFillRef.current.style.width = `${current}%`
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(current)}%`
      }

      if (current < 99.5) {
        requestAnimationFrame(tick)
      } else {
        // Snap to 100% and finish
        if (barFillRef.current) barFillRef.current.style.width = '100%'
        if (percentRef.current) percentRef.current.textContent = '100%'
        setProgress(100)

        setTimeout(() => finishLoading(), 400)
      }
    }

    tick()
  }

  function finishLoading() {
    const tl = gsap.timeline()

    /* Fade out all content */
    tl.to(
      [logoRef.current, modelAreaRef.current, barFillRef.current?.parentElement, percentRef.current],
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      }
    )

    /* Signal page to mount, then animate curtain split to reveal it */
    tl.call(() => onComplete?.())

    tl.to(
      overlayRef.current.querySelector('[data-curtain-top]'),
      {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
      },
      '+=0.6' // Wait for gradient to render before opening curtain
    )

    tl.to(
      overlayRef.current.querySelector('[data-curtain-bottom]'),
      {
        yPercent: 100,
        duration: 1,
        ease: 'power4.inOut',
      },
      '<' // Start at same time as top curtain
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
