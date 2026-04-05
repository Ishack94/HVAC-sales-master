import styles from './DividerQuote.module.css'

export default function DividerQuote({ quote }) {
  return (
    <div className={styles.divider}>
      <div className={styles.container}>
        <span className={styles.mark}>&ldquo;</span>
        <blockquote className={styles.quote}>{quote}</blockquote>
        <span className={styles.mark}>&rdquo;</span>
      </div>
    </div>
  )
}
