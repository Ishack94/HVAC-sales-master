import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import { trackEvent } from '../utils/analytics'
import styles from './SymptomRouter.module.css'

const SYMPTOMS = [
  {
    slug: 'furnace-blowing-cold-air',
    label: 'Cold Air from Furnace',
    context: 'Furnace runs but supply air is cool',
  },
  {
    slug: 'furnace-short-cycling',
    label: 'Short Cycling',
    context: 'Runs briefly, shuts off, repeats',
  },
  {
    slug: 'furnace-not-turning-on',
    label: "Furnace Won't Start",
    context: 'No ignition, no blower, nothing happening',
  },
  {
    slug: 'furnace-leaking-water',
    label: 'Leaking Water',
    context: 'Water on the floor near the furnace',
  },
  {
    slug: 'ac-not-blowing-cold-air',
    label: 'AC Not Cooling',
    context: 'Blower runs, condenser hums, air is warm',
  },
  {
    slug: 'furnace-making-strange-noises',
    label: 'Strange or Dangerous Noise',
    context: 'Boom, scrape, scream, or rumble from the unit',
  },
]

export default function SymptomRouter() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`

  const handleClick = (slug) => {
    trackEvent('symptom_router_click', { symptom_slug: slug })
  }

  return (
    <>
      <Helmet>
        <title>Symptom Router — HVAC Diagnostic Tool | HVAC Sales Master</title>
        <meta name="description" content="Two taps from symptom to diagnostic flow. Pick a complaint, get the field-tested troubleshooting sequence." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Symptom Router — HVAC Diagnostic Tool | HVAC Sales Master" />
        <meta property="og:description" content="Two taps from symptom to diagnostic flow. Pick a complaint, get the field-tested troubleshooting sequence." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner
        title="Pick a Symptom"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Diagnostic Tools', to: '/troubleshoot' },
          { label: 'Symptom Router' },
        ]}
      />
      <div className={styles.layout}>
        <main className={styles.main}>
          <p className={styles.subhead}>Start from the symptom. Read the full diagnostic walkthrough.</p>
          <div className={styles.grid}>
            {SYMPTOMS.map((s) => (
              <Link
                key={s.slug}
                to={`/pro-lessons/${s.slug}`}
                className={styles.tile}
                onClick={() => handleClick(s.slug)}
              >
                <span className={styles.tileLabel}>{s.label}</span>
                <span className={styles.tileContext}>{s.context}</span>
                <span className={styles.tileArrow} aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </div>
          <Link to="/troubleshoot/codes" className={styles.crossLink}>
            <span className={styles.crossLinkTitle}>Got a fault code? Look it up &rarr;</span>
            <span className={styles.crossLinkDesc}>Code on the thermostat or display? Jump to the fault code lookup for 735 codes across 7 brand families.</span>
          </Link>
        </main>
      </div>
    </>
  )
}
