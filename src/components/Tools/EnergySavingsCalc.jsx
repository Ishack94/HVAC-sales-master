import React, { useState } from 'react'
import ResultsPanel from './ResultsPanel'
import styles from './EnergySavingsCalc.module.css'

const TONNAGE_OPTIONS = [1.5, 2, 2.5, 3, 3.5, 4, 5]

const HOURS_PRESETS = [
  { label: 'Light cooling climate (800 hrs)', value: 800 },
  { label: 'Moderate climate (1,200 hrs)', value: 1200 },
  { label: 'Warm climate (1,600 hrs)', value: 1600 },
  { label: 'Hot climate — Southern US (2,000 hrs)', value: 2000 },
  { label: 'Very hot climate — AZ, TX, FL (2,500 hrs)', value: 2500 },
  { label: 'Custom', value: 'custom' },
]

function fmt(n) {
  return Math.round(n).toLocaleString()
}

export default function EnergySavingsCalc() {
  const [tons, setTons] = useState(3)
  const [oldSEER, setOldSEER] = useState(10)
  const [newSEER, setNewSEER] = useState(16)
  const [rate, setRate] = useState(0.16)
  const [hoursPreset, setHoursPreset] = useState(2000)
  const [customHours, setCustomHours] = useState(2000)
  const [result, setResult] = useState(null)

  const isCustom = hoursPreset === 'custom'
  const hours = isCustom ? Number(customHours) || 0 : Number(hoursPreset)

  const calculate = () => {
    const btu = tons * 12000
    const r = Number(rate) || 0.16
    const oldCost = (btu / oldSEER) * hours * r / 1000
    const newCost = (btu / newSEER) * hours * r / 1000
    const savings = oldCost - newCost
    const pct = Math.round(((newSEER - oldSEER) / oldSEER) * 100)

    setResult({ oldCost, newCost, savings, savings10: savings * 10, savings15: savings * 15, pct })
  }

  const customerText = () => {
    if (!result) return ''
    const s = result.savings
    const s15 = result.savings15
    const mo = Math.round(s / 12)
    if (s > 300) {
      return `Right now your ${oldSEER} SEER system costs approximately $${fmt(result.oldCost)} per year to cool your home. A new ${newSEER} SEER system would cost about $${fmt(result.newCost)} per year — that's a savings of about $${fmt(s)} every year. Over 15 years, that adds up to roughly $${fmt(s15)} in your pocket. And that's before any rebates or tax credits.`
    }
    if (s >= 100) {
      return `Upgrading from ${oldSEER} SEER to ${newSEER} SEER would save you about $${fmt(s)} per year in cooling costs. That's roughly $${mo} per month off your electric bill during the cooling season. Over the life of the system, that adds up.`
    }
    return `The efficiency difference between ${oldSEER} SEER and ${newSEER} SEER is relatively modest for your system size — about $${fmt(s)} per year. The savings are real but may not be the primary reason to upgrade. Other benefits like reliability, warranty, quieter operation, and better humidity control are often more important.`
  }

  return (
    <div className={styles.tool}>
      <div className={styles.header}>
        <h3 className={styles.toolTitle}>Energy Savings Calculator</h3>
        <p className={styles.toolSubtitle}>
          Compare energy costs between old and new AC systems
        </p>
      </div>

      <div className={styles.inputCard}>
        <div className={styles.group}>
          <label className={styles.field}>
            <span className={styles.label}>System Size</span>
            <select value={tons} onChange={(e) => setTons(Number(e.target.value))} className={styles.input}>
              {TONNAGE_OPTIONS.map((t) => <option key={t} value={t}>{t} Ton</option>)}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Electricity Cost ($/kWh)</span>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step="0.01" min="0.01" className={styles.input} />
            <span className={styles.hint}>Check your electric bill. National average is about $0.16/kWh.</span>
          </label>
        </div>

        <div className={styles.group}>
          <label className={styles.field}>
            <span className={styles.label}>Current System SEER Rating</span>
            <input type="number" value={oldSEER} onChange={(e) => setOldSEER(Number(e.target.value))} min="6" max="25" className={styles.input} />
            <span className={styles.hint}>Check the yellow EnergyGuide label on your outdoor unit. Older systems are often 8–12 SEER.</span>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>New System SEER Rating</span>
            <input type="number" value={newSEER} onChange={(e) => setNewSEER(Number(e.target.value))} min="14" max="30" className={styles.input} />
            <span className={styles.hint}>Modern systems range from 14 SEER (minimum) to 25+ SEER (premium).</span>
          </label>
        </div>

        <div className={styles.group}>
          <label className={styles.field}>
            <span className={styles.label}>Annual Cooling Hours</span>
            <select value={hoursPreset} onChange={(e) => { const v = e.target.value; setHoursPreset(v === 'custom' ? 'custom' : Number(v)) }} className={styles.input}>
              {HOURS_PRESETS.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>
          </label>
          {isCustom && (
            <label className={`${styles.field} ${styles.fadeIn}`}>
              <span className={styles.label}>Custom Hours</span>
              <input type="number" value={customHours} onChange={(e) => setCustomHours(e.target.value)} min="100" max="5000" className={styles.input} />
            </label>
          )}
        </div>

        <button type="button" onClick={calculate} className={styles.calcBtn} disabled={!oldSEER || !newSEER || newSEER <= oldSEER}>
          Calculate Savings
        </button>
      </div>

      {result && (
        <ResultsPanel
          eyebrow="ENERGY SAVINGS"
          title="Estimated Annual Savings"
          primaryValue={`$${fmt(result.savings)}`}
          primaryUnit="/YEAR"
          summary={`Upgrading from ${oldSEER} SEER to ${newSEER} SEER could save approximately $${fmt(result.savings)} per year in cooling costs.`}
          metrics={[
            { label: 'Current Annual Cooling Cost', value: `$${fmt(result.oldCost)}`, unit: '/yr' },
            { label: 'New Annual Cooling Cost', value: `$${fmt(result.newCost)}`, unit: '/yr' },
            { label: 'Annual Savings', value: `$${fmt(result.savings)}`, unit: '/yr' },
            { label: '10-Year Savings', value: `$${fmt(result.savings10)}` },
            { label: '15-Year Savings', value: `$${fmt(result.savings15)}` },
            { label: 'Efficiency Improvement', value: `${result.pct}%` },
          ]}
          notes={[
            'These estimates assume consistent electricity rates and usage. Actual savings depend on climate, home insulation, and system maintenance.',
            'A properly sized and installed system will perform closer to its rated SEER. Oversized or undersized systems lose efficiency.',
            'Factor in available rebates and tax credits — a federal tax credit of up to $2,000 may apply for qualifying high-efficiency systems.',
          ]}
          customerText={customerText()}
          showPrint
        />
      )}
    </div>
  )
}
