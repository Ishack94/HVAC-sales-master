import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import { salesArticles, proArticles } from '../utils/articleData'
import styles from './ListingPage.module.css'

const sidebarLinks = proArticles.slice(0, 3).map((a) => ({
  title: a.title,
  to: `/pro-lessons/${a.slug}`,
  category: 'Pro Lesson',
}))

export default function SalesIndex() {
  const location = useLocation()
  const canonicalUrl = `https://hvac-sales-master.vercel.app${location.pathname}`
  return (
    <>
      <Helmet>
        <title>Sales Training | HVAC Sales Master</title>
        <meta name="description" content="Real-world HVAC sales training for comfort advisors and salespeople who close in the home. No theory — just what actually works." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
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
              These aren't generic sales tips from someone who's never set foot in a crawl space. This is <strong>real-world HVAC sales strategy</strong> — written by people who've actually sat across from homeowners, handled objections, and closed jobs in the field.
            </p>

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
