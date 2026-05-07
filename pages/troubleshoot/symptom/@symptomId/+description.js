import symptomFlows from '../../../../src/data/symptom-flows.json'

function truncate(text, max) {
  if (!text) return ''
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + '…'
}

export default function description(pageContext) {
  const id = pageContext?.routeParams?.symptomId
  const data = symptomFlows.find((s) => s.symptom_id === id)
  if (!data) return ''
  return truncate(data.quick_summary, 155)
}
