import React from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import headshotSrc from '../assets/headshot.webp'
import styles from './AboutPage.module.css'

export default function About() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  return (
    <>
      <Helmet>
        <title>About | HVAC Sales Master</title>
        <meta name="description" content="Built from real in-home HVAC sales experience — not a marketing agency. Every article comes from running service calls and closing jobs." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="About | HVAC Sales Master" />
        <meta property="og:description" content="Built from real in-home HVAC sales experience — not a marketing agency. Every article comes from running service calls and closing jobs." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
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
            <img src={headshotSrc} alt="HVAC Sales Master founder" className={styles.headshot} width="80" height="80" />
            <div className={styles.authorText}>
              <p className={styles.authorLabel}>Written from the Field</p>
              <p className={styles.authorName}>Isaac Eells</p>
            </div>
          </div>

          <div className={styles.inner}>
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

            <p>
              One of the best lessons I learned early on: the homeowner who says "I need to think about it" isn't saying no — they're saying you haven't made it easy enough to say yes. That one shift changed everything about how I run calls. It's the kind of thing you won't learn from a YouTube video or a corporate training deck. You learn it by sitting in someone's living room and paying attention.
            </p>

          </div>
        </main>

        <Sidebar />
      </div>
      <Newsletter />
    </>
  )
}
