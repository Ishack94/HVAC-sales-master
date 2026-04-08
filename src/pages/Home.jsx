import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import useScrollReveal from '../hooks/useScrollReveal'
import { salesArticles, proArticles } from '../utils/articleData'
import headshotSrc from '../assets/headshot.png'
import styles from './Home.module.css'

const techArticles = proArticles.slice(0, 13)
const homeownerArticles = proArticles.slice(13)

const sidebarLinks = [
  ...salesArticles.slice(0, 2).map((a) => ({ title: a.title, to: `/sales/${a.slug}`, category: 'Sales' })),
  ...techArticles.slice(0, 2).map((a) => ({ title: a.title, to: `/pro-lessons/${a.slug}`, category: 'Pro Lesson' })),
]

export default function Home() {
  useScrollReveal()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setMessage("You're in. Welcome to the community.")
      setEmail('')
    }, 800)
  }

  return (
    <>
      <Banner title="Sell Smarter." subtitle="Master Your Craft." />

      <div className={styles.layout}>
        <main className={styles.main}>

          {/* Author row */}
          <div className={`${styles.authorRow} reveal`}>
            <img src={headshotSrc} alt="HVAC Sales Master founder" className={styles.headshot} />
            <div className={styles.authorText}>
              <p className={styles.authorLabel}>Written by the Founder</p>
              <p className={styles.authorName}>HVAC Sales Master</p>
              <p className={styles.authorBio}>Real-world sales and technical training for HVAC professionals.</p>
            </div>
          </div>

          {/* Body content */}
          <div className={`${styles.body} reveal`}>
            <h2>The Power of Leaving Your Cards in the Van</h2>

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

            <h2>Sales Training</h2>
            <p>These aren't generic sales tips from someone who's never set foot in a crawl space. This is <strong>real-world HVAC sales strategy</strong> — written by people who've actually sat across from homeowners, handled objections, and closed jobs in the field.</p>
            <ul className={styles.articleList}>
              {salesArticles.map((a) => (
                <li key={a.slug}>
                  <Link to={`/sales/${a.slug}`} className={styles.articleLink}><strong>{a.title}</strong></Link>
                  {a.description && <span className={styles.articleDesc}> — {a.description}</span>}
                </li>
              ))}
            </ul>

            <h2>Pro Lessons for Techs &amp; Installers</h2>
            <p>Technical training that goes beyond the textbook. These lessons are written for working technicians who want to diagnose faster, install cleaner, and get fewer callbacks.</p>
            <ul className={styles.articleList}>
              {techArticles.map((a) => (
                <li key={a.slug}>
                  <Link to={`/pro-lessons/${a.slug}`} className={styles.articleLink}><strong>{a.title}</strong></Link>
                  {a.description && <span className={styles.articleDesc}> — {a.description}</span>}
                </li>
              ))}
            </ul>

            <h2>Homeowner Troubleshooting</h2>
            <p>Straightforward answers written by technicians, not content farms. These articles help homeowners understand what's going on so they can make smart decisions — and they help you close more jobs.</p>
            <ul className={styles.articleList}>
              {homeownerArticles.map((a) => (
                <li key={a.slug}>
                  <Link to={`/pro-lessons/${a.slug}`} className={styles.articleLink}><strong>{a.title}</strong></Link>
                  {a.description && <span className={styles.articleDesc}> — {a.description}</span>}
                </li>
              ))}
            </ul>

            <blockquote>The best technicians never stop learning. The best closers never stop either.</blockquote>

            <h2>Who Built This</h2>
            <p>HVAC Sales Master was built by someone who's been in the trades — not a marketing agency, not a content mill. Every article comes from real experience in the field: running service calls, sitting at kitchen tables, handling objections, and training other techs.</p>
            <p><strong>No fluff. Just what actually works.</strong></p>

            <h2>Stay Sharp</h2>
            <p>New articles drop regularly. Subscribe to get them straight to your inbox — no spam, no filler.</p>

            {status === 'success' ? (
              <p className={styles.successMsg}>{message}</p>
            ) : (
              <form className={styles.inlineForm} onSubmit={handleSubmit}>
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
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe →'}
                </button>
              </form>
            )}
          </div>
        </main>

        <Sidebar links={sidebarLinks} />
      </div>
    </>
  )
}
