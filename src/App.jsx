import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import GradientBackground from './components/GradientBackground'
import ScrollEffects from './components/ScrollEffects'
import Navigation from './components/Navigation'
import Hero from './sections/Hero'
import About from './sections/About'
import Capabilities from './sections/Capabilities'
import CaseStudies from './sections/CaseStudies'
import Contact from './sections/Contact'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /* Lock scroll during loading */
    if (loading) {
      document.body.style.overflow = 'hidden'
      return
    }

    document.body.style.overflow = ''

    /* Detect mobile for performance optimizations */
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768

    /* Lenis smooth scroll — reduced smoothness on mobile */
    const lenis = new Lenis({
      duration: isMobile ? 0.8 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: !isMobile, // Disable smooth wheel on mobile
      touchMultiplier: isMobile ? 1.5 : 2,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const rafCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
    // Enable lag smoothing to prevent frame drops from causing jumps
    gsap.ticker.lagSmoothing(500, 33)

    /* Fade gradient bg through hero + about, canvas fades faster */
    ScrollTrigger.create({
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const canvas = document.querySelector('[data-crowd-canvas]')
        if (canvas) canvas.style.opacity = (1 - self.progress) * 0.85
      },
    })

    ScrollTrigger.create({
      trigger: '#capabilities',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const bg = document.querySelector('[data-gradient-bg]')
        if (bg) bg.style.opacity = 1 - self.progress
      },
    })

    /* Refresh ScrollTrigger after layout settles */
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200)

    return () => {
      clearTimeout(refreshTimer)
      gsap.ticker.remove(rafCallback)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [loading])

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <CustomCursor />
      <GradientBackground />
      <ScrollEffects />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Capabilities />
        <CaseStudies />
        <Contact />
      </main>
    </>
  )
}
