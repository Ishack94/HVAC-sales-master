import React from 'react'

const SITE = 'https://www.hvacsalesmaster.com'
const TITLE = 'Reverse Duct Calculator — Check Existing Duct Capacity | HVAC Sales Master'
const DESC = 'Free reverse duct calculator. Find out how much airflow your existing ductwork can handle.'

export default function Head() {
  const canonicalUrl = SITE + '/resources/reverse-duct-calculator'
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
