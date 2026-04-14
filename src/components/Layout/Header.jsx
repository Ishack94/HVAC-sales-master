import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoSrc from '../../assets/logo.webp'
import styles from './Header.module.css'
import { trackEvent } from '../../utils/analytics'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Sales', to: '/sales' },
  { label: 'Pro Lessons', to: '/pro-lessons' },
  { label: 'Resources', to: '/resources' },
  { label: 'Troubleshoot', to: '/troubleshoot' },
  { label: 'About', to: '/about' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" className={styles.brand}>
            <img src={logoSrc} alt="HVAC Sales Master" className={styles.logo} width="140" height="40" />
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            {navLinks.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                {label}
              </NavLink>
            ))}
            <a
              href="mailto:contact@hvacsalesmaster.com"
              className={styles.contactBtn}
              onClick={() => trackEvent('contact_click')}
            >
              Contact Us
            </a>
          </nav>

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`${styles.mobileOverlay} ${menuOpen ? styles.open : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <button className={styles.closeBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M2 2L20 20M20 2L2 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        {navLinks.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <a
          href="mailto:contact@hvacsalesmaster.com"
          className={styles.mobileContact}
          onClick={() => { setMenuOpen(false); trackEvent('contact_click') }}
        >
          Contact Us
        </a>
      </nav>
    </>
  )
}
