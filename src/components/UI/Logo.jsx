import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

export default function Logo({ size = 'default' }) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[size]}`}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        aria-hidden="true"
      >
        {/* Shield — filled, rounded */}
        <path
          d="M50 4 L10 20 L10 52 C10 76 28 96 50 104 C72 96 90 76 90 52 L90 20 Z"
          fill="#3d4f63"
        />

        {/* 5 ascending bars (left to right, taller each) */}
        <rect x="18" y="72" width="9" height="18" rx="1" fill="#ffffff" opacity="0.9" />
        <rect x="30" y="62" width="9" height="28" rx="1" fill="#ffffff" opacity="0.9" />
        <rect x="42" y="52" width="9" height="38" rx="1" fill="#ffffff" opacity="0.9" />
        <rect x="54" y="42" width="9" height="48" rx="1" fill="#ffffff" opacity="0.9" />
        <rect x="66" y="32" width="9" height="58" rx="1" fill="#ffffff" opacity="0.9" />

        {/* Arrow — sweeping from lower-left, curving up and out top-right */}
        <path
          d="M16 78 C22 60, 38 32, 72 8"
          stroke="#e87722"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Arrowhead pointing upper-right */}
        <path
          d="M58 6 L74 6 L74 22"
          stroke="#e87722"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className={styles.text}>
        <span className={styles.hvac}>HVAC</span>
        <span className={styles.sales}>SALES</span>
        <span className={styles.master}>MASTER</span>
      </div>
    </Link>
  )
}
