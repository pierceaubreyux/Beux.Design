import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/MagneticButton'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Label line */
      gsap.from('[data-ct-line]', {
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

      /* Info column — slides from left */
      gsap.from('[data-ct-info]', {
        x: -80,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      /* Form — slides from right */
      gsap.from('[data-ct-form]', {
        x: 80,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 1.2,
        delay: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      /* Detail items stagger */
      gsap.from('[data-ct-detail]', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      /* Footer fade */
      gsap.from('[data-ct-footer]', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-ct-footer]',
          start: 'top 95%',
          toggleActions: 'play none none none',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setSubmitted(true)
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined })
    }
  }

  return (
    <section id="contact" ref={sectionRef} className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left — info */}
          <div className={styles.info} data-ct-info>
            <div className={styles.label}>
              <span className={styles.labelLine} data-ct-line />
              <span>Get in Touch</span>
            </div>
            <h2 className={styles.heading}>
              Let's Create Together
            </h2>
            <p className={styles.desc}>
              Ready to bring your vision to life? We'd love to hear about your
              project and explore how thoughtful design can make a difference.
            </p>

            <div className={styles.details}>
              <div className={styles.detailItem} data-ct-detail>
                <span className={styles.detailLabel}>Email</span>
                <a href="mailto:hello@beux.design" className={styles.detailValue}>
                  hello@beux.design
                </a>
              </div>
              <div className={styles.detailItem} data-ct-detail>
                <span className={styles.detailLabel}>Location</span>
                <span className={styles.detailValue}>London, UK</span>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className={styles.formWrap} data-ct-form>
            {submitted ? (
              <div className={styles.success}>
                <h3>Thank you</h3>
                <p>
                  We've received your message and will be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.fieldLabel}>
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <span className={styles.error}>{errors.name}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.fieldLabel}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <span className={styles.error}>{errors.email}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.fieldLabel}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && (
                    <span className={styles.error}>{errors.message}</span>
                  )}
                </div>

                <MagneticButton strength={0.35}>
                  <button type="submit" className={styles.submit}>
                    Send Message
                  </button>
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer} data-ct-footer>
        <div className={styles.footerInner}>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} Beux.Design. All rights reserved.
          </span>
          <div className={styles.footerLinks}>
            <a href="#home">Privacy</a>
            <a href="#home">Terms</a>
          </div>
        </div>
      </footer>
    </section>
  )
}
