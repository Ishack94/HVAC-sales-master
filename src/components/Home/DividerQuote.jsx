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
        <span className={styles.mark}>&ldquo;</span>
        <blockquote className={styles.quote}>{quote}</blockquote>
        <span className={styles.mark}>&rdquo;</span>
      </div>
    </div>
  )
}
