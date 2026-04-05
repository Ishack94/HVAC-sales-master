import styles from './TrustBar.module.css'

const items = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" />
        <polyline points="9,12 11,14 15,10" />
      </svg>
    ),
    label: 'Industry Proven',
    desc: 'Built by HVAC professionals who live the work every day.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    label: 'Learn Anytime',
    desc: 'On your schedule, at your pace. No signup required.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    label: 'Always Free',
    desc: 'Every article, lesson, and resource — free forever.',
  },
]

export default function TrustBar() {
  return (
    <div className={styles.trustBar}>
      <div className={styles.container}>
        {items.map(({ icon, label, desc }) => (
          <div key={label} className={styles.item}>
            <span className={styles.icon}>{icon}</span>
            <div className={styles.text}>
              <strong className={styles.label}>{label}</strong>
              <p className={styles.desc}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
