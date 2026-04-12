import React, { useState } from 'react'
import styles from './ExplainBlock.module.css'

export default function ExplainBlock({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!text) return null

  return (
    <div className={styles.block}>
      <div className={styles.accent} />
      <p className={styles.label}>Explain to Customer</p>
      <p className={styles.text}>{text}</p>
      <button type="button" onClick={handleCopy} className={styles.copyBtn}>
        {copied ? 'Copied!' : 'Copy Text'}
      </button>
    </div>
  )
}
