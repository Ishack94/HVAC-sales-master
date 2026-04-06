import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../components/Home/Card'
import Newsletter from '../components/Home/Newsletter'
import { getArticleTitle, salesArticles, proArticles, learnArticles } from '../utils/articleData'
import { articleContent } from '../utils/articleContent'
import styles from './ArticlePage.module.css'

const allArticles = [...salesArticles, ...proArticles, ...learnArticles]

function getArticleMeta(slug) {
  return allArticles.find((a) => a.slug === slug) || null
}

// Renders article content.
// HTML strings go through dangerouslySetInnerHTML.
// Text-format strings are parsed: ## → h2, ### → h3, - lines → ul, else → p.
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

  const cardTheme = section === 'sales' ? 'blue' : 'copper'
  const cardCategory = section === 'sales' ? 'Sales' : 'Pro Lesson'
  const articlePath = (s) => section === 'sales' ? `/sales/${s}` : `/pro-lessons/${s}`

  const title = getArticleTitle(slug)
  const meta = getArticleMeta(slug)
  const content = articleContent[slug] || null

  const sectionArticles = section === 'sales' ? salesArticles : proArticles
  const related = sectionArticles.filter((a) => a.slug !== slug).slice(0, 3)

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <Link to={`/${section}`} className={styles.backLink}>
          ← Back to {sectionLabel}
        </Link>

        {meta?.image && (
          <div className={styles.heroWrap}>
            <img src={meta.image} alt={title} className={styles.heroImg} />
          </div>
        )}

        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.metaBar}>
            <span className={styles.category}>{categoryLabel}</span>
            {meta?.readTime && <span className={styles.readTime}>{meta.readTime} read</span>}
          </div>
          <div className={styles.divider} />
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

      {related.length > 0 && (
        <div className={styles.related}>
          <div className={styles.relatedInner}>
            <h2 className={styles.relatedTitle}>Keep Reading</h2>
            <div className={styles.relatedGrid}>
              {related.map((a) => (
                <Card
                  key={a.slug}
                  title={a.title}
                  excerpt={a.description}
                  to={articlePath(a.slug)}
                  theme={cardTheme}
                  category={cardCategory}
                  image={a.image}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Newsletter />
    </div>
  )
}
