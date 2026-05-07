import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import PageShell from '../../../_shared/PageShell'
import SymptomFlow from '../../../../src/pages/SymptomFlow'

export default function Page() {
  const pageContext = usePageContext()
  const symptomId = pageContext?.routeParams?.symptomId
  return (
    <PageShell>
      <SymptomFlow symptomId={symptomId} />
    </PageShell>
  )
}
