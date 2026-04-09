import React from 'react'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import headshotSrc from '../assets/headshot.png'
import styles from './AboutPage.module.css'

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | HVAC Sales Master</title>
        <meta name="description" content="HVAC Sales Master exists to close the gap between field experience and business success. Real training written from the inside." />
      </Helmet>
      <Banner
        title="About HVAC Sales Master"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'About' },
        ]}
      />
      <div className={styles.layout}>
        <main className={styles.main}>
          <div className={styles.authorRow}>
            <img src={headshotSrc} alt="HVAC Sales Master founder" className={styles.headshot} />
            <div className={styles.authorText}>
              <p className={styles.authorLabel}>Written by the Founder</p>
              <p className={styles.authorName}>HVAC Sales Master</p>
              <p className={styles.authorBio}>Built from real in-home HVAC sales experience — not a marketing agency.</p>
            </div>
          </div>

          <div className={styles.inner}>
            <p>
              I built this site because I was tired of generic sales advice from people who've never knocked on a homeowner's door.
            </p>
            <p>
              After years running service calls and sitting at kitchen tables closing jobs, I started keeping notes on what actually worked — what objections came up, what responses landed, what made homeowners trust me enough to say yes. That turned into this site.
            </p>
            <p>
              HVAC Sales Master covers two sides of the business: <strong>Sales Training</strong> for comfort advisors who want to close more jobs without feeling pushy, and <strong>Pro Lessons</strong> for technicians and installers who want to sharpen their skills and stop getting callbacks.
            </p>
            <p>
              There's also homeowner content that ranks in search and brings qualified leads to your door — because an informed homeowner is easier to close.
            </p>
            <p>
              Everything here is free. No courses, no upsells, no paywall. Just the real playbook.
            </p>

            <h2 className={styles.h2}>What You'll Find Here</h2>

            <p>
              <strong>Sales Training.</strong> The in-home playbook — how to open the call, walk the house, present options, handle objections, and close without ever feeling like a pushy salesperson. Every article is written from the seat across the kitchen table.
            </p>
            <p>
              <strong>Pro Lessons for Techs &amp; Installers.</strong> Diagnostics, charging, electrical, airflow, and the field-tested habits that separate the techs who get callbacks from the ones who don't. Written for working technicians, not classroom students.
            </p>
            <p>
              <strong>Homeowner Troubleshooting.</strong> Plain-language answers that help homeowners understand what's going on with their system. They rank in search, they earn trust, and they make the sales call easier when you walk in the door.
            </p>

            <p><strong>No fluff. Just what actually works.</strong></p>

            <p className={styles.closing}>
              Got a question or want to share a win from the field? <a href="mailto:contact@hvacsalesmaster.com" className={styles.mailto}>I'd love to hear it.</a>
            </p>
          </div>
        </main>

        <Sidebar />
      </div>
      <Newsletter />
    </>
  )
}
