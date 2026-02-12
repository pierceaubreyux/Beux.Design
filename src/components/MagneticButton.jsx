import { useEffect, useRef } from 'react'

export default function MagneticButton({ children, className, strength = 0.35, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* Only on pointer devices */
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return

    const radius = 120 /* attraction radius in px */

    function onMouseMove(e) {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < radius) {
        const pull = (1 - dist / radius) * strength
        el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`
      } else {
        el.style.transform = ''
      }
    }

    function onMouseLeave() {
      el.style.transform = ''
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [strength])

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: 'inline-block', transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }}
      {...rest}
    >
      {children}
    </div>
  )
}
