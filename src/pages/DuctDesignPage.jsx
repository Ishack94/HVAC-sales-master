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
          <DuctDesigner />
        </main>
        <Sidebar />
      </div>
    </>
  )
}
