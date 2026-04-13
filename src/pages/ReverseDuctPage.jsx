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
          <ReverseDuct />
        </main>
        <Sidebar />
      </div>
    </>
  )
}
