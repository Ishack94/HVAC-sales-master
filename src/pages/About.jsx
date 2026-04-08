import React from 'react'
import Banner from '../components/Layout/Banner'
import Newsletter from '../components/Home/Newsletter'
import styles from './AboutPage.module.css'

export default function About() {
  return (
    <>
      <Banner
        title="About HVAC Sales Master"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'About' },
        ]}
      />
      <div className={styles.page}>
        <div className={styles.inner}>
          <p>
            HVAC Sales Master exists because the gap between field experience and business success shouldn't be a secret. The best technicians and salespeople learn through years of expensive trial and error — we're here to shortcut that.
          </p>
          <p>
            Every article is written from the inside — practical, direct, and grounded in how HVAC businesses actually work. No fluff. No generic advice recycled from other industries. Just the real playbook.
          </p>
          <p>
            We cover two sides of the business: <strong>Sales Training</strong> for comfort advisors and salespeople who want to close more jobs without feeling like a pushy salesperson, and <strong>Tech &amp; Installer Pro Lessons</strong> for technicians and installers who want to sharpen their skills and advance their careers.
          </p>
          <p>
            We also publish homeowner-facing content that ranks in search and drives qualified leads to HVAC businesses — because better-informed homeowners make the sale easier.
          </p>
          <p>
            Everything on this site is free. Always.
          </p>
          <p><strong>No fluff. Just what actually works.</strong></p>
        </div>
      </div>
      <Newsletter />
    </>
  )
}
