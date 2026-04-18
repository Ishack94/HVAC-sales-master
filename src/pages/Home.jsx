import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import { salesArticles, proArticles } from '../utils/articleData'
import { trackEvent } from '../utils/analytics'
import MilwaukeeAd from '../components/UI/MilwaukeeAd'
import headshotSrc from '../assets/headshot.webp'
import sectionAccentSales from '../assets/section-accent-sales.webp'
import sectionAccentPro from '../assets/section-accent-pro.webp'
import sectionAccentAbout from '../assets/section-accent-about.webp'
import styles from './Home.module.css'

const FEATURED_SALES_SLUGS = [
  'stop-selling-equipment-start-selling-outcomes',
  'handle-i-need-to-think-about-it',
  'first-90-seconds-at-the-door',
  'maintenance-agreements-predictable-revenue',
]

const FEATURED_PRO_SLUGS = [
  'diagnostic-process-think-like-detective',
  'refrigerant-charging-fundamentals',
  'static-pressure-diagnostics',
  'installation-basics-prevent-callbacks',
]

const techArticles = proArticles.slice(0, 13)

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'sales', label: 'Sales Training' },
  { key: 'pro', label: 'Pro Lessons' },
]

const sidebarLinks = [
  ...salesArticles.slice(0, 2).map((a) => ({ title: a.title, to: `/sales/${a.slug}`, category: 'Sales', color: '#4a9fe5' })),
  ...techArticles.slice(0, 2).map((a) => ({ title: a.title, to: `/pro-lessons/${a.slug}`, category: 'Pro Lesson', color: '#d97706' })),
]

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HVAC Sales Master',
  url: 'https://www.hvacsalesmaster.com',
  description: 'Real-world sales training and technical knowledge for HVAC professionals.',
}

export default function Home() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  const [email, setEmail] = useState('')
  const [messageText, setMessageText] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const searchTimerRef = useRef(null)

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    // localStorage backup so we never lose a signup
    try {
      const stored = JSON.parse(localStorage.getItem('hvac_newsletter_emails') || '[]')
      stored.push(email)
      localStorage.setItem('hvac_newsletter_emails', JSON.stringify(stored))
    } catch (err) {
      console.warn('localStorage unavailable', err)
    }

    try {
      // TODO: Replace mvzdpbqo with your real Formspree form ID from https://formspree.io
      const res = await fetch('https://formspree.io/f/mvzdpbqo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message: messageText }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage("You're in! Watch your inbox.")
        setEmail('')
        setMessageText('')
        trackEvent('newsletter_signup', { method: 'email' })
      } else {
        setStatus('error')
        setMessage('Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')
    }
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearch(val)
    clearTimeout(searchTimerRef.current)
    if (val.trim()) {
      searchTimerRef.current = setTimeout(() => {
        trackEvent('search', { search_term: val.trim() })
      }, 800)
    }
  }

  const handleFilterClick = (cat) => {
    setActiveCategory(cat.key)
    trackEvent('filter_click', { category: cat.label })
  }

  const searchLower = search.toLowerCase()
  const matchesSearch = (a) =>
    !searchLower ||
    a.title.toLowerCase().includes(searchLower) ||
    (a.description && a.description.toLowerCase().includes(searchLower))

  const showSales = activeCategory === 'all' || activeCategory === 'sales'
  const showPro = activeCategory === 'all' || activeCategory === 'pro'

  const filteredSales = useMemo(() => showSales ? salesArticles.filter(matchesSearch) : [], [search, showSales])
  const filteredTech = useMemo(() => showPro ? techArticles.filter(matchesSearch) : [], [search, showPro])

  const isFiltering = search || activeCategory !== 'all'
  const noResults = isFiltering && filteredSales.length === 0 && filteredTech.length === 0

  return (
    <>
      <Helmet>
        <title>HVAC Sales Training & Free Tools | HVAC Sales Master</title>
        <meta name="description" content="Free HVAC sales training, calculators, and troubleshooting tools built from real field experience. No fluff — just what actually works." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="HVAC Sales Training & Free Tools | HVAC Sales Master" />
        <meta property="og:description" content="Free HVAC sales training, calculators, and troubleshooting tools built from real field experience. No fluff — just what actually works." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      <Banner
        title="Free HVAC Tools & Sales Training"
        subtitle="Built for the Field"
        description="Load calculators, duct design, furnace troubleshooting, and real closing strategies — all in one place."
      />

      <div className={styles.layout}>
        <main className={styles.main}>

          {/* Tools section */}
          <div className={styles.toolsSection}>
            <h2 className={styles.toolsHeading}>Tools You'll Actually Use on the Job</h2>
            <p className={styles.toolsSubline}>Built for HVAC techs — not written by marketers.</p>
            <div className={styles.toolsGrid}>
              <Link to="/resources/hvac-load-calculator" className={styles.toolCard}>
                <p className={styles.toolCardTitle}>Load Calculator</p>
                <p className={styles.toolCardDesc}>Estimate heating and cooling loads for residential systems.</p>
              </Link>
              <Link to="/resources/duct-design-calculator" className={styles.toolCard}>
                <p className={styles.toolCardTitle}>Duct Designer</p>
                <p className={styles.toolCardDesc}>Size ductwork using CFM and friction rate.</p>
              </Link>
              <Link to="/troubleshoot" className={styles.toolCard}>
                <p className={styles.toolCardTitle}>Troubleshoot</p>
                <p className={styles.toolCardDesc}>Field tools and diagnostic guides for working techs.</p>
              </Link>
              <Link to="/resources/reverse-duct-calculator" className={styles.toolCard}>
                <p className={styles.toolCardTitle}>Reverse Duct Calculator</p>
                <p className={styles.toolCardDesc}>Work backwards from duct size to find airflow.</p>
              </Link>
            </div>
          </div>

          {/* Author row */}
          <div className={styles.authorRow}>
            <img src={headshotSrc} alt="HVAC Sales Master founder" className={styles.headshot} width="100" height="100" loading="eager" />
            <div className={styles.authorText}>
              <p className={styles.authorName}>Isaac Eells</p>
              <p className={styles.authorTagline}>Real tools and field-tested HVAC strategies.</p>
            </div>
          </div>

          {/* Trust signal */}
          <p className={styles.trustSignal}>46+ articles · 5 free tools · updated weekly</p>

          {/* Search + Filter */}
          <div className={styles.searchArea}>
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Find what you need..."
              className={styles.searchInput}
              aria-label="Search articles"
            />
            <div className={styles.filterPills}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  className={`${styles.pill} ${activeCategory === cat.key ? styles.pillActive : ''}`}
                  onClick={() => handleFilterClick(cat)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* No results */}
          {noResults && (
            <p className={styles.noResults}>No articles found for "{search}".</p>
          )}

          {!isFiltering && <img src={sectionAccentSales} alt="" role="presentation" className={styles.sectionAccent} width="960" height="60" loading="lazy" />}

          {/* Sales Training */}
          {showSales && filteredSales.length > 0 && (
            <div className={`${styles.section} ${styles.sectionWhite} reveal`}>
              <h2 className={styles.sectionH2}>Sales Training</h2>
              {!isFiltering && <p>These aren't generic sales tips from someone who's never set foot in a crawl space. This is <strong>real-world HVAC sales strategy</strong> — built from actual kitchen table experience, real objection handling, and jobs closed in the field.</p>}
              <p className={styles.sectionIntro}>For comfort advisors and salespeople who close in the home.</p>
              <ul className={styles.articleList}>
                {(isFiltering ? filteredSales : salesArticles.filter((a) => FEATURED_SALES_SLUGS.includes(a.slug))).map((a) => (
                  <li key={a.slug}>
                    <Link
                      to={`/sales/${a.slug}`}
                      className={styles.articleLink}
                      onClick={() => trackEvent('article_click', { article_title: a.title, source: 'homepage' })}
                    >
                      <strong>{a.title}</strong>
                    </Link>
                    <span className={styles.articleDate}>Published April 2026</span>{a.description && <span className={styles.articleDesc}> — {a.description}</span>}
                  </li>
                ))}
              </ul>
              {!isFiltering && (
                <Link to="/sales" className={styles.viewAllLink}>View All Sales Training →</Link>
              )}
            </div>
          )}


          {!isFiltering && <img src={sectionAccentPro} alt="" role="presentation" className={styles.sectionAccent} width="960" height="60" loading="lazy" />}

          {/* Pro Lessons */}
          {showPro && filteredTech.length > 0 && (
            <div className={`${styles.section} ${styles.sectionBlueGray} reveal`}>
              <h2 className={styles.sectionH2}>Pro Lessons for Techs &amp; Installers</h2>
              {!isFiltering && <p>Technical training that goes beyond the textbook. These lessons are written for working technicians who want to diagnose faster, install cleaner, and get fewer callbacks.</p>}
              <p className={styles.sectionIntro}>For service technicians and installers.</p>
              <ul className={styles.articleList}>
                {(isFiltering ? filteredTech : techArticles.filter((a) => FEATURED_PRO_SLUGS.includes(a.slug))).map((a) => (
                  <li key={a.slug}>
                    <Link
                      to={`/pro-lessons/${a.slug}`}
                      className={styles.articleLink}
                      onClick={() => trackEvent('article_click', { article_title: a.title, source: 'homepage' })}
                    >
                      <strong>{a.title}</strong>
                    </Link>
                    <span className={styles.articleDate}>Published April 2026</span>{a.description && <span className={styles.articleDesc}> — {a.description}</span>}
                  </li>
                ))}
              </ul>
              {!isFiltering && (
                <Link to="/pro-lessons" className={styles.viewAllLink}>View All Pro Lessons →</Link>
              )}
            </div>
          )}

          {!isFiltering && <img src={sectionAccentAbout} alt="" role="presentation" className={styles.sectionAccent} width="960" height="60" loading="lazy" />}

          {/* Closing content — only when not filtering */}
          {!isFiltering && (
            <div className={`${styles.body} ${styles.noDropCap} reveal`}>
              <h2>Who Built This</h2>
              <p>HVAC Sales Master was built by a 13-year trades professional — not a marketing agency, not a content mill. Every tool is built on real industry standards, and every article draws from actual field experience and proven sales methods.</p>
              <p><strong>No fluff. Just what actually works.</strong></p>

              <MilwaukeeAd className={styles.milwaukeeAd} />

              <h2>Got a question? A funny story? A win from the field?</h2>
              <p>Drop your email and share what's on your mind. Best questions become articles.</p>

              {status === 'success' ? (
                <p className={styles.successMsg}>{message}</p>
              ) : (
                <form className={styles.inlineForm} onSubmit={handleSubmit}>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="What's your question, story, or suggestion?"
                    className={styles.inlineTextarea}
                    rows={3}
                    aria-label="Your message"
                  />
                  <div className={styles.inlineRow}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className={styles.inlineInput}
                      required
                      aria-label="Email address"
                    />
                    <button type="submit" className={styles.inlineBtn} disabled={status === 'loading'}>
                      {status === 'loading' ? 'Sending...' : 'Send It →'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </main>

        <Sidebar variant="home" links={sidebarLinks} />
      </div>
    </>
  )
}
