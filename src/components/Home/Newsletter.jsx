import React, { useState } from 'react'
import styles from './Newsletter.module.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setMessage("You're in. Welcome to the community.")
      setEmail('')
    }, 800)
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Stay Sharp</h2>
        <p className={styles.subtitle}>
          Get practical HVAC sales and field tips delivered weekly — written by someone who's actually been in the trades. No spam, no fluff.
        </p>
        {status === 'success' ? (
          <p className={styles.success}>{message}</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className={styles.input}
              required
              aria-label="Email address"
            />
            <button type="submit" className={styles.btn} disabled={status === 'loading'}>
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && <p className={styles.error}>{message}</p>}
      </div>
    </section>
  )
}
