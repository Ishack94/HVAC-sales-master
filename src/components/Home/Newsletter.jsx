import React from 'react'
import { useState, useRef } from 'react'
import useFadeIn from '../../utils/useFadeIn'
import SectionLabel from '../UI/SectionLabel'
import styles from './Newsletter.module.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')
  const ref = useRef(null)
  useFadeIn(ref)

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
    <section className={`${styles.section} fade-section`} ref={ref}>
      <div className={styles.container}>
        <SectionLabel>Newsletter</SectionLabel>
        <h2 className={styles.heading}>Stay Sharp</h2>
        <p className={styles.subtitle}>
          New articles, training resources, and industry insights — delivered straight to your inbox. No spam. Unsubscribe anytime.
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
