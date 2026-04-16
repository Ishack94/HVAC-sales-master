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
              <p className={styles.authorTagline}>Real tools and field-tested HVAC strategies.</p>
            </div>
          </div>

          <div className={styles.inner}>
            <p>I'm a Supervising Electrician in Oregon and Master Electrician in Washington with 13 years in the trades. I've wired everything from custom homes to data centers, microchip plants, airports, casinos, and a water treatment plant. Right now I'm the sole electrician responsible for a 600,000 square foot facility.</p>
            <p>A lot of my career has crossed into HVAC territory — building automation, rooftop unit controls, actuators, air sensors, pneumatic systems, PLCs, and motor controls on commercial buildings, schools, and a casino. I hold an EPA 608 Universal certification and an Oregon Electrical Inspector certification. I completed formal HVAC training through Interplay Learning covering system components, diagnostics, and installation methods — and I've spent years beyond that studying HVAC system design, airflow, troubleshooting, and the sales side of the business.</p>
            <p>My brother Adam started an HVAC and electrical company a few years back with a veteran HVAC tech who'd been running his own shop for decades. Watching them build that business — and learning from the field experience they brought home every day — is what pulled me deeper into HVAC and eventually led to this site.</p>

            <h2 className={styles.h2}>Why I Built This</h2>

            <p>I couldn't find what I was looking for. Every HVAC sales resource was either a $500 course selling the same recycled scripts, a corporate training deck that nobody actually uses in the field, or a blog written by a marketing company that's never been inside a mechanical room.</p>
            <p>So I built what I wanted to exist: free tools that actually work, real sales strategies grounded in how top closers actually operate in the home, and technical content written for people who understand systems — not students reading a textbook.</p>
            <p>Every calculator on this site is built on real industry standards — Manual J for loads, Manual D for duct sizing, standard refrigerant data for superheat and subcooling. The sales content draws from field-tested methods used by the best HVAC salespeople in the business. No fluff. No paywall. No courses to sell.</p>

            <p className={styles.closing}>When I'm not working on systems, you'll probably find me playing banjo somewhere in Oregon.</p>
          </div>
        </main>

        <Sidebar />
      </div>
      <Newsletter />
    </>
  )
}
