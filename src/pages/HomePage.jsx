import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import GradientBackground from '../components/GradientBackground'
import ScrollEffects from '../components/ScrollEffects'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Capabilities from '../sections/Capabilities'
import CaseStudies from '../sections/CaseStudies'
import Contact from '../sections/Contact'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  useEffect(() => {
    /* Detect mobile for performance optimizations */
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768

    /* Lenis smooth scroll — reduced smoothness on mobile */
    const lenis = new Lenis({
      duration: isMobile ? 0.8 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: !isMobile,
      touchMultiplier: isMobile ? 1.5 : 2,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const rafCallback = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)
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
      invalidateOnRefresh: true,
    })

    ScrollTrigger.create({
      trigger: '#capabilities',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        const bg = document.querySelector('[data-gradient-bg]')
        if (bg) bg.style.opacity = 1 - self.progress
      },
      invalidateOnRefresh: true,
    })

    /* Refresh ScrollTrigger after layout settles */
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200)

    /* Additional refresh after fonts/images load on mobile */
    if (isMobile) {
      window.addEventListener('load', () => {
        setTimeout(() => ScrollTrigger.refresh(), 500)
      })
    }

    return () => {
      clearTimeout(refreshTimer)
      gsap.ticker.remove(rafCallback)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <>
      <GradientBackground />
      <ScrollEffects />
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
