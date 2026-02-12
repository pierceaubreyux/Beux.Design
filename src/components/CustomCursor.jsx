import { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    // Skip entirely on mobile/touch devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
                     window.innerWidth < 768 ||
                     'ontouchstart' in window
    if (isMobile) return
    /* Track mouse target position */
    function onMouseMove(e) {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    /* Smooth lerp animation */
    let raf
    function animate() {
      const ease = 0.15
      pos.current.x += (target.current.x - pos.current.x) * ease
      pos.current.y += (target.current.y - pos.current.y) * ease

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`
      }

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    /* Hover detection — interactive elements */
    function onMouseOver(e) {
      const el = e.target.closest('a, button, [data-cursor-hover], input, textarea, select')
      if (el) setHovering(true)
    }

    function onMouseOut(e) {
      const el = e.target.closest('a, button, [data-cursor-hover], input, textarea, select')
      if (el) setHovering(false)
    }

    /* Hide cursor when leaving window */
    function onMouseLeave() {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
    }
    function onMouseEnter() {
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseout', onMouseOut, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${hovering ? styles.hovering : ''}`}
    >
      <div className={styles.ring}>
        <div className={styles.dot} />
      </div>
    </div>
  )
}
