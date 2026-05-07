import React from 'react'

const SITE = 'https://www.hvacsalesmaster.com'
const TITLE = 'Duct Design Calculator — Size Supply and Return Ductwork | HVAC Sales Master'
const DESC = 'Free duct design calculator. Size supply and return ductwork for any house based on system tonnage and room layout.'

export default function Head() {
  const canonicalUrl = SITE + '/resources/duct-design-calculator'
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
