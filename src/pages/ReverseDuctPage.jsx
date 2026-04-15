import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import ReverseDuct from '../components/Tools/ReverseDuct'
import styles from './ToolPage.module.css'

export default function ReverseDuctPage() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  return (
    <>
      <Helmet>
        <title>Reverse Duct Calculator — Check Existing Duct Capacity | HVAC Sales Master</title>
        <meta name="description" content="Free reverse duct calculator. Find out how much airflow your existing ductwork can handle before quoting a new system." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Reverse Duct Calculator — Check Existing Duct Capacity | HVAC Sales Master" />
        <meta property="og:description" content="Free reverse duct calculator. Find out how much airflow your existing ductwork can handle." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner title="Reverse Duct Calculator" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources', to: '/resources' }, { label: 'Reverse Duct' }]} />
      <div className={styles.layout}>
        <main className={styles.main}>
          <Link to="/resources" className={styles.backLink}>← Back to Resources</Link>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: '15px', color: '#5a6068', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic' }}>Already have ductwork in place? Enter the duct size and get the estimated airflow capacity. Use this when evaluating existing systems or checking whether current ductwork can handle a new unit.</p>
          <ReverseDuct />
          <p style={{ fontSize: '13px', color: '#8a8f96', marginTop: '16px' }}>Airflow estimates based on standard friction rate assumptions for residential ductwork.</p>
          <Link to="/resources/hvac-load-calculator" style={{ fontFamily: "'Figtree', sans-serif", fontSize: '15px', fontWeight: 600, color: '#4a9fe5', textDecoration: 'none', marginTop: '12px', display: 'inline-block' }}>Next: Run a load calculation →</Link>
        </main>
        <Sidebar />
      </div>
    </>
  )
}
