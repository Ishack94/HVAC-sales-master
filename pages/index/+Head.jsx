import React from 'react'

const SITE = 'https://www.hvacsalesmaster.com'
const TITLE = 'HVAC Sales Training & Free Tools | HVAC Sales Master'
const DESC = 'Free HVAC sales training, calculators, and troubleshooting tools built from real field experience. No fluff — just what actually works.'

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HVAC Sales Master',
  url: SITE,
  description: 'Real-world sales training and technical knowledge for HVAC professionals.',
}

export default function Head() {
  const canonicalUrl = SITE + '/'
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESC} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  )
}
