import React, { useState } from 'react'
import ResultsPanel from './ResultsPanel'
import { SYMPTOMS, QUESTIONS, SYMPTOM_FIRST_QUESTION, DIAGNOSES } from '../../utils/troubleshootData'
import styles from './TroubleshootEngine.module.css'

export default function TroubleshootEngine() {
  const [phase, setPhase] = useState('equipment')
  const [furnaceType, setFurnaceType] = useState(null)
  const [symptomId, setSymptomId] = useState(null)
  const [currentQId, setCurrentQId] = useState(null)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [history, setHistory] = useState([])

  const reset = () => {
    setPhase('equipment')
    setFurnaceType(null)
    setSymptomId(null)
    setCurrentQId(null)
    setHistory([])
    setFeedbackSent(false)
  }

  const goToSymptoms = () => {
    setSymptomId(null)
    setCurrentQId(null)
    setHistory([])
    setFeedbackSent(false)
    setPhase('symptom')
  }

  const sendFeedback = (helpful) => {
    const dx = DIAGNOSES[currentQId]
    fetch('https://formspree.io/f/mvzdpbqo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feedback: helpful ? 'helpful' : 'not_helpful',
        diagnosis: dx?.title || '',
        furnaceType: furnaceType === '80' ? '80%' : '90%+',
        symptom: symptomLabel,
      }),
    }).catch(() => {})
    setFeedbackSent(true)
  }

  const selectEquipment = (type) => {
    setFurnaceType(type)
    setPhase('symptom')
  }

  const selectSymptom = (id) => {
    setSymptomId(id)
    const firstQ = SYMPTOM_FIRST_QUESTION[id]
    setCurrentQId(firstQ)
    setHistory([])
    setPhase('question')
  }

  const answer = (nextId) => {
    if (nextId.startsWith('dx-')) {
      setPhase('diagnosis')
      setCurrentQId(nextId)
    } else {
      setHistory((h) => [...h, currentQId])
      setCurrentQId(nextId)
    }
  }

  const goBack = () => {
    if (history.length === 0) {
      setPhase('symptom')
    } else {
      const prev = history[history.length - 1]
      setHistory((h) => h.slice(0, -1))
      setCurrentQId(prev)
    }
  }

  const typeLabel = furnaceType === '80' ? '80% Standard' : '90%+ High Efficiency'
  const symptomLabel = symptomId
    ? [...SYMPTOMS.shared, ...SYMPTOMS['90-only']].find((s) => s.id === symptomId)?.label || ''
    : ''

  // ── Equipment selection ──
  if (phase === 'equipment') {
    return (
      <div className={styles.engine}>
        <h3 className={styles.heading}>What type of furnace?</h3>
        <p className={styles.helper}>
          Not sure? If the exhaust vent is metal pipe going up through the roof, it's 80%. White PVC pipe out the side wall means 90%+.
        </p>
        <div className={styles.equipGrid}>
          <button type="button" className={styles.equipCard} onClick={() => selectEquipment('80')}>
            <span className={styles.equipTitle}>Standard Efficiency (80%)</span>
            <span className={styles.equipDesc}>Metal flue pipe through roof. No condensate drain.</span>
          </button>
          <button type="button" className={styles.equipCard} onClick={() => selectEquipment('90')}>
            <span className={styles.equipTitle}>High Efficiency (90%+)</span>
            <span className={styles.equipDesc}>PVC pipes out side wall. Has a condensate drain.</span>
          </button>
        </div>
      </div>
    )
  }

  // ── Symptom selection ──
  if (phase === 'symptom') {
    const symptoms = furnaceType === '90'
      ? [...SYMPTOMS.shared, ...SYMPTOMS['90-only']]
      : SYMPTOMS.shared

    return (
      <div className={styles.engine}>
        <button type="button" className={styles.backLink} onClick={() => { setPhase('equipment') }}>
          ← Back to equipment selection
        </button>
        <p className={styles.typeLabel}>{typeLabel}</p>
        <h3 className={styles.heading}>What's happening?</h3>
        <div className={styles.symptomList}>
          {symptoms.map((s) => (
            <button key={s.id} type="button" className={styles.symptomRow} onClick={() => selectSymptom(s.id)}>
              <span className={styles.symptomTitle}>{s.label}</span>
              <span className={styles.symptomDesc}>{s.desc}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Question walkthrough ──
  if (phase === 'question') {
    const q = QUESTIONS[currentQId]
    if (!q) return null

    return (
      <div className={styles.engine}>
        <div className={styles.breadcrumb}>
          <span>{typeLabel}</span>
          <span className={styles.breadSep}>›</span>
          <span>{symptomLabel}</span>
          <span className={styles.breadSep}>›</span>
          <span>Step {history.length + 1}</span>
        </div>

        <h3 className={styles.questionText}>{q.text}</h3>
        <p className={styles.helper}>{q.helper}</p>

        <div className={styles.answerRow}>
          <button type="button" className={styles.yesBtn} onClick={() => answer(q.yes)}>Yes</button>
          <button type="button" className={styles.noBtn} onClick={() => answer(q.no)}>No</button>
        </div>

        <button type="button" className={styles.backLink} onClick={goBack}>
          ← Back
        </button>
      </div>
    )
  }

  // ── Diagnosis ──
  if (phase === 'diagnosis') {
    const dx = DIAGNOSES[currentQId]
    if (!dx) return null

    return (
      <div className={styles.engine}>
        <ResultsPanel
          eyebrow="DIAGNOSTIC RESULT"
          title={dx.title}
          summary={dx.summary}
          notes={dx.notes}
          customerText={dx.customerText}
          showPrint
        />

        <div className={styles.diagActions}>
          <button type="button" className={styles.tryDifferent} onClick={goToSymptoms}>
            Try a different symptom
          </button>
          <button type="button" className={styles.startOver} onClick={reset}>
            Start Over
          </button>
        </div>

        <div style={{ marginTop: '32px' }}>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: '16px', fontWeight: 600, color: '#0e2340', marginBottom: '12px' }}>Did this solve your problem?</p>
          {feedbackSent ? (
            <p style={{ fontStyle: 'italic', color: '#5a6068', fontSize: '14px' }}>Thanks for the feedback!</p>
          ) : (
            <div>
              <button type="button" onClick={() => sendFeedback(true)} style={{ background: '#0e2340', color: 'white', padding: '10px 24px', borderRadius: '4px', border: 'none', fontFamily: "'Figtree', sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginRight: '12px' }}>Yes, this helped</button>
              <button type="button" onClick={() => sendFeedback(false)} style={{ background: 'white', color: '#2a2d32', padding: '10px 24px', borderRadius: '4px', border: '1px solid #e2e4e8', fontFamily: "'Figtree', sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>No, still having issues</button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
