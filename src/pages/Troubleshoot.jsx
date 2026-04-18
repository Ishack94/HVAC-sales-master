import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import styles from './Troubleshoot.module.css'

export default function Troubleshoot() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`

  return (
    <>
      <Helmet>
        <title>Diagnostic Tools — HVAC Troubleshooting | HVAC Sales Master</title>
        <meta name="description" content="Field diagnostic tools for HVAC techs. Symptom router, fault code lookup, and more." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Diagnostic Tools — HVAC Troubleshooting | HVAC Sales Master" />
        <meta property="og:description" content="Field diagnostic tools for HVAC techs. Symptom router, fault code lookup, and more." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner
        title="Diagnostic Tools"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Diagnostic Tools' },
        ]}
      />
      <div className={styles.layout}>
        <main className={styles.main}>
          <p className={styles.subhead}>Field tools for working techs. Pick a tool to get started.</p>
          <div className={styles.grid}>
            <Link to="/troubleshoot/symptom" className={styles.card}>
              <p className={styles.cardTitle}>Pick a Symptom</p>
              <p className={styles.cardDesc}>Route from a customer complaint to the right diagnostic flow in two taps.</p>
              <span className={styles.cardCta}>Open tool &rarr;</span>
            </Link>
            <div className={styles.cardDisabled}>
              <p className={styles.cardTitle}>Fault Code Lookup</p>
              <p className={styles.cardDesc}>Decode manufacturer flash codes and LED patterns across major brands.</p>
              <span className={styles.cardCtaDisabled}>Coming soon</span>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
