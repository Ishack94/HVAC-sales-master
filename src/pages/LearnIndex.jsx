import React from 'react'
import styles from './IndexPage.module.css'
import SectionLabel from '../components/UI/SectionLabel'
import Card from '../components/Home/Card'
import Newsletter from '../components/Home/Newsletter'
import { learnArticles } from '../utils/articleData'

export default function LearnIndex() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <SectionLabel>Homeowner Guide</SectionLabel>
          <h1 className={styles.heading}>HVAC Help for Homeowners</h1>
          <p className={styles.subtitle}>
            Plain-language answers to the most common furnace and AC questions — written by people who actually work on this equipment.
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.gridInner}>
          {learnArticles.map((article) => (
            <Card
              key={article.slug}
              title={article.title}
              excerpt={article.description}
              to={`/learn/${article.slug}`}
              theme="blue"
              category="Homeowner Guide"
            />
          ))}
        </div>
      </div>
      <Newsletter />
    </>
  )
}
