import React from 'react'
import { useRef } from 'react'
import useFadeIn from '../../utils/useFadeIn'
import styles from './DividerQuote.module.css'

export default function DividerQuote({ quote }) {
  const ref = useRef(null)
  useFadeIn(ref)

  return (
    <div className={`${styles.divider} fade-section`} ref={ref}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.line} />
          <blockquote className={styles.quote}>{quote}</blockquote>
          <p className={styles.secondary}>
            Technical skill and sales ability aren&apos;t separate paths — they&apos;re two sides of the same career.
          </p>
          <div className={styles.line} />
        </div>
      </div>
    </div>
  )
}
