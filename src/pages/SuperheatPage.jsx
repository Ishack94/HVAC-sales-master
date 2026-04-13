import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import SuperheatCalc from '../components/Tools/SuperheatCalc'
import styles from './ToolPage.module.css'

export default function SuperheatPage() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  return (
    <>
      <Helmet>
        <title>Superheat &amp; Subcooling Calculator — Verify Refrigerant Charge | HVAC Sales Master</title>
        <meta name="description" content="Free superheat and subcooling calculator. Check if the system is properly charged with accurate refrigerant calculations." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Superheat & Subcooling Calculator — Verify Refrigerant Charge | HVAC Sales Master" />
        <meta property="og:description" content="Free superheat and subcooling calculator. Check if the system is properly charged with accurate refrigerant calculations." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner title="Superheat & Subcooling Calculator" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources', to: '/resources' }, { label: 'Superheat & Subcooling' }]} />
      <div className={styles.layout}>
        <main className={styles.main}>
          <Link to="/resources" className={styles.backLink}>← Back to Resources</Link>
          <SuperheatCalc />
        </main>
        <Sidebar />
      </div>
    </>
  )
}
