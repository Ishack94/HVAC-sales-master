import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Banner from '../components/Layout/Banner'
import { trackEvent } from '../utils/analytics'
import styles from './SymptomRouter.module.css'

const SYMPTOMS = [
  {
    slug: 'cold-air-from-furnace',
    label: 'Cold Air from Furnace',
    context: 'Furnace runs but supply air is cool',
  },
  {
    slug: 'short-cycling',
    label: 'Short Cycling',
    context: 'Runs briefly, shuts off, repeats',
  },
  {
    slug: 'furnace-wont-start',
    label: "Furnace Won't Start",
    context: 'No ignition, no blower, nothing happening',
  },
  {
    slug: 'leaking-water',
    label: 'Leaking Water',
    context: 'Water on the floor near the furnace',
  },
  {
    slug: 'ac-not-cooling',
    label: 'AC Not Cooling',
    context: 'Blower runs, condenser hums, air is warm',
  },
  {
    slug: 'strange-or-dangerous-noise',
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
                to={`/troubleshoot/symptom/${s.slug}`}
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
