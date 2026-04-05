import { Link } from 'react-router-dom'
import styles from './Card.module.css'

export default function Card({ title, excerpt, to, category, theme = 'blue' }) {
  return (
    <article className={`${styles.card} ${styles[theme]}`}>
      <div className={styles.image} aria-hidden="true" />
      {category && <span className={styles.category}>{category}</span>}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        <Link to={to} className={styles.readMore}>
          Read Article
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
      <span className={styles.accentLine} aria-hidden="true" />
    </article>
  )
}
