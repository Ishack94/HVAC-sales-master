import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Banner.module.css'

export default function Banner({ title, subtitle, breadcrumbs }) {
  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        {breadcrumbs && (
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className={styles.crumbItem}>
                {i > 0 && <span className={styles.sep}>/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className={styles.crumbLink}>{crumb.label}</Link>
                ) : (
                  <span className={styles.crumbCurrent}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {subtitle ? (
          <div className={styles.homeTitle}>
            <span className={styles.line1}>{title}</span>
            <span className={styles.line2}>{subtitle}</span>
          </div>
        ) : (
          <h1 className={styles.title}>{title}</h1>
        )}
      </div>
    </div>
  )
}
