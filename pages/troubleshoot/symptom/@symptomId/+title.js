import symptomFlows from '../../../../src/data/symptom-flows.json'

export default function title(pageContext) {
  const id = pageContext?.routeParams?.symptomId
  const data = symptomFlows.find((s) => s.symptom_id === id)
  if (!data) return 'Symptom not found | HVAC Sales Master'
  return `${data.tile_label} — HVAC Diagnostic Quick Reference | HVAC Sales Master`
}
