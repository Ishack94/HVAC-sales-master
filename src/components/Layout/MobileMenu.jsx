import React from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../UI/Logo'
import styles from './MobileMenu.module.css'

export default function MobileMenu({ links, isOpen, onClose }) {
  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className={`${styles.menu} ${isOpen ? styles.open : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <div className={styles.header}>
          <Logo />
          <button className={styles.close} onClick={onClose} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className={styles.links}>
          {links.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                onClick={onClose}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
