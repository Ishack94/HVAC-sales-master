import React, { useState } from 'react'
import styles from './Newsletter.module.css'
import { trackEvent } from '../../utils/analytics'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    // localStorage backup so we never lose a signup
    try {
      const stored = JSON.parse(localStorage.getItem('hvac_newsletter_emails') || '[]')
      stored.push(email)
      localStorage.setItem('hvac_newsletter_emails', JSON.stringify(stored))
    } catch (err) {
      console.warn('localStorage unavailable', err)
    }

    try {
      // TODO: Replace xyzgobdl with your real Formspree form ID from https://formspree.io
      const res = await fetch('https://formspree.io/f/xyzgobdl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage("You're in! Watch your inbox.")
        setEmail('')
        trackEvent('newsletter_signup', { method: 'email' })
      } else {
        setStatus('error')
        setMessage('Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Get Better at HVAC Sales Every Week</h2>
        <p className={styles.subtitle}>
          Real strategies from the field. No fluff. No spam.
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
              {status === 'loading' ? 'Subscribing...' : 'Get Weekly Tips →'}
            </button>
          </form>
        )}
        {status === 'error' && <p className={styles.error}>{message}</p>}
      </div>
    </section>
  )
}
