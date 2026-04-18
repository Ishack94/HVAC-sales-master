import React, { useState, useEffect } from 'react'
import styles from './FeedbackButtons.module.css'

export default function FeedbackButtons({ slug }) {
  const storageKey = `hvac_feedback_${slug}`
  const [submitted, setSubmitted] = useState(false)
  const [animating, setAnimating] = useState(null)

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) setSubmitted(true)
    } catch {}
  }, [storageKey])

  const handleVote = (vote) => {
    setAnimating(vote)
    try { localStorage.setItem(storageKey, vote) } catch {}
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'article_feedback', { article_slug: slug, vote })
    }
    setTimeout(() => setSubmitted(true), 450)
  }

  if (submitted) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.thanks}>Thanks — noted.</p>
      </div>
    )
  }

  return (
    <div className={`${styles.wrapper} ${animating ? styles.fadeOut : ''}`}>
      <p className={styles.label}>Was this helpful?</p>
      <div className={styles.buttons}>
        <button
          type="button"
          className={`${styles.btn} ${animating === 'up' ? styles.active : ''}`}
          onClick={() => handleVote('up')}
          aria-label="Helpful"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h12.5a2 2 0 0 0 2-1.7l1.4-9A2 2 0 0 0 17.9 9H14V4a2 2 0 0 0-2-2h-.1a1 1 0 0 0-.9.6L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          type="button"
          className={`${styles.btn} ${animating === 'down' ? styles.active : ''}`}
          onClick={() => handleVote('down')}
          aria-label="Not helpful"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 2V13M22 11V4a2 2 0 0 0-2-2H7.5a2 2 0 0 0-2 1.7l-1.4 9A2 2 0 0 0 6.1 15H10v5a2 2 0 0 0 2 2h.1a1 1 0 0 0 .9-.6L17 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
