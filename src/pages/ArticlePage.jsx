import { useParams, Link } from 'react-router-dom'
import Newsletter from '../components/Home/Newsletter'
import { getArticleTitle } from '../utils/articleData'
import styles from './ArticlePage.module.css'

export default function ArticlePage({ section }) {
  const { slug } = useParams()

  const sectionLabel = {
    sales: 'Sales Training',
    'pro-lessons': 'Tech & Installer Pro Lessons',
    learn: 'Homeowner Guide',
  }[section] || section

  const title = getArticleTitle(slug)

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
          <p className={styles.meta}>Content is being prepared for this article.</p>
        </header>

        <div className={styles.body}>
          <p>
            This article will be available soon. In the meantime, explore more content in the{' '}
            <Link to={`/${section}`} className={styles.link}>{sectionLabel}</Link> section.
          </p>
        </div>
      </article>
      <Newsletter />
    </>
  )
}
