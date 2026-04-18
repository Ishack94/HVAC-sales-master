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
              <p className={styles.authorName}>Isaac Eells</p>
              <p className={styles.authorTagline}>Free HVAC tools and sales training. No courses. No paywalls. No recycled scripts.</p>
            </div>
          </div>

          <div className={styles.inner}>
            <p>I'm an electrician. 13 years in the trades, a lot of that work on HVAC-adjacent systems — building automation, rooftop unit controls, pneumatic systems, actuators, air sensors, PLCs, motor controls on commercial buildings, schools, and a casino. I've wired custom homes, data centers, microchip plants, airports, and a water treatment plant. Today I'm the sole electrician on a 600,000 square foot facility. Formally: Supervising Electrician (Oregon), Master Electrician (Washington), Oregon Electrical Inspector.</p>
            <p>I'm not a 20-year HVAC veteran, and I'm not going to pretend to be. My lane is systems — how HVAC actually behaves in real buildings, where things either work or they don't, and where bad design, poor airflow, and shortcuts show up fast. That's the perspective this site is built on. I've done about 8 months of direct residential HVAC work, hold EPA 608 Universal, and completed formal HVAC training through Interplay Learning covering system components, diagnostics, and installation.</p>

            <h2 className={styles.h2}>Why I Built This</h2>

            <p>I couldn't find what I was looking for. Every HVAC sales resource was either a $500 course selling recycled scripts, a corporate training deck that nobody actually uses in the field, or a blog written by a marketing company that's never been inside a mechanical room.</p>
            <p>So I built what I wanted to exist: free calculators grounded in real engineering, and sales frameworks built from breaking down how top in-home HVAC closers actually run calls — what the first ninety seconds look like, how objections get handled, how a service call becomes an install.</p>
            <p>Every calculator on this site is built on real standards — Manual J for loads, Manual D for duct sizing, standard refrigerant data for superheat and subcooling. The sales content focuses on what actually moves deals in the home: handling "I need to think about it," converting a service call into a sale, selling against price objections, and the first ninety seconds at the door.</p>
            <p>No fluff. No paywall. No courses to sell.</p>

            <h2 className={styles.h2}>Where to start</h2>

            <p>If you're here to sell better, start with the Sales articles. If you're wrenching, Pro Lessons is the technical side. If you're a homeowner trying to figure out why something isn't working, try the Troubleshooter before you call.</p>

            <p className={styles.closing}>When I'm not working on systems, you'll probably find me playing banjo somewhere in Oregon.</p>
          </div>
        </main>

        <Sidebar />
      </div>
      <Newsletter />
    </>
  )
}
