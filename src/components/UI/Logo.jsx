import React from 'react'
import { Link } from 'react-router-dom'
import logoSrc from '../../assets/logo.png'
import styles from './Logo.module.css'

export default function Logo({ height = 40, mobileHeight }) {
  const style = {
    '--logo-h': `${height}px`,
    ...(mobileHeight ? { '--logo-h-mobile': `${mobileHeight}px` } : {}),
  }
  return (
    <Link to="/" className={styles.logo}>
      <img
        src={logoSrc}
        alt="HVAC Sales Master"
        className={styles.img}
        style={style}
      />
    </Link>
  )
}
