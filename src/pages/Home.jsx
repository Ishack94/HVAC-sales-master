import React, { useState, useMemo, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import { salesArticles, proArticles } from '../utils/articleData'
import { trackEvent } from '../utils/analytics'
import MilwaukeeAd from '../components/UI/MilwaukeeAd'
import headshotSrc from '../assets/headshot.png'
import styles from './Home.module.css'

const techArticles = proArticles.slice(0, 13)
const homeownerArticles = proArticles.slice(13)

const startHereArticles = [
  {
    slug: 'stop-selling-equipment-start-selling-outcomes',
    to: '/sales/stop-selling-equipment-start-selling-outcomes',
    title: 'Stop Selling Equipment, Start Selling Outcomes',
    desc: "The homeowner doesn't care about the equipment. They care about comfort, savings, and peace of mind.",
  },
  {
    slug: 'handle-i-need-to-think-about-it',
    to: '/sales/handle-i-need-to-think-about-it',
    title: "How to Handle 'I Need to Think About It'",
    desc: 'The most common objection in HVAC sales and exactly how to respond without being pushy.',
  },
  {
    slug: 'first-90-seconds-at-the-door',
    to: '/sales/first-90-seconds-at-the-door',
    title: 'The First 90 Seconds at the Door',
    desc: 'What happens before you even open your tool bag determines whether you close.',
  },
  {
    slug: 'diagnostic-process-think-like-detective',
    to: '/pro-lessons/diagnostic-process-think-like-detective',
    title: 'The Diagnostic Process: Think Like a Detective',
    desc: 'Stop guessing and start diagnosing systematically on every service call.',
  },
  {
    slug: 'superheat-subcooling-practical-guide',
    to: '/pro-lessons/superheat-subcooling-practical-guide',
    title: 'Superheat and Subcooling Practical Guide',
    desc: 'The hands-on guide to charging by superheat and subcooling in the field.',
  },
]

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'sales', label: 'Sales Training' },
  { key: 'pro', label: 'Pro Lessons' },
  { key: 'homeowner', label: 'Homeowner' },
]

const sidebarLinks = [
  ...salesArticles.slice(0, 2).map((a) => ({ title: a.title, to: `/sales/${a.slug}`, category: 'Sales', color: '#4a9fe5' })),
  ...techArticles.slice(0, 2).map((a) => ({ title: a.title, to: `/pro-lessons/${a.slug}`, category: 'Pro Lesson', color: '#d97706' })),
]

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HVAC Sales Master',
  url: 'https://hvac-sales-master.vercel.app',
  description: 'Real-world sales training and technical knowledge for HVAC professionals.',
}

export default function Home() {
  const location = useLocation()
  const canonicalUrl = `https://hvac-sales-master.vercel.app${location.pathname}`
  const [email, setEmail] = useState('')
  const [messageText, setMessageText] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const searchTimerRef = useRef(null)

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
      // TODO: Replace xyzgobdl with your real Formspree form ID from https://formspree.io
      const res = await fetch('https://formspree.io/f/xyzgobdl', {
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
  const showHomeowner = activeCategory === 'all' || activeCategory === 'homeowner'

  const filteredSales = useMemo(() => showSales ? salesArticles.filter(matchesSearch) : [], [search, showSales])
  const filteredTech = useMemo(() => showPro ? techArticles.filter(matchesSearch) : [], [search, showPro])
  const filteredHomeowner = useMemo(() => showHomeowner ? homeownerArticles.filter(matchesSearch) : [], [search, showHomeowner])

  const isFiltering = search || activeCategory !== 'all'
  const noResults = isFiltering && filteredSales.length === 0 && filteredTech.length === 0 && filteredHomeowner.length === 0

  return (
    <>
      <Helmet>
        <title>HVAC Sales Master — Sell Smarter. Master Your Craft.</title>
        <meta name="description" content="Real-world sales training and technical knowledge for HVAC professionals. Written by people who've actually been in the field." />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      <Banner
        title="Sell Smarter."
        subtitle="Master Your Craft."
      />

      <div className={styles.layout}>
        <main className={styles.main}>

          {/* Author row */}
          <div className={styles.authorRow}>
            <img src={headshotSrc} alt="HVAC Sales Master founder" className={styles.headshot} />
            <div className={styles.authorText}>
              <p className={styles.authorLabel}>Written by the Founder</p>
              <p className={styles.authorName}>HVAC Sales Master</p>
              <p className={styles.authorTagline}>Real in-home sales strategies that actually work.</p>
              <p className={styles.authorTagline}>Built from real HVAC field experience.</p>
            </div>
          </div>

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

          {/* Body content — always visible intro */}
          {!isFiltering && (
            <div className={styles.body}>
              <h2>Why I Leave My Cards in the Van (And Close More Deals Because of It)</h2>

              <p>After I've gone through everything — <strong>explained the options, answered all their questions, handled every concern</strong> — I stop talking. I turn it over to them.</p>

              <p>I'll say something like, <strong>"Do you have any questions, or is there anything I didn't cover that would help you make a decision?"</strong></p>

              <p>Then I just let it sit.</p>

              <p>I'm totally comfortable with the silence. That's usually when they're <strong>actually thinking things through</strong>. Most comfort advisors panic in the quiet and start rambling about features nobody asked about. That's where you lose them.</p>

              <p>If it starts to drag on a bit, I'll give them some space. I'll say, <strong>"Hey, I'm going to run out to my truck and grab my card real quick — take your time looking this over."</strong></p>

              <p>That little break changes everything.</p>

              <p>It gives them a chance to <strong>talk privately, make a quick call, or just think without you hovering</strong>. A lot of times, when I come back in, they're either ready to move forward or they've got a real question to go over — not an excuse to stall.</p>

              <p>The close doesn't happen because you pushed harder. It happens because <strong>you gave them the space to decide</strong>.</p>

              <blockquote>The best closers aren't the ones who talk the most. They're the ones who know when to stop.</blockquote>

              <p>That's the kind of real-world strategy you'll find on this site. Not theory. Not motivational fluff. <strong>Just what actually works when you're sitting across from a homeowner.</strong></p>

              {/* Start Here */}
              <div className={styles.startHere}>
                <h3 className={styles.startHereTitle}>If you're new to HVAC sales, start with these. They'll change how you run calls.</h3>
                <ul className={styles.startHereList}>
                  {startHereArticles.map((a) => (
                    <li key={a.slug} className={styles.startHereItem}>
                      <Link
                        to={a.to}
                        className={styles.startHereLink}
                        onClick={() => trackEvent('start_here_click', { article_title: a.title })}
                      >
                        {a.title}
                      </Link>
                      <span className={styles.startHereDesc}>{a.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* No results */}
          {noResults && (
            <p className={styles.noResults}>No articles found for "{search}".</p>
          )}

          {/* Sales Training */}
          {showSales && filteredSales.length > 0 && (
            <div className={`${styles.section} ${styles.sectionWhite}`}>
              <h2 className={styles.sectionH2}>Sales Training</h2>
              {!isFiltering && <p>These aren't generic sales tips from someone who's never set foot in a crawl space. This is <strong>real-world HVAC sales strategy</strong> — written by people who've actually sat across from homeowners, handled objections, and closed jobs in the field.</p>}
              <p className={styles.sectionIntro}>For comfort advisors and salespeople who close in the home.</p>
              <ul className={styles.articleList}>
                {filteredSales.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to={`/sales/${a.slug}`}
                      className={styles.articleLink}
                      onClick={() => trackEvent('article_click', { article_title: a.title, source: 'homepage' })}
                    >
                      <strong>{a.title}</strong>
                    </Link>
                    {a.description && <span className={styles.articleDesc}> — {a.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pro Lessons */}
          {showPro && filteredTech.length > 0 && (
            <div className={`${styles.section} ${styles.sectionBlueGray}`}>
              <h2 className={styles.sectionH2}>Pro Lessons for Techs &amp; Installers</h2>
              {!isFiltering && <p>Technical training that goes beyond the textbook. These lessons are written for working technicians who want to diagnose faster, install cleaner, and get fewer callbacks.</p>}
              <p className={styles.sectionIntro}>For service technicians and installers.</p>
              <ul className={styles.articleList}>
                {filteredTech.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to={`/pro-lessons/${a.slug}`}
                      className={styles.articleLink}
                      onClick={() => trackEvent('article_click', { article_title: a.title, source: 'homepage' })}
                    >
                      <strong>{a.title}</strong>
                    </Link>
                    {a.description && <span className={styles.articleDesc}> — {a.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Homeowner */}
          {showHomeowner && filteredHomeowner.length > 0 && (
            <div className={`${styles.section} ${styles.sectionWhite}`}>
              <h2 className={styles.sectionH2}>Homeowner Troubleshooting</h2>
              {!isFiltering && <p>Straightforward answers written by technicians, not content farms. These articles help homeowners understand what's going on so they can make smart decisions — and they help you close more jobs.</p>}
              <p className={styles.sectionIntro}>For homeowners trying to understand their system.</p>
              <ul className={styles.articleList}>
                {filteredHomeowner.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to={`/pro-lessons/${a.slug}`}
                      className={styles.articleLink}
                      onClick={() => trackEvent('article_click', { article_title: a.title, source: 'homepage' })}
                    >
                      <strong>{a.title}</strong>
                    </Link>
                    {a.description && <span className={styles.articleDesc}> — {a.description}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Closing content — only when not filtering */}
          {!isFiltering && (
            <div className={`${styles.body} ${styles.noDropCap}`}>
              <blockquote>The best technicians never stop learning. The best closers never stop either.</blockquote>

              <h2>Who Built This</h2>
              <p>HVAC Sales Master was built by someone who's been in the trades — not a marketing agency, not a content mill. Every article comes from real experience in the field: running service calls, sitting at kitchen tables, handling objections, and training other techs.</p>
              <p><strong>No fluff. Just what actually works.</strong></p>

              <MilwaukeeAd className={styles.milwaukeeAd} />

              <h2>Got a question? A story? A win from the field?</h2>
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
