import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import { trackEvent } from '../utils/analytics'
import styles from './Troubleshoot.module.css'

const GUIDES = [
  {
    slug: 'furnace-blowing-cold-air',
    title: 'Why Is My Furnace Blowing Cold Air?',
    context: 'Burner lights but supply air is cool',
  },
  {
    slug: 'furnace-short-cycling',
    title: 'Why Does My Furnace Keep Turning On and Off?',
    context: 'Short cycling patterns and root causes',
  },
  {
    slug: 'furnace-not-turning-on',
    title: 'Why Is My Furnace Not Turning On?',
    context: 'No ignition, nothing happens',
  },
  {
    slug: 'furnace-leaking-water',
    title: 'Why Is My Furnace Leaking Water?',
    context: 'Water near the furnace on 80% or 90%+',
  },
  {
    slug: 'ac-not-blowing-cold-air',
    title: 'Why Is My AC Not Blowing Cold Air?',
    context: 'Blower runs, air is warm',
  },
  {
    slug: 'furnace-making-strange-noises',
    title: 'Why Is My Furnace Making Strange Noises?',
    context: 'Seven shutdown-worthy noises',
  },
]

export default function Troubleshoot() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`

  const handleGuideClick = (slug) => {
    trackEvent('diagnostic_guide_click', { guide_slug: slug })
  }

  return (
    <>
      <Helmet>
        <title>Troubleshoot — HVAC Diagnostic Tools & Guides | HVAC Sales Master</title>
        <meta name="description" content="Field diagnostic tools and guides for HVAC techs. Symptom router, fault code lookup, and detailed diagnostic articles." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Troubleshoot — HVAC Diagnostic Tools & Guides | HVAC Sales Master" />
        <meta property="og:description" content="Field diagnostic tools and guides for HVAC techs. Symptom router, fault code lookup, and detailed diagnostic articles." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner
        title="Troubleshoot"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Troubleshoot' },
        ]}
      />
      <div className={styles.layout}>
        <main className={styles.main}>
          <p className={styles.pageSubhead}>Field tools and diagnostic guides for working techs.</p>

          <h2 className={styles.sectionH2}>Diagnostic Tools</h2>
          <div className={styles.toolGrid}>
            <Link to="/troubleshoot/symptom" className={styles.card}>
              <p className={styles.cardTitle}>Pick a Symptom</p>
              <p className={styles.cardDesc}>Route from a customer complaint to the right diagnostic flow in two taps.</p>
              <span className={styles.cardCta}>Open tool &rarr;</span>
            </Link>
            <Link to="/troubleshoot/codes" className={styles.card}>
              <p className={styles.cardTitle}>Fault Code Lookup</p>
              <p className={styles.cardDesc}>Decode flash codes and LED patterns — 735 codes across 7 brand families.</p>
              <span className={styles.cardCta}>Open tool &rarr;</span>
            </Link>
          </div>

          <h2 className={styles.sectionH2}>Diagnostic Guides</h2>
          <p className={styles.sectionSubhead}>Detailed field diagnostic articles for common symptoms.</p>
          <div className={styles.guideGrid}>
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                to={`/pro-lessons/${g.slug}`}
                className={styles.tile}
                onClick={() => handleGuideClick(g.slug)}
              >
                <span className={styles.tileLabel}>{g.title}</span>
                <span className={styles.tileContext}>{g.context}</span>
                <span className={styles.tileArrow} aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
