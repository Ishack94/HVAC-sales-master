import React from 'react'
import styles from './StepProgress.module.css'

export default function StepProgress({ steps = ['Rooms', 'Equipment', 'Results'], currentStep = 1 }) {
  const total = steps.length
  const pct = ((currentStep - 1) / (total - 1)) * 100

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.badges}>
        {steps.map((label, i) => {
          const num = i + 1
          const isActive = num === currentStep
          const isComplete = num < currentStep
          return (
            <div key={i} className={`${styles.badge} ${isActive ? styles.active : ''} ${isComplete ? styles.complete : ''}`}>
              <span className={styles.badgeNum}>{isComplete ? '✓' : num}</span>
              <span className={styles.badgeEyebrow}>Step {num}</span>
              <span className={styles.badgeLabel}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
