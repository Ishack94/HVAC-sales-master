import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import { salesArticles, proArticles } from '../utils/articleData'
import salesHero from '../assets/sales-hero.webp'
import styles from './ListingPage.module.css'

const sidebarLinks = proArticles.slice(0, 3).map((a) => ({
  title: a.title,
  to: `/pro-lessons/${a.slug}`,
  category: 'Pro Lesson',
}))

export default function SalesIndex() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  return (
    <>
      <Banner
        title="Sales Training"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Sales Training' },
        ]}
      />

      <div className={styles.layout}>
        <main className={styles.main}>
          <div className={styles.body}>
            <p className={styles.intro}>
              These aren't generic sales tips from someone who's never set foot in a crawl space. This is <strong>real-world HVAC sales strategy</strong> — built from actual kitchen table experience, real objection handling, and jobs closed in the field.
            </p>
            <div className={styles.photoStrip}>
              <img src={salesHero} alt="HVAC proposal sheets on a kitchen table during an in-home consultation" className={styles.photoStripImg} width="960" height="200" />
            </div>
            <ul className={styles.articleList}>
              {salesArticles.map((a) => (
                <li key={a.slug} className={styles.articleItem}>
                  <Link to={`/sales/${a.slug}`} className={styles.articleTitle}>{a.title}</Link>
                  {a.readTime && <span className={styles.readTime}>{a.readTime} read</span>}
                  {a.description && <p className={styles.articleDesc}>{a.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        </main>

        <Sidebar links={sidebarLinks} />
      </div>

      <Newsletter />
    </>
  )
}
