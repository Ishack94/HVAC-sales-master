import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { Link } from 'react-router-dom'
import PageShell from '../../../../../_shared/PageShell'
import FaultCodeResult from '../../../../../../src/pages/FaultCodeResult'
import { getBrandFamily } from '../../../../../../src/data/fault-codes/loader'

function findByCodeSlug(family, platformId, codeSlug) {
  if (!family || !family.platforms) return null
  const platform = family.platforms.find((p) => p.platform_id === platformId)
  if (!platform) return null
  // Strip optional "code-" prefix from URL slug, then match against slugified code_id
  const target = String(codeSlug).toLowerCase()
  const code = platform.codes.find((c) => {
    const slug = String(c.code_id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    return slug === target
  })
  return code ? { family, platform, code } : null
}

export default function Page() {
  const pageContext = usePageContext()
  const { brand, platform: platformId, code: codeSlug } = pageContext?.routeParams || {}

  const family = getBrandFamily(brand)
  const result = findByCodeSlug(family, platformId, codeSlug)

  if (!result) {
    return (
      <PageShell>
        <div style={{ maxWidth: 640, margin: '60px auto', padding: '40px 20px', fontFamily: "'Figtree', sans-serif", textAlign: 'center' }}>
          <h1>Fault code not found</h1>
          <p>That fault code URL doesn't match a known platform/code.</p>
          <Link to="/troubleshoot/codes" style={{ color: '#4a9fe5', fontWeight: 600 }}>← Back to fault code lookup</Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <FaultCodeResult family={result.family} platform={result.platform} code={result.code} />
    </PageShell>
  )
}
