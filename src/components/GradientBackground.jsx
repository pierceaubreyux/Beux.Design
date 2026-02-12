import styles from './GradientBackground.module.css'

export default function GradientBackground() {
  return (
    <div className={styles.wrapper} aria-hidden="true" data-gradient-bg>
      <div className={styles.gradient} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />
      <div className={styles.orbAccent} />
      <div className={styles.orbDeep} />
      <div className={styles.noise} />
      <div className={styles.vignette} />
    </div>
  )
}
