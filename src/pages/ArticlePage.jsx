import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import ReadingProgress from '../components/UI/ReadingProgress'
import { getArticleTitle, salesArticles, proArticles, learnArticles } from '../utils/articleData'
import { articleContent } from '../utils/articleContent'
import styles from './ArticlePage.module.css'

const allArticles = [...salesArticles, ...proArticles, ...learnArticles]

function getArticleMeta(slug) {
  return allArticles.find((a) => a.slug === slug) || null
}

function ArticleBody({ content }) {
  if (!content) return null

  if (content.trim().startsWith('<')) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
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
          return <h2 key={i}>{trimmed.slice(3)}</h2>
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

        return <p key={i}>{trimmed}</p>
      })}
    </>
  )
}

export default function ArticlePage({ section }) {
  const { slug } = useParams()

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
  const related = sectionArticles.filter((a) => a.slug !== slug).slice(0, 3)

  const sidebarLinks = related.map((a) => ({
    title: a.title,
    to: articlePath(a.slug),
    category: categoryLabel,
    color: categoryColor,
  }))

  return (
    <>
      <ReadingProgress />
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
            {meta?.readTime && <span className={styles.readTime}>{meta.readTime} read</span>}
          </div>

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
        </main>

        <Sidebar links={sidebarLinks} />
      </div>

      <Newsletter />
    </>
  )
}
