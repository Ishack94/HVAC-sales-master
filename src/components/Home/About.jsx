import React, { useRef } from 'react'
import useFadeIn from '../../utils/useFadeIn'
import SectionLabel from '../UI/SectionLabel'
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
          HVAC Sales Master was built by someone who&apos;s been in the trades. Every article,
          every lesson, every guide is written for the people actually doing the work —
          not sitting in an office reading about it.
        </p>
        <p className={styles.tagline}>No fluff. Just what actually works.</p>
      </div>
    </section>
  )
}
