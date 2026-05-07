import React from 'react'

const SITE = 'https://www.hvacsalesmaster.com'
const TITLE = 'HVAC Load Calculator — Free Cooling Load Estimator | HVAC Sales Master'
const DESC = 'Free HVAC load calculator. Estimate cooling load, BTU, tonnage, and airflow for any home.'

export default function Head() {
  const canonicalUrl = SITE + '/resources/hvac-load-calculator'
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESC} />
    </>
  )
}
