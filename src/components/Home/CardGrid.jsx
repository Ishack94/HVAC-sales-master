import React from 'react'
import { useEffect, useRef } from 'react'
import SectionLabel from '../UI/SectionLabel'
import Card from './Card'
import Button from '../UI/Button'
import styles from './CardGrid.module.css'

export default function CardGrid({ id, label, title, subtitle, cards, theme, viewAllTo, bg }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 100)
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
    <section
      id={id}
      className={`${styles.section} ${bg === 'cream' ? styles.cream : ''}`}
      ref={ref}
    >
      <div className={styles.container}>
        <div className={styles.header} data-reveal>
          <SectionLabel>{label}</SectionLabel>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.grid}>
          {cards.map((card, i) => (
            <div key={card.to} className="reveal" data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
              <Card {...card} theme={theme} />
            </div>
          ))}
        </div>
        {viewAllTo && (
          <div className={styles.cta}>
            <Button to={viewAllTo} variant="secondary">View All Articles</Button>
          </div>
        )}
      </div>
    </section>
  )
}
