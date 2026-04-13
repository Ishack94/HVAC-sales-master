import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import EnergySavingsCalc from '../components/Tools/EnergySavingsCalc'
import styles from './ToolPage.module.css'

export default function EnergySavingsPage() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  return (
    <>
      <Helmet>
        <title>Energy Savings Calculator — Compare SEER Efficiency Upgrades | HVAC Sales Master</title>
        <meta name="description" content="Free energy savings calculator. Show homeowners how much they will save by upgrading to a higher SEER system." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Energy Savings Calculator — Compare SEER Efficiency Upgrades | HVAC Sales Master" />
        <meta property="og:description" content="Free energy savings calculator. Show homeowners how much they will save by upgrading to a higher SEER system." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner title="Energy Savings Calculator" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources', to: '/resources' }, { label: 'Energy Savings' }]} />
      <div className={styles.layout}>
        <main className={styles.main}>
          <Link to="/resources" className={styles.backLink}>← Back to Resources</Link>
          <EnergySavingsCalc />
        </main>
        <Sidebar />
      </div>
    </>
  )
}
