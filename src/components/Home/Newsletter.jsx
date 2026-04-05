import React from 'react'
import { useState } from 'react'
import styles from './Newsletter.module.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    // Supabase will be wired up in next phase
    // For now, simulate success
    setTimeout(() => {
      setStatus('success')
      setMessage('You\'re in. Welcome to the community.')
      setEmail('')
    }, 800)
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.label}>Stay Sharp</p>
        <h2 className={styles.heading}>Stay Sharp</h2>
        <p className={styles.subtitle}>
          One email a week. Sales tips, tech shortcuts, and real talk about making more money in HVAC.
        </p>

        {status === 'success' ? (
          <p className={styles.successMsg}>{message}</p>
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
            <button
              type="submit"
              className={styles.btn}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && <p className={styles.errorMsg}>{message}</p>}
      </div>
    </section>
  )
}
