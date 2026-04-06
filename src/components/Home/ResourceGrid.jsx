import React from 'react'
import { useEffect, useRef } from 'react'
import SectionLabel from '../UI/SectionLabel'
import Badge from '../UI/Badge'
import useFadeIn from '../../utils/useFadeIn'
import styles from './ResourceGrid.module.css'

const resources = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
    title: 'HVAC Load Calculators',
    desc: 'Manual J and equipment sizing tools for accurate load calculations on every job.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Training Platforms',
    desc: 'The best online platforms for HVAC certification prep and continuing education.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Manufacturer Resources',
    desc: 'Direct links to technical documentation, spec sheets, and warranty registration.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Industry Associations',
    desc: 'ACCA, AHRI, ASHRAE, and RSES — your professional home in the HVAC industry.',
  },
]

export default function ResourceGrid() {
  const ref = useRef(null)
  useFadeIn(ref)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 80)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={`${styles.section} fade-section`} ref={ref}>
      <div className={styles.container}>
        <div className={styles.header} data-reveal>
          <SectionLabel>Industry Resources</SectionLabel>
          <h2 className={styles.title}>Tools We Recommend</h2>
          <p className={styles.subtitle}>
            Vetted resources from across the industry — curated for professionals who take their craft seriously.
          </p>
        </div>
        <div className={styles.grid}>
          {resources.map(({ icon, title, desc }, i) => (
            <div key={title} className={`${styles.card} reveal`} data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className={styles.iconWrap}>{icon}</div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.desc}>{desc}</p>
              <div className={styles.badgeWrap}>
                <Badge variant="comingSoon">Coming Soon</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
