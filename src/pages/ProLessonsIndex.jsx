import React from 'react'
import styles from './IndexPage.module.css'
import SectionLabel from '../components/UI/SectionLabel'
import Card from '../components/Home/Card'
import Newsletter from '../components/Home/Newsletter'
import { proArticles } from '../utils/articleData'

export default function ProLessonsIndex() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <SectionLabel>Tech & Installer Pro Lessons</SectionLabel>
          <h1 className={styles.heading}>Sharpen Your Skills</h1>
          <p className={styles.subtitle}>
            Technical training for service technicians and installers who want to diagnose faster, install better, and come back less.
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.gridInner}>
          {proArticles.map((article) => (
            <Card
              key={article.slug}
              title={article.title}
              excerpt={article.description}
              to={`/pro-lessons/${article.slug}`}
              theme="copper"
              category="Pro Lesson"
            />
          ))}
        </div>
      </div>
      <Newsletter />
    </>
  )
}
