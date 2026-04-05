import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Newsletter from '../components/Home/Newsletter'
import { getArticleTitle, salesArticles, proArticles, learnArticles } from '../utils/articleData'
import { articleContent } from '../utils/articleContent'
import styles from './ArticlePage.module.css'

const allArticles = [...salesArticles, ...proArticles, ...learnArticles]

function getArticleMeta(slug) {
  return allArticles.find((a) => a.slug === slug) || null
}

// Renders article content.
// HTML strings (articles 1–3) go through dangerouslySetInnerHTML.
// Text-format strings (articles 4+) are parsed: ## → h2, - lines → ul, else → p.
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
    'pro-lessons': 'Tech & Installer Pro Lessons',
    learn: 'Homeowner Guide',
  }[section] || section

  const title = getArticleTitle(slug)
  const meta = getArticleMeta(slug)
  const content = articleContent[slug] || null

  return (
    <>
      <article className={styles.article}>
        <div className={styles.breadcrumb}>
          <Link to={`/${section}`} className={styles.breadcrumbLink}>{sectionLabel}</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{title}</span>
        </div>

        <header className={styles.header}>
          <span className={styles.category}>{sectionLabel}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.meta}>
            {meta?.readTime && <span className={styles.readTime}>{meta.readTime} read</span>}
          </p>
        </header>

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
      </article>
      <Newsletter />
    </>
  )
}
