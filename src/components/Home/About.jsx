import React from 'react'
import { useEffect, useRef } from 'react'
import SectionLabel from '../UI/SectionLabel'
import Button from '../UI/Button'
import styles from './About.module.css'

export default function About() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 120)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <div className={styles.imageCol} data-reveal>
          <div className={styles.image} aria-hidden="true" />
        </div>
        <div className={styles.textCol} data-reveal>
          <SectionLabel>About Us</SectionLabel>
          <h2 className={styles.heading}>
            Built for the Industry,<br />
            <em>by the Industry.</em>
          </h2>
          <p className={styles.body}>
            This site exists because nobody teaches you the business side in trade school.
            You learn how to braze a line set but not how to close a $12,000 job.
          </p>
          <p className={styles.body}>
            No fluff. Just what actually works.
          </p>
          <Button to="/about" variant="primary">Learn More</Button>
        </div>
      </div>
    </section>
  )
}
