import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import PageShell from '../../_shared/PageShell'
import ArticlePage from '../../../src/pages/ArticlePage'

export default function Page() {
  const pageContext = usePageContext()
  const slug = pageContext?.routeParams?.slug
  return (
    <PageShell>
      <ArticlePage slug={slug} section="sales" />
    </PageShell>
  )
}
