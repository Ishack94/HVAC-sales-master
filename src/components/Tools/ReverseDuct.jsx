import React, { useState, useMemo } from 'react'
import styles from './ReverseDuct.module.css'

const ROUND_SIZES = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]
const RECT_WIDTHS = ['3.25', '8', '10', '12', '14', '16', '18', '20', '24']
const RECT_HEIGHTS = ['8', '10', '12', '14', '18']
const FRICTION_OPTIONS = [0.05, 0.06, 0.08, 0.10, 0.12, 0.15]

const WIDTH_LABELS = { '3.25': '3¼"', '8': '8"', '10': '10"', '12': '12"', '14': '14"', '16': '16"', '18': '18"', '20': '20"', '24': '24"' }

function areaRound(d) {
  return Math.PI * Math.pow(d / 24, 2)
}

function areaRect(w, h) {
  return (Number(w) * Number(h)) / 144
}

function velColor(fpm) {
  if (fpm < 700) return '#059669'
  if (fpm <= 900) return '#d97706'
  return '#dc2626'
}

function bestFor(area) {
  if (area < 0.15) return 'Small rooms and short branch runs'
  if (area < 0.5) return 'Standard branch supply runs'
  if (area < 1.0) return 'Trunk lines and large supply runs'
  return 'Main trunk lines'
}

export default function ReverseDuct() {
  const [shape, setShape] = useState('round')
  const [diameter, setDiameter] = useState(8)
  const [rectW, setRectW] = useState('8')
  const [rectH, setRectH] = useState('8')
  const [friction, setFriction] = useState(0.08)

  const area = useMemo(() => {
    return shape === 'round' ? areaRound(diameter) : areaRect(rectW, rectH)
  }, [shape, diameter, rectW, rectH])

  const cfmAt = (fpm) => Math.round(area * fpm)
  const fpmAt = (cfm) => area > 0 ? Math.round(cfm / area) : 0

  const recCFM = cfmAt(600)
  const minCFM = cfmAt(400)
  const maxCFM = cfmAt(900)

  // Sample CFM values relevant to this duct size
  const sampleCFMs = useMemo(() => {
    const base = Math.max(50, Math.round(minCFM / 50) * 50)
    const step = Math.max(25, Math.round((maxCFM - minCFM) / 4 / 25) * 25) || 50
    const samples = []
    for (let c = base; c <= maxCFM + step && samples.length < 5; c += step) {
      samples.push(c)
    }
    if (samples.length < 3) {
      return [minCFM, recCFM, maxCFM]
    }
    return samples
  }, [minCFM, maxCFM, recCFM])

  const sizeLabel = shape === 'round'
    ? `${diameter}" round`
    : `${WIDTH_LABELS[rectW] || rectW + '"'} × ${rectH}"`

  return (
    <div className={styles.tool}>
      <div className={styles.header}>
        <h3 className={styles.toolTitle}>Reverse Duct Calculator</h3>
        <p className={styles.toolSubtitle}>
          Already have ducts? Find out how much airflow they can handle.
        </p>
      </div>

      <div className={styles.inputArea}>
        <div className={styles.shapeToggle}>
          <span className={styles.fieldLabel}>Duct Shape</span>
          <div className={styles.segmentedControl} role="radiogroup">
            <button
              type="button"
              role="radio"
              aria-checked={shape === 'round'}
              onClick={() => setShape('round')}
              className={`${styles.segBtn} ${shape === 'round' ? styles.segBtnActive : ''}`}
            >
              Round
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={shape === 'rect'}
              onClick={() => setShape('rect')}
              className={`${styles.segBtn} ${shape === 'rect' ? styles.segBtnActive : ''}`}
            >
              Rectangular
            </button>
          </div>
        </div>

        <div className={styles.sizeInputs}>
          {shape === 'round' ? (
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Diameter</span>
              <select value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} className={styles.input}>
                {ROUND_SIZES.map((d) => <option key={d} value={d}>{d}"</option>)}
              </select>
            </label>
          ) : (
            <>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Width</span>
                <select value={rectW} onChange={(e) => setRectW(e.target.value)} className={styles.input}>
                  {RECT_WIDTHS.map((w) => <option key={w} value={w}>{WIDTH_LABELS[w] || w + '"'}</option>)}
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Height</span>
                <select value={rectH} onChange={(e) => setRectH(e.target.value)} className={styles.input}>
                  {RECT_HEIGHTS.map((h) => <option key={h} value={h}>{h}"</option>)}
                </select>
              </label>
            </>
          )}
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Friction Rate</span>
            <select value={friction} onChange={(e) => setFriction(Number(e.target.value))} className={styles.input}>
              {FRICTION_OPTIONS.map((f) => <option key={f} value={f}>{f.toFixed(2)}" WC / 100 ft</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.resultsGrid}>
        {/* Card 1: CFM Capacity */}
        <div className={styles.card}>
          <h4 className={styles.cardLabel}>CFM Capacity</h4>
          <p className={styles.cardBig}>{recCFM}</p>
          <p className={styles.cardSub}>Recommended CFM for {sizeLabel}</p>
          <div className={styles.rangeRow}>
            <span>Min: <strong>{minCFM}</strong> CFM</span>
            <span>Max: <strong>{maxCFM}</strong> CFM</span>
          </div>
          <div className={styles.bar}>
            <div className={styles.barGreen} style={{ width: `${((700 - 400) / 600) * 100}%` }} />
            <div className={styles.barAmber} style={{ width: `${((900 - 700) / 600) * 100}%` }} />
            <div className={styles.barRed} style={{ width: `${((1000 - 900) / 600) * 100}%` }} />
            <div className={styles.barMarker} style={{ left: `${((600 - 400) / 600) * 100}%` }} />
          </div>
          <div className={styles.barLabels}>
            <span style={{ color: '#059669' }}>Quiet</span>
            <span style={{ color: '#d97706' }}>OK</span>
            <span style={{ color: '#dc2626' }}>Noisy</span>
          </div>
        </div>

        {/* Card 2: Velocity at Common CFMs */}
        <div className={styles.card}>
          <h4 className={styles.cardLabel}>Velocity at Common CFMs</h4>
          <div className={styles.velTable}>
            {sampleCFMs.map((c) => {
              const v = fpmAt(c)
              return (
                <div key={c} className={styles.velRow}>
                  <span className={styles.velCFM}>{c} CFM</span>
                  <span className={styles.velFPM} style={{ color: velColor(v) }}>{v} FPM</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Card 3: Pressure Drop / Best For */}
        <div className={styles.card}>
          <h4 className={styles.cardLabel}>Pressure Drop</h4>
          <p className={styles.cardMid}>{friction.toFixed(2)}" WC</p>
          <p className={styles.cardSub}>Per 100 ft of straight duct</p>
          <div className={styles.bestFor}>
            <span className={styles.bestForLabel}>Best for</span>
            <span className={styles.bestForValue}>{bestFor(area)}</span>
          </div>
          <p className={styles.areaNote}>
            Duct area: {(area * 144).toFixed(1)} sq in ({area.toFixed(3)} sq ft)
          </p>
        </div>
      </div>
    </div>
  )
}
