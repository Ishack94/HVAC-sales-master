import styles from './SectionLabel.module.css'

export default function SectionLabel({ children, light = false }) {
  return (
    <div className={`${styles.label} ${light ? styles.light : ''}`}>
      <span className={styles.line} />
      <span className={styles.text}>{children}</span>
      <span className={styles.line} />
    </div>
  )
}
