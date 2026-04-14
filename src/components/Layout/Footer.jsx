import React from 'react'
import { Link } from 'react-router-dom'
import logoSrc from '../../assets/logo.webp'
import styles from './Footer.module.css'

const salesLinks = [
  { label: 'Stop Selling Equipment', to: '/sales/stop-selling-equipment-start-selling-outcomes' },
  { label: "Handle 'Think About It'", to: '/sales/handle-i-need-to-think-about-it' },
  { label: 'Maintenance Agreements', to: '/sales/maintenance-agreements-predictable-revenue' },
  { label: 'HVAC Sales Script', to: '/sales/hvac-sales-script-word-for-word' },
  { label: 'View All →', to: '/sales' },
]

const proLinks = [
  { label: 'Diagnostic Process', to: '/pro-lessons/diagnostic-process-think-like-detective' },
  { label: 'Refrigerant Charging', to: '/pro-lessons/refrigerant-charging-fundamentals' },
  { label: 'Static Pressure', to: '/pro-lessons/static-pressure-diagnostics' },
  { label: 'Electrical Fundamentals', to: '/pro-lessons/electrical-fundamentals-hvac-techs' },
  { label: 'View All →', to: '/pro-lessons' },
]

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: 'mailto:contact@hvacsalesmaster.com' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <img src={logoSrc} alt="HVAC Sales Master" className={styles.logo} width="140" height="40" />
            <p className={styles.tagline}>
              Real-world sales and technical training for HVAC professionals.
            </p>
          </div>

          <div className={styles.column}>
            <p className={styles.colHead}>Sales Training</p>
            <ul>
              {salesLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <p className={styles.colHead}>Pro Lessons</p>
            <ul>
              {proLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <p className={styles.colHead}>Company</p>
            <ul>
              {companyLinks.map(({ label, to }) => (
                <li key={to}>
                  {to.startsWith('mailto:') ? (
                    <a href={to} className={styles.link}>{label}</a>
                  ) : (
                    <Link to={to} className={styles.link}>{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} HVAC Sales Master. All rights reserved.</p>
          <p className={styles.bottomTagline}>Written by someone actually working in the trade.</p>
        </div>
      </div>
    </footer>
  )
}
