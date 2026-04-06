import React from 'react'
import { Link } from 'react-router-dom'
import logoSrc from '../../assets/logo.png'
import styles from './Logo.module.css'

export default function Logo({ height = 40 }) {
  return (
    <Link to="/" className={styles.logo}>
      <img
        src={logoSrc}
        alt="HVAC Sales Master"
        height={height}
        className={styles.img}
      />
    </Link>
  )
}
