import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { proArticles } from '../../../src/utils/articleData'

const SITE = 'https://www.hvacsalesmaster.com'

export default function Head() {
  const pageContext = usePageContext()
  const slug = pageContext?.routeParams?.slug
  const article = proArticles.find((a) => a.slug === slug)
  if (!article) return null

  const canonicalUrl = `${SITE}/pro-lessons/${slug}`
  const ogTitle = `${article.title} | HVAC Sales Master`
  const ogImage = `${SITE}/og-image.png`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: { '@type': 'Person', name: 'Isaac E.' },
    publisher: {
      '@type': 'Organization',
      name: 'HVAC Sales Master',
      logo: { '@type': 'ImageObject', url: ogImage },
    },
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    image: ogImage,
  }

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={article.description} />
      <meta name="twitter:image" content={ogImage} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  )
}
