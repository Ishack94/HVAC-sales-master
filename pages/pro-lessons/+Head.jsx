import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'

const SITE = 'https://www.hvacsalesmaster.com'

export default function Head() {
  const ctx = usePageContext()
  if (ctx?.urlPathname !== '/pro-lessons') return null

  const url = `${SITE}${ctx.urlPathname}`
  return (
    <>
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}
