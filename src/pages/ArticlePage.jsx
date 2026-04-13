import React, { useEffect, useMemo } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import ReadingProgress from '../components/UI/ReadingProgress'
import MilwaukeeAd from '../components/UI/MilwaukeeAd'
import headshotSrc from '../assets/headshot.png'
import { getArticleTitle, salesArticles, proArticles, learnArticles } from '../utils/articleData'
import { articleContent } from '../utils/articleContent'
import { trackEvent } from '../utils/analytics'
import styles from './ArticlePage.module.css'

const allArticles = [...salesArticles, ...proArticles, ...learnArticles]

function getArticleMeta(slug) {
  return allArticles.find((a) => a.slug === slug) || null
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function addIdsToHtml(html) {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (match, attrs, text) => {
    const plain = text.replace(/<[^>]+>/g, '')
    const id = slugify(plain)
    if (attrs.includes('id=')) return match
    return `<h2${attrs} id="${id}">${text}</h2>`
  })
}

function ArticleBody({ content }) {
  if (!content) return null

  if (content.trim().startsWith('<')) {
    return <div dangerouslySetInnerHTML={{ __html: addIdsToHtml(content) }} />
  }

  const blocks = content.trim().split(/\n\n+/)

  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim()

        if (trimmed.startsWith('### ')) {
          return <h3 key={i}>{trimmed.slice(4)}</h3>
        }

        if (trimmed.startsWith('## ')) {
          const text = trimmed.slice(3)
          return <h2 key={i} id={slugify(text)}>{text}</h2>
        }

        const lines = trimmed.split('\n')
        if (lines.length > 1 && lines.every((l) => l.trim().startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((line, j) => (
                <li key={j}>{line.trim().slice(2)}</li>
              ))}
            </ul>
          )
        }

        if (trimmed.startsWith('Pro tip:') || trimmed.startsWith('Pro Tip:')) {
          return (
            <p key={i} className={styles.proTip}>
              <strong>{trimmed.slice(0, 8)}</strong>{trimmed.slice(8)}
            </p>
          )
        }

        return <p key={i}>{trimmed}</p>
      })}
    </>
  )
}

function SummaryBox({ content }) {
  if (!content) return null
  // Strip markdown/HTML and take first ~150 chars
  const plain = content
    .replace(/<[^>]+>/g, '')
    .replace(/^#{1,4}\s+.*/gm, '')
    .replace(/^- .*/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (plain.length < 30) return null
  const snippet = plain.slice(0, 150).replace(/\s+\S*$/, '') + '...'
  return (
    <div className={styles.summaryBox}>
      <p className={styles.summaryLabel}>What you'll learn</p>
      <p className={styles.summaryText}>{snippet}</p>
    </div>
  )
}

function TableOfContents({ content }) {
  if (!content) return null

  let headings = []
  if (content.trim().startsWith('<')) {
    const re = /<h2[^>]*>(.*?)<\/h2>/gi
    let m
    while ((m = re.exec(content)) !== null) {
      headings.push(m[1].replace(/<[^>]+>/g, ''))
    }
  } else {
    const blocks = content.trim().split(/\n\n+/)
    headings = blocks
      .map((b) => b.trim())
      .filter((b) => b.startsWith('## '))
      .map((b) => b.slice(3))
  }

  if (headings.length < 2) return null

  return (
    <div className={styles.toc}>
      <p className={styles.tocLabel}>In This Article</p>
      <ul className={styles.tocList}>
        {headings.map((h, i) => (
          <li key={i}>
            <a href={`#${slugify(h)}`} className={styles.tocLink}>{h}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ArticlePage({ section }) {
  const { slug } = useParams()
  const location = useLocation()

  const sectionLabel = {
    sales: 'Sales Training',
    'pro-lessons': 'Pro Lessons',
    learn: 'Homeowner Guide',
  }[section] || section

  const categoryLabel = {
    sales: 'Sales Training',
    'pro-lessons': 'Pro Lesson',
    learn: 'Homeowner Guide',
  }[section] || section

  const articlePath = (s) => section === 'sales' ? `/sales/${s}` : `/pro-lessons/${s}`

  const categoryColor = {
    sales: '#4a9fe5',
    'pro-lessons': '#d97706',
    learn: '#059669',
  }[section] || '#4a9fe5'

  const title = getArticleTitle(slug)
  const meta = getArticleMeta(slug)
  const content = articleContent[slug] || null

  const sectionArticles = section === 'sales' ? salesArticles : proArticles
  const currentIndex = sectionArticles.findIndex((a) => a.slug === slug)
  const prevArticle = currentIndex > 0 ? sectionArticles[currentIndex - 1] : null
  const nextArticle = currentIndex < sectionArticles.length - 1 ? sectionArticles[currentIndex + 1] : null

  const related = sectionArticles.filter((a) => a.slug !== slug).slice(0, 3)

  // Sequential "Related on HVAC Sales Master" — next 3 articles in order (wraps around)
  const relatedInline = useMemo(() => {
    const pool = sectionArticles.filter((a) => a.slug !== slug)
    const start = currentIndex >= 0 ? currentIndex : 0
    const picks = []
    for (let i = 1; picks.length < 3 && i <= pool.length; i++) {
      const idx = (start + i) % sectionArticles.length
      if (sectionArticles[idx] && sectionArticles[idx].slug !== slug) {
        picks.push(sectionArticles[idx])
      }
    }
    return picks
  }, [slug, section])

  // Randomized "Related Topics" — 3 articles from same section, reshuffled per article
  const relatedTopics = useMemo(() => {
    const pool = sectionArticles.filter((a) => a.slug !== slug)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [slug, section])

  const sidebarLinks = related.map((a) => ({
    title: a.title,
    to: articlePath(a.slug),
    category: categoryLabel,
    color: categoryColor,
  }))

  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  const pageUrl = canonicalUrl
  const articleDescription = meta?.description || `${title} — HVAC Sales Master`
  const ogTitle = `${title} | HVAC Sales Master`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: articleDescription,
    author: {
      '@type': 'Person',
      name: 'HVAC Sales Master',
    },
    publisher: {
      '@type': 'Organization',
      name: 'HVAC Sales Master',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.hvacsalesmaster.com/og-image.png',
      },
    },
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    image: 'https://www.hvacsalesmaster.com/og-image.png',
  }

  // Scroll depth tracking
  useEffect(() => {
    const milestones = [25, 50, 75, 100]
    const fired = new Set()
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const percent = Math.round((scrollTop / docHeight) * 100)
      milestones.forEach((m) => {
        if (percent >= m && !fired.has(m)) {
          fired.add(m)
          trackEvent('scroll_depth', { percent: m, article_title: title })
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [slug])

  // Read time tracking
  useEffect(() => {
    const startTime = Date.now()
    const fire = () => {
      const seconds = Math.round((Date.now() - startTime) / 1000)
      trackEvent('time_on_article', { article_title: title, seconds })
    }
    window.addEventListener('beforeunload', fire)
    return () => {
      window.removeEventListener('beforeunload', fire)
      fire()
    }
  }, [slug])

  return (
    <>
      <ReadingProgress />
      <Helmet>
        <title>{title} | HVAC Sales Master</title>
        <meta name="description" content={articleDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={articleDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.hvacsalesmaster.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={articleDescription} />
        <meta name="twitter:image" content="https://www.hvacsalesmaster.com/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>
      <Banner
        title={title}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: sectionLabel, to: `/${section}` },
          { label: title },
        ]}
      />

      <div className={styles.layout}>
        <main className={styles.main}>
          <Link to={`/${section}`} className={styles.backLink}>
            ← Back to {sectionLabel}
          </Link>

          <div className={styles.metaBar}>
            <span
              className={styles.category}
              style={{ color: categoryColor, background: `${categoryColor}1a` }}
            >
              {categoryLabel}
            </span>
            {meta?.readTime && <span className={styles.readTime}>{meta.readTime} read · Updated April 2026</span>}
          </div>

          {content && <SummaryBox content={content} />}
          {content && <TableOfContents content={content} />}

          <div className={styles.body}>
            {content ? (
              <ArticleBody content={content} />
            ) : (
              <p className={styles.placeholder}>
                This article is being prepared. In the meantime, explore more content in the{' '}
                <Link to={`/${section}`} className={styles.link}>{sectionLabel}</Link> section.
              </p>
            )}
          </div>

          {relatedInline.length > 0 && (
            <div className={styles.relatedInline}>
              <p className={styles.relatedInlineLabel}>Related on HVAC Sales Master</p>
              <ul className={styles.relatedInlineList}>
                {relatedInline.map((a) => (
                  <li key={a.slug}>
                    <Link to={articlePath(a.slug)} className={styles.relatedInlineLink}>
                      {a.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <MilwaukeeAd className={styles.milwaukeeAd} />

          {relatedTopics.length > 0 && (
            <div className={styles.relatedTopics}>
              <p className={styles.relatedTopicsLabel}>Related Topics</p>
              <ul className={styles.relatedTopicsList}>
                {relatedTopics.map((a) => (
                  <li key={a.slug}>
                    <Link to={articlePath(a.slug)} className={styles.relatedTopicsLink}>
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className={styles.keepReading}>
              <p className={styles.keepReadingLabel}>Keep Reading</p>
              <div className={styles.keepReadingGrid}>
                {related.map((a) => (
                  <Link key={a.slug} to={articlePath(a.slug)} className={styles.keepReadingItem}>
                    <span className={styles.keepReadingCat} style={{ color: categoryColor }}>{categoryLabel}</span>
                    <span className={styles.keepReadingTitle}>{a.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author box */}
          <div className={styles.authorBox}>
            <img src={headshotSrc} alt="HVAC Sales Master founder" className={styles.authorBoxHeadshot} />
            <div className={styles.authorBoxText}>
              <p className={styles.authorBoxName}>Written by HVAC Sales Master</p>
              <p className={styles.authorBoxBio}>Years of in-home HVAC sales and service experience across residential systems. Every article on this site comes from real field work — not a marketing desk.</p>
            </div>
          </div>

          {(prevArticle || nextArticle) && (
            <div className={styles.prevNext}>
              <div className={styles.prevNextInner}>
                {prevArticle ? (
                  <Link to={articlePath(prevArticle.slug)} className={styles.prevLink}>
                    <span className={styles.prevNextLabel}>← Previous</span>
                    <span className={styles.prevNextTitle}>{prevArticle.title}</span>
                  </Link>
                ) : <div />}
                {nextArticle ? (
                  <Link to={articlePath(nextArticle.slug)} className={styles.nextLink}>
                    <span className={styles.prevNextLabel}>Next →</span>
                    <span className={styles.prevNextTitle}>{nextArticle.title}</span>
                  </Link>
                ) : <div />}
              </div>
            </div>
          )}
        </main>

        <Sidebar links={sidebarLinks} />
      </div>

      <Newsletter />
    </>
  )
}
