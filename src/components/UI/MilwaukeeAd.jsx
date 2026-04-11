import React from 'react'
import styles from './MilwaukeeAd.module.css'

export default function MilwaukeeAd({ className }) {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      <span className={styles.label}>MILWAUKEE TOOL</span>
      <h4 className={styles.title}>Milwaukee Tool</h4>
      <p className={styles.desc}>Nothing but heavy duty. The tools HVAC pros actually trust on the job.</p>
      <a
        href="https://www.milwaukeetool.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.btn}
      >
        Shop Now →
      </a>
    </div>
  )
}
