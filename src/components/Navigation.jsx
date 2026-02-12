import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import styles from './Navigation.module.css'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#capabilities' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)
  const mobileNavRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* Animate mobile menu open/close */
  useEffect(() => {
    if (!mobileNavRef.current) return

    if (tlRef.current) {
      tlRef.current.kill()
    }

    const overlay = mobileNavRef.current
    const links = overlay.querySelectorAll('[data-mobile-link]')
    const dividers = overlay.querySelectorAll('[data-mobile-divider]')
    const footer = overlay.querySelector('[data-mobile-footer]')

    if (mobileOpen) {
      const tl = gsap.timeline()
      tlRef.current = tl

      tl.set(overlay, { visibility: 'visible' })
      tl.to(overlay, {
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      })
      tl.from(dividers, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.8,
        stagger: 0.06,
        ease: 'power4.out',
      }, '-=0.2')
      tl.from(links, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: 'power3.out',
      }, '-=0.7')
      if (footer) {
        tl.from(footer, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
        }, '-=0.3')
      }
    } else {
      const tl = gsap.timeline()
      tlRef.current = tl

      tl.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { visibility: 'hidden' })
        },
      })
    }
  }, [mobileOpen])

  const handleLinkClick = useCallback((e, href) => {
    e.preventDefault()
    setMobileOpen(false)
    /* Small delay so the menu close animation starts before scroll */
    setTimeout(() => {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }, 300)
  }, [])

  return (
    <>
      <header
        ref={navRef}
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      >
        <div className={styles.inner}>
          <a href="#home" className={styles.logo} onClick={(e) => handleLinkClick(e, '#home')}>
            <span className={styles.logoBeux}>Beux<span className={styles.dot}>.</span></span>
            <span className={styles.logoDesign}>Design</span>
          </a>

          {/* Desktop nav */}
          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.navLink}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Burger button */}
          <button
            className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu — outside header so backdrop-filter doesn't break fixed positioning */}
      <nav ref={mobileNavRef} className={styles.mobileNav}>
        <div className={styles.mobileInner}>
          <div className={styles.mobileLinks}>
            {NAV_LINKS.map((link, i) => (
              <div key={link.href} className={styles.mobileLinkRow}>
                <div className={styles.mobileDivider} data-mobile-divider />
                <a
                  href={link.href}
                  className={styles.mobileLink}
                  data-mobile-link
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  <span className={styles.mobileLinkNum}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.mobileLinkLabel}>{link.label}</span>
                  <svg className={styles.mobileLinkArrow} width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            ))}
            {/* Final divider */}
            <div className={styles.mobileDivider} data-mobile-divider />
          </div>

          <div className={styles.mobileFooter} data-mobile-footer>
            <a href="mailto:hello@beux.design" className={styles.mobileEmail}>
              hello@beux.design
            </a>
            <span className={styles.mobileLocation}>London, UK</span>
          </div>
        </div>
      </nav>
    </>
  )
}
