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

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.inner}>
        <p className={styles.label}>For HVAC Professionals</p>
        <h1 className={styles.heading}>
          Sell Smarter.<br />
          <em>Master Your Craft.</em>
        </h1>
        <p className={styles.subtitle}>
          Sales training, technical lessons, and industry insights — built for the people who keep America comfortable.
        </p>
        <div className={styles.actions}>
          <Button to="/sales" variant="primary">Explore Sales Training</Button>
          <Button to="/pro-lessons" variant="secondary">Pro Lessons</Button>
        </div>
      </div>

    </section>
  )
}
