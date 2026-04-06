import React from 'react'
import styles from './IndexPage.module.css'
import SectionLabel from '../components/UI/SectionLabel'
import Card from '../components/Home/Card'
import Newsletter from '../components/Home/Newsletter'
import { salesArticles } from '../utils/articleData'

export default function SalesIndex() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <SectionLabel>Sales & Closing</SectionLabel>
          <h1 className={styles.heading}>Sales & Closing</h1>
          <p className={styles.subtitle}>
            Stuff that actually works when you&apos;re sitting across from a homeowner.
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.gridInner}>
          {salesArticles.map((article) => (
            <Card
              key={article.slug}
              title={article.title}
              excerpt={article.description}
              to={`/sales/${article.slug}`}
              theme="blue"
              category="Sales"
              image={article.image}
            />
          ))}
        </div>
      </div>
      <Newsletter />
    </>
  )
}
