import React, { useEffect, useRef } from 'react'
import Button from '../UI/Button'
import styles from './Hero.module.css'

export default function Hero() {
  const heroRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      heroRef.current?.classList.add(styles.animated)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!glowRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 50
      const y = (e.clientY / window.innerHeight - 0.5) * 50
      glowRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.heroGlow} ref={glowRef} aria-hidden="true" />
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
          <Button to="/sales" variant="copper">Explore Sales Training</Button>
          <Button to="/pro-lessons" variant="ghost">Pro Lessons</Button>
        </div>
      </div>
    </section>
  )
}
