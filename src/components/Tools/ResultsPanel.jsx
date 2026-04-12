import React, { useState } from 'react'
import styles from './ResultsPanel.module.css'

export default function ResultsPanel({
  eyebrow,
  title,
  primaryValue,
  primaryUnit,
  summary,
  metrics = [],
  notes = [],
  customerText,
  actionLabel,
  onAction,
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!customerText) return
    navigator.clipboard.writeText(customerText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.panel}>
      <div className={styles.accent} />

      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      {title && <h4 className={styles.title}>{title}</h4>}

      <div className={styles.primaryRow}>
        <span className={styles.primaryValue}>{primaryValue}</span>
        {primaryUnit && <span className={styles.primaryUnit}>{primaryUnit}</span>}
      </div>

      {summary && <p className={styles.summary}>{summary}</p>}

      {metrics.length > 0 && (
        <div className={styles.metrics}>
          {metrics.map((m, i) => (
            <div key={i} className={styles.metricRow}>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricValue}>
                {m.value}{m.unit && <span className={styles.metricUnit}> {m.unit}</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <div className={styles.notes}>
          {notes.map((n, i) => (
            <p key={i} className={styles.note}>{n}</p>
          ))}
        </div>
      )}

      {customerText && (
        <div className={styles.explain}>
          <p className={styles.explainLabel}>Explain to Customer</p>
          <p className={styles.explainText}>{customerText}</p>
          <button type="button" onClick={handleCopy} className={styles.copyBtn}>
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      )}

      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className={styles.actionBtn}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
