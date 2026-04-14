import React from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import TroubleshootEngine from '../components/Tools/TroubleshootEngine'
import troubleshootHero from '../assets/troubleshoot-hero.webp'
import styles from './Troubleshoot.module.css'

export default function Troubleshoot() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`

  return (
    <>
      <Helmet>
        <title>HVAC Troubleshooter — Free Furnace Diagnostic Tool | HVAC Sales Master</title>
        <meta name="description" content="Free interactive furnace troubleshooter. Walk through a guided diagnostic to identify your furnace problem step by step." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="HVAC Troubleshooter — Free Furnace Diagnostic Tool | HVAC Sales Master" />
        <meta property="og:description" content="Free interactive furnace troubleshooter. Walk through a guided diagnostic to identify your furnace problem step by step." />
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
          <p className={styles.intro}>
            Walk through a guided diagnostic — one question at a time. Pick your furnace type, describe the problem, and we'll help you narrow it down.
          </p>
          <div className={styles.photoStrip}>
            <img src={troubleshootHero} alt="Residential gas furnace with front panel removed showing burners and components" className={styles.photoStripImg} />
          </div>
          <TroubleshootEngine />
        </main>
        <Sidebar />
      </div>
    </>
  )
}
