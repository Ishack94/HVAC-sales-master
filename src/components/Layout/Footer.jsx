import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../UI/Logo'
import styles from './Footer.module.css'

const salesLinks = [
  { label: 'Stop Selling Equipment', to: '/sales/stop-selling-equipment-start-selling-outcomes' },
  { label: 'Handle Objections', to: '/sales/handle-i-need-to-think-about-it' },
  { label: 'Maintenance Agreements', to: '/sales/maintenance-agreements-predictable-revenue' },
  { label: 'View All Articles →', to: '/sales' },
]

const proLinks = [
  { label: 'Diagnostic Process', to: '/pro-lessons/diagnostic-process-think-like-detective' },
  { label: 'Refrigerant Charging', to: '/pro-lessons/refrigerant-charging-fundamentals' },
  { label: 'Static Pressure', to: '/pro-lessons/static-pressure-diagnostics' },
  { label: 'View All Lessons →', to: '/pro-lessons' },
]

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Resources', to: '/resources' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo height={102} />
            <p className={styles.tagline}>
              Real-world sales and technical training for HVAC pros.
            </p>
            <div className={styles.social}>
              <a href="https://youtube.com" aria-label="YouTube" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                </svg>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.2 4.8 1.7 5 5 .1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.2 3.3-1.7 4.8-5 5-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.2-4.8-1.7-5-5C2.1 15.6 2 15.3 2 12c0-3.2 0-3.6.1-4.8.2-3.3 1.7-4.8 5-5 1.3-.1 1.6-.1 4.9-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
                </svg>
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.9v2.2h3.3l-.5 3.5h-2.8v8.4C19.6 23.1 24 18.1 24 12.1z" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.links}>
            <div className={styles.column}>
              <h3 className={styles.colTitle}>Sales Training</h3>
              <ul>
                {salesLinks.map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className={styles.link}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.column}>
              <h3 className={styles.colTitle}>Pro Lessons</h3>
              <ul>
                {proLinks.map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className={styles.link}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.column}>
              <h3 className={styles.colTitle}>Company</h3>
              <ul>
                {companyLinks.map(({ label, to }) => (
                  <li key={to}>
                    <Link to={to} className={styles.link}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© {year} HVAC Sales Master. All rights reserved.</p>
          <p className={styles.copy}>Built for the industry.</p>
        </div>
      </div>
    </footer>
  )
}
