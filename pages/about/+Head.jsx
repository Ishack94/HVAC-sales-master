import React from 'react'

const SITE = 'https://www.hvacsalesmaster.com'
const TITLE = 'About | HVAC Sales Master'
const DESC = 'Built from real in-home HVAC sales experience — not a marketing agency. Every article comes from running service calls and closing jobs.'

export default function Head() {
  const canonicalUrl = SITE + '/about'
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
    </>
  )
}
