import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import symptomFlows from '../../../../src/data/symptom-flows.json'

const SITE = 'https://www.hvacsalesmaster.com'

export default function Head() {
  const pageContext = usePageContext()
  const id = pageContext?.routeParams?.symptomId
  const data = symptomFlows.find((s) => s.symptom_id === id)
  if (!data) return null

  const canonicalUrl = `${SITE}/troubleshoot/symptom/${id}`

  // og:title / og:description are auto-emitted by vike-react from +title and +description.
  // Only emit head tags vike-react does NOT auto-generate.
  const howToSchema = data.format !== 'noise_triage'
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: data.tile_label,
        description: data.quick_summary,
        step: data.diagnostic_steps.map((s) => ({
          '@type': 'HowToStep',
          position: s.step,
          name: s.action,
          text: s.rationale,
        })),
      }
    : null

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      {howToSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      )}
    </>
  )
}
