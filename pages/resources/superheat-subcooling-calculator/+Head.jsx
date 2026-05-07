import React from 'react'

const SITE = 'https://www.hvacsalesmaster.com'
const TITLE = 'Superheat & Subcooling Calculator — Verify Refrigerant Charge | HVAC Sales Master'
const DESC = 'Free superheat and subcooling calculator. Check if the system is properly charged with accurate refrigerant calculations.'

export default function Head() {
  const canonicalUrl = SITE + '/resources/superheat-subcooling-calculator'
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
