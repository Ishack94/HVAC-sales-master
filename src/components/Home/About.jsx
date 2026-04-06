import React from 'react'
import { useRef } from 'react'
import useFadeIn from '../../utils/useFadeIn'
import SectionLabel from '../UI/SectionLabel'
import Button from '../UI/Button'
import styles from './About.module.css'

export default function About() {
  const ref = useRef(null)
  useFadeIn(ref)

  return (
    <section className={`${styles.section} fade-section`} ref={ref}>
      <div className={styles.container}>
        <SectionLabel>About</SectionLabel>
        <h2 className={styles.heading}>
          Built for the Industry,<br />
          <em>by the Industry.</em>
        </h2>
        <p className={styles.body}>
          HVAC Sales Master exists because the gap between field experience and business
          success shouldn&apos;t be a secret. The best technicians and salespeople learn through
          years of expensive trial and error — we&apos;re here to shortcut that.
        </p>
        <p className={styles.body}>
          Every article is written from the inside — practical, direct, and grounded in
          how HVAC businesses actually work. No fluff. Just what actually works.
        </p>
        <Button to="/about" variant="primary">Learn More</Button>
      </div>
    </section>
  )
}
