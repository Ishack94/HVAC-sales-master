import React, { useState, useMemo } from 'react'
import styles from './Ductulator.module.css'

/* Tier table — sized for 0.08" w.g. per 100ft equal friction.
 * Index lookup so we can bump up/down for friction rate + flex. */
const TIERS = [
  { max: 50,   round: 4,  rect: '3¼×8' },
  { max: 80,   round: 5,  rect: '3¼×10' },
  { max: 110,  round: 6,  rect: '3¼×12' },
  { max: 160,  round: 7,  rect: '3¼×14' },
  { max: 225,  round: 8,  rect: '8×8' },
  { max: 300,  round: 9,  rect: '8×10' },
  { max: 400,  round: 10, rect: '8×12' },
  { max: 550,  round: 12, rect: '10×12' },
  { max: 750,  round: 14, rect: '12×12' },
  { max: 1000, round: 16, rect: '14×12' },
  { max: 1400, round: 18, rect: '16×14' },
  { max: 1800, round: 20, rect: '18×14' },
  { max: 2500, round: 22, rect: '20×14' },
  { max: 3500, round: 24, rect: '20×18' },
  { max: 5000, round: 28, rect: '24×18' },
]

/* Friction rate adjustments (offset added to tier index).
 * Lower friction = more restrictive = need a larger duct = +index.
 * Higher friction = can run smaller = -index. */
const FRICTION_OFFSETS = {
  0.05: 1,
  0.06: 1,
  0.08: 0,
  0.10: 0,
  0.12: -1,
  0.15: -1,
}

const FRICTION_OPTIONS = [0.05, 0.06, 0.08, 0.10, 0.12, 0.15]

const REFERENCE_ROWS = [
  { room: 'Master Bedroom', cfm: '100-200 CFM' },
  { room: 'Bedroom', cfm: '75-150 CFM' },
  { room: 'Living Room', cfm: '150-350 CFM' },
  { room: 'Kitchen', cfm: '100-250 CFM' },
  { room: 'Bathroom', cfm: '50-100 CFM' },
  { room: 'Dining Room', cfm: '100-200 CFM' },
  { room: 'Office/Den', cfm: '75-150 CFM' },
  { room: 'Hallway', cfm: '50-100 CFM' },
  { room: 'Laundry', cfm: '75-125 CFM' },
]

function calcDuct(cfm, friction, isFlex) {
  const clamped = Math.min(5000, Math.max(25, cfm))
  let idx = TIERS.findIndex((t) => clamped <= t.max)
  if (idx < 0) idx = TIERS.length - 1
  const offset = (FRICTION_OFFSETS[friction] || 0) + (isFlex ? 1 : 0)
  idx = Math.max(0, Math.min(TIERS.length - 1, idx + offset))
  const tier = TIERS[idx]
  const areaSqft = (Math.PI * Math.pow(tier.round / 2, 2)) / 144
  const fpm = Math.round(cfm / areaSqft)
  return { round: tier.round, rect: tier.rect, fpm }
}

function velocityStatus(fpm) {
  if (fpm < 700) return { key: 'green', label: 'Quiet operation' }
  if (fpm < 900) return { key: 'amber', label: 'Acceptable — may notice noise' }
  return { key: 'red', label: 'High velocity — likely noisy' }
}

export default function Ductulator() {
  const [cfm, setCfm] = useState('')
  const [friction, setFriction] = useState(0.08)
  const [material, setMaterial] = useState('rigid')
  const isFlex = material === 'flex'

  const cfmNum = Number(cfm)
  const hasInput = cfm.trim().length >= 2 && cfmNum >= 25

  const result = useMemo(() => {
    if (!hasInput) return null
    return calcDuct(cfmNum, friction, isFlex)
  }, [cfmNum, friction, isFlex, hasInput])

  const velocity = result ? velocityStatus(result.fpm) : null

  return (
    <div className={styles.tool}>
      <div className={styles.header}>
        <h3 className={styles.toolTitle}>Quick Duct Sizer</h3>
        <p className={styles.toolSubtitle}>
          Size any single duct run by CFM and friction rate
        </p>
      </div>

      <div className={styles.inputRow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>CFM</span>
          <input
            type="number"
            value={cfm}
            onChange={(e) => setCfm(e.target.value)}
            placeholder="Enter CFM"
            min="25"
            max="5000"
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Friction Rate</span>
          <select
            value={friction}
            onChange={(e) => setFriction(Number(e.target.value))}
            className={styles.input}
          >
            {FRICTION_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f.toFixed(2)}" WC / 100 ft
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.materialSection}>
        <span className={styles.materialLabel}>Duct Material</span>
        <div className={styles.segmentedControl} role="radiogroup" aria-label="Duct material">
          <button
            type="button"
            role="radio"
            aria-checked={material === 'rigid'}
            onClick={() => setMaterial('rigid')}
            className={`${styles.segmentBtn} ${material === 'rigid' ? styles.segmentBtnActive : ''}`}
          >
            Sheet Metal
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={material === 'flex'}
            onClick={() => setMaterial('flex')}
            className={`${styles.segmentBtn} ${material === 'flex' ? styles.segmentBtnActive : ''}`}
          >
            Flex Duct
          </button>
        </div>
        {isFlex && (
          <p className={styles.materialNote}>
            Flex duct sizes increased one increment for equivalent performance.
          </p>
        )}
      </div>

      {hasInput && result ? (
        <div className={styles.resultsGrid}>
          <div className={styles.resultCard}>
            <div className={styles.resultBig}>{result.round} inch</div>
            <div className={styles.resultSubtitle}>Round duct diameter</div>
          </div>

          <div className={styles.resultCard}>
            <div className={styles.resultMidBlue}>{result.rect}</div>
            <div className={styles.resultSubtitle}>Rectangular equivalent</div>
          </div>

          <div className={`${styles.resultCard} ${styles[`vel${velocity.key.charAt(0).toUpperCase() + velocity.key.slice(1)}`]}`}>
            <div className={styles.resultMid}>{result.fpm.toLocaleString()} FPM</div>
            <div className={styles.resultSubtitle}>{velocity.label}</div>
          </div>

          <div className={styles.resultCard}>
            <div className={styles.resultMid}>{friction.toFixed(2)}" WC</div>
            <div className={styles.resultSubtitle}>Per 100 ft of straight duct</div>
          </div>
        </div>
      ) : (
        <div className={styles.placeholder}>Enter CFM above to see results</div>
      )}

      <div className={styles.refBlock}>
        <h4 className={styles.refTitle}>Common CFM Reference</h4>
        <div className={styles.tableWrap}>
          <table className={styles.refTable}>
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Typical CFM Range</th>
              </tr>
            </thead>
            <tbody>
              {REFERENCE_ROWS.map((row) => (
                <tr key={row.room}>
                  <td className={styles.refRoom}>{row.room}</td>
                  <td>{row.cfm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.refNote}>
          CFM varies based on room size, insulation, climate, and heat load. Use our HVAC Load Calculator for room-by-room BTU calculations, then our Duct Design Calculator for full house duct layouts.
        </p>
      </div>
    </div>
  )
}
