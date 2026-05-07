import symptomFlows from '../../../../src/data/symptom-flows.json'

export default async function onBeforePrerenderStart() {
  return symptomFlows.map((s) => `/troubleshoot/symptom/${s.symptom_id}`)
}
