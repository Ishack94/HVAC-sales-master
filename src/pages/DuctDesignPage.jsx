import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import DuctDesigner from '../components/Tools/DuctDesigner'
import styles from './ToolPage.module.css'

export default function DuctDesignPage() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  return (
    <>
      <Helmet>
        <title>Duct Design Calculator — Size Supply and Return Ductwork | HVAC Sales Master</title>
        <meta name="description" content="Free duct design calculator. Size supply and return ductwork for any house based on system tonnage and room layout." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Duct Design Calculator — Size Supply and Return Ductwork | HVAC Sales Master" />
        <meta property="og:description" content="Free duct design calculator. Size supply and return ductwork for any house based on system tonnage and room layout." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner title="Duct Design Calculator" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources', to: '/resources' }, { label: 'Duct Design' }]} />
      <div className={styles.layout}>
        <main className={styles.main}>
          <Link to="/resources" className={styles.backLink}>← Back to Resources</Link>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: '15px', color: '#5a6068', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic' }}>Size your supply and return ductwork based on room-by-room CFM requirements. Use this after running a load calculation to make sure the duct system can actually deliver the airflow the equipment needs.</p>
          <DuctDesigner />
          <p style={{ fontSize: '13px', color: '#8a8f96', marginTop: '16px' }}>Sizing follows Manual D friction rate methodology. Actual installations should account for fitting equivalent lengths and total external static pressure.</p>
          <Link to="/resources/superheat-subcooling-calculator" style={{ fontFamily: "'Figtree', sans-serif", fontSize: '15px', fontWeight: 600, color: '#4a9fe5', textDecoration: 'none', marginTop: '12px', display: 'inline-block' }}>Next: Check your refrigerant charge →</Link>
        </main>
        <Sidebar />
      </div>
    </>
  )
}
