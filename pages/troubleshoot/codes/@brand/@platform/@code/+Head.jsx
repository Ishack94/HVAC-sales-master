import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { getBrandFamily } from '../../../../../../src/data/fault-codes/loader'

const SITE = 'https://www.hvacsalesmaster.com'

function findByCodeSlug(family, platformId, codeSlug) {
  if (!family || !family.platforms) return null
  const platform = family.platforms.find((p) => p.platform_id === platformId)
  if (!platform) return null
  const target = String(codeSlug).toLowerCase()
  const code = platform.codes.find((c) => {
    const slug = String(c.code_id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    return slug === target
  })
  return code ? { family, platform, code } : null
}

export default function Head() {
  const pageContext = usePageContext()
  const { brand, platform, code } = pageContext?.routeParams || {}
  const family = getBrandFamily(brand)
  const result = findByCodeSlug(family, platform, code)
  if (!result) return null

  const shortBrand = result.family.brand_family_name.split(' /')[0]
  const canonicalUrl = `${SITE}/troubleshoot/codes/${brand}/${platform}/${code}`

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${shortBrand} ${result.code.code_identifier} — ${result.code.meaning}`,
    description: result.code.meaning,
    articleSection: 'HVAC Fault Codes',
    about: { '@type': 'Thing', name: `${result.platform.platform_name} fault code ${result.code.code_identifier}` },
    mainEntity: {
      '@type': 'HowTo',
      name: `How to diagnose ${shortBrand} ${result.code.code_identifier}`,
      step: result.code.diagnostic_path.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
    },
    publisher: { '@type': 'Organization', name: 'HVAC Sales Master', url: SITE },
    url: canonicalUrl,
  }

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }} />
    </>
  )
}
