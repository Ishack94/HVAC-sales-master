import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import { salesArticles, proArticles } from '../utils/articleData'
import atticDuctwork from '../assets/attic-ductwork.webp'
import styles from './ListingPage.module.css'

const techArticles = proArticles.slice(0, 13)
const homeownerArticles = proArticles.slice(13)

const sidebarLinks = salesArticles.slice(0, 3).map((a) => ({
  title: a.title,
  to: `/sales/${a.slug}`,
  category: 'Sales',
}))

export default function ProLessonsIndex() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  return (
    <>
      <Helmet>
        <title>Pro Lessons | HVAC Sales Master</title>
        <meta name="description" content="Technical training for HVAC techs and installers. Refrigerant charging, duct design, static pressure, diagnostics, and more." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Pro Lessons | HVAC Sales Master" />
        <meta property="og:description" content="Technical training for HVAC techs and installers. Refrigerant charging, duct design, static pressure, diagnostics, and more." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner
        title="Pro Lessons"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Pro Lessons' },
        ]}
      />

      <div className={styles.layout}>
        <main className={styles.main}>
          <div className={styles.body}>
            <h2 className={styles.sectionHeading}>Tech &amp; Installer Lessons</h2>
            <p className={styles.intro}>
              Technical training for service technicians and installers who want to diagnose faster, install better, and come back less.
            </p>
            <div className={styles.photoStrip}>
              <img src={atticDuctwork} alt="Attic ductwork on a real job site" className={styles.photoStripImg} />
            </div>
            <ul className={styles.articleList}>
              {techArticles.map((a) => (
                <li key={a.slug} className={styles.articleItem}>
                  <Link to={`/pro-lessons/${a.slug}`} className={styles.articleTitle}>{a.title}</Link>
                  {a.readTime && <span className={styles.readTime}>{a.readTime} read</span>}
                  {a.description && <p className={styles.articleDesc}>{a.description}</p>}
                </li>
              ))}
            </ul>

            <h2 className={styles.sectionHeading}>Homeowner Troubleshooting</h2>
            <p className={styles.intro}>
              Straightforward answers written by technicians, not content farms. These articles help homeowners understand what's happening with their system.
            </p>
            <ul className={styles.articleList}>
              {homeownerArticles.map((a) => (
                <li key={a.slug} className={styles.articleItem}>
                  <Link to={`/pro-lessons/${a.slug}`} className={styles.articleTitle}>{a.title}</Link>
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
