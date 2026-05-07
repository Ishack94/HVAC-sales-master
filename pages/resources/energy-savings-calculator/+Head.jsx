import React from 'react'

const SITE = 'https://www.hvacsalesmaster.com'
const TITLE = 'Energy Savings Calculator — Compare SEER Efficiency Upgrades | HVAC Sales Master'
const DESC = 'Free energy savings calculator. Show homeowners how much they will save by upgrading to a higher SEER system.'

export default function Head() {
  const canonicalUrl = SITE + '/resources/energy-savings-calculator'
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
