import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'

const SITE = 'https://www.hvacsalesmaster.com'

export default function Head() {
  const ctx = usePageContext()
  // Only emit on the exact tool URL — prevents inheritance into @brand/@platform/@code result pages
  if (ctx?.urlPathname !== '/troubleshoot/codes') return null

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
