import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import EnergySavingsCalc from '../components/Tools/EnergySavingsCalc'
import styles from './ToolPage.module.css'

export default function EnergySavingsPage() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  return (
    <>
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
