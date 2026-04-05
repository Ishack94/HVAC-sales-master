import React from 'react'
import { useEffect, useRef } from 'react'
import Button from '../UI/Button'
import styles from './Hero.module.css'

export default function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => {
      heroRef.current?.classList.add(styles.animated)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  const scrollToContent = () => {
    const el = document.getElementById('sales-training')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.inner}>
        <p className={styles.label}>For HVAC Professionals</p>
        <h1 className={styles.heading}>
          HVAC guys lose jobs every day<br />
          <em>they should&apos;ve won.</em>
        </h1>
        <p className={styles.subtitle}>
          This site shows you what actually works when you&apos;re talking to customers, quoting systems, and trying to close jobs in the real world.
        </p>
        <p className={styles.muted}>No fluff. No corporate training. Just real stuff from the field.</p>
        <div className={styles.actions}>
          <Button to="/sales" variant="primary">Start Reading</Button>
          <Button to="/learn" variant="secondary">Browse Topics</Button>
        </div>
      </div>

      <button className={styles.scrollIndicator} onClick={scrollToContent} aria-label="Scroll to content">
        <span className={styles.scrollText}>Scroll</span>
        <span className={styles.scrollLine} />
      </button>
    </section>
  )
}
