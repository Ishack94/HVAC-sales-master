import React from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import TroubleshootEngine from '../components/Tools/TroubleshootEngine'
import styles from './Troubleshoot.module.css'

export default function Troubleshoot() {
  const location = useLocation()
  const canonicalUrl = `https://hvac-sales-master.vercel.app${location.pathname}`

  return (
    <>
      <Helmet>
        <title>HVAC Troubleshooter — Free Furnace Diagnostic Tool | HVAC Sales Master</title>
        <meta name="description" content="Free interactive furnace troubleshooting tool. Diagnose no heat, short cycling, ignition failure, and more. Step-by-step guidance for 80% and 90%+ efficiency furnaces." />
        <link rel="canonical" href={canonicalUrl} />
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
          <p className={styles.intro}>
            Walk through a guided diagnostic — one question at a time. Pick your furnace type, describe the problem, and we'll help you narrow it down.
          </p>
          <TroubleshootEngine />
        </main>
        <Sidebar />
      </div>
    </>
  )
}
