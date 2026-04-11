import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import DuctDesigner from '../components/Tools/DuctDesigner'
import styles from './Resources.module.css'

const CEILING_OPTIONS = [
  { label: '8 ft', value: 1.0 },
  { label: '9 ft', value: 1.12 },
  { label: '10 ft', value: 1.25 },
  { label: '12 ft', value: 1.5 },
]

const INSULATION_OPTIONS = [
  { label: 'Poor', value: 1.15 },
  { label: 'Average', value: 1.0 },
  { label: 'Good', value: 0.85 },
  { label: 'Excellent', value: 0.75 },
]

const CLIMATE_OPTIONS = [
  { label: 'Cool / Mild', value: 0.85 },
  { label: 'Average', value: 1.0 },
  { label: 'Hot / Humid', value: 1.15 },
  { label: 'Very Hot', value: 1.3 },
  { label: 'Very Cold', value: 1.25 },
]

const SUN_OPTIONS = [
  { label: 'Low / Shaded', value: 0.9 },
  { label: 'Average', value: 1.0 },
  { label: 'High / Direct Sun', value: 1.1 },
]

function LoadCalculator() {
  const [sqft, setSqft] = useState(2000)
  const [ceiling, setCeiling] = useState(1.0)
  const [windows, setWindows] = useState(8)
  const [doors, setDoors] = useState(2)
  const [occupants, setOccupants] = useState(4)
  const [insulation, setInsulation] = useState(1.0)
  const [climate, setClimate] = useState(1.0)
  const [sun, setSun] = useState(1.0)

  const result = useMemo(() => {
    const sq = Number(sqft) || 0
    const w = Number(windows) || 0
    const d = Number(doors) || 0
    const occ = Number(occupants) || 0

    const baseBTU = sq * ceiling * 25
    const windowBTU = w * 1000
    const doorBTU = d * 1000
    const occupantBTU = occ * 400
    const subtotal = baseBTU + windowBTU + doorBTU + occupantBTU
    const totalBTU = subtotal * insulation * climate * sun
    const tonnage = Math.round((totalBTU / 12000) * 2) / 2

    return { totalBTU: Math.round(totalBTU), tonnage }
  }, [sqft, ceiling, windows, doors, occupants, insulation, climate, sun])

  return (
    <div className={styles.calculator}>
      <div className={styles.calcGrid}>
        <label className={styles.calcField}>
          <span className={styles.calcLabel}>Square Footage</span>
          <input
            type="number"
            value={sqft}
            onChange={(e) => setSqft(e.target.value)}
            min="100"
            className={styles.calcInput}
          />
        </label>

        <label className={styles.calcField}>
          <span className={styles.calcLabel}>Ceiling Height</span>
          <select
            value={ceiling}
            onChange={(e) => setCeiling(Number(e.target.value))}
            className={styles.calcInput}
          >
            {CEILING_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.calcField}>
          <span className={styles.calcLabel}>Number of Windows</span>
          <input
            type="number"
            value={windows}
            onChange={(e) => setWindows(e.target.value)}
            min="0"
            className={styles.calcInput}
          />
        </label>

        <label className={styles.calcField}>
          <span className={styles.calcLabel}>Number of Exterior Doors</span>
          <input
            type="number"
            value={doors}
            onChange={(e) => setDoors(e.target.value)}
            min="0"
            className={styles.calcInput}
          />
        </label>

        <label className={styles.calcField}>
          <span className={styles.calcLabel}>Number of Occupants</span>
          <input
            type="number"
            value={occupants}
            onChange={(e) => setOccupants(e.target.value)}
            min="0"
            className={styles.calcInput}
          />
        </label>

        <label className={styles.calcField}>
          <span className={styles.calcLabel}>Insulation Quality</span>
          <select
            value={insulation}
            onChange={(e) => setInsulation(Number(e.target.value))}
            className={styles.calcInput}
          >
            {INSULATION_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.calcField}>
          <span className={styles.calcLabel}>Climate Zone</span>
          <select
            value={climate}
            onChange={(e) => setClimate(Number(e.target.value))}
            className={styles.calcInput}
          >
            {CLIMATE_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.calcField}>
          <span className={styles.calcLabel}>Sun Exposure</span>
          <select
            value={sun}
            onChange={(e) => setSun(Number(e.target.value))}
            className={styles.calcInput}
          >
            {SUN_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.calcResult}>
        <p className={styles.calcResultLine}>
          Estimated Cooling Load: <strong>{result.totalBTU.toLocaleString()} BTU/hr ({result.tonnage.toFixed(1)} tons)</strong>
        </p>
        <p className={styles.calcRecommendation}>
          Based on this estimate, a <strong>{result.tonnage.toFixed(1)}-ton</strong> system would be appropriate for this space.
        </p>
        <p className={styles.calcDisclaimer}>
          This is a simplified estimate based on rule-of-thumb calculations. For accurate equipment sizing, a full Manual J load calculation by a licensed HVAC professional is recommended.
        </p>
      </div>
    </div>
  )
}

function CalculatorSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionH2}>HVAC Load Calculator</h2>
      <p>
        A quick rule-of-thumb cooling load estimator. Plug in the basics about a home and get a ballpark BTU and tonnage figure. It's not a replacement for a real Manual J — but it's a fast sanity check before you walk into a sales call or quote a replacement.
      </p>
      <LoadCalculator />
    </section>
  )
}

function DuctDesignerSection() {
  return (
    <section className={styles.sectionFlush}>
      <DuctDesigner />
    </section>
  )
}

const SECTIONS = [
  {
    key: 'calculator',
    title: 'HVAC Load Calculator',
    desc: 'Estimate cooling load and equipment size',
    Component: CalculatorSection,
  },
  {
    key: 'duct-designer',
    title: 'Duct Design Calculator',
    desc: 'Size supply and return ductwork for any house',
    Component: DuctDesignerSection,
  },
]

export default function Resources() {
  const location = useLocation()
  const canonicalUrl = `https://hvac-sales-master.vercel.app${location.pathname}`
  const [openKey, setOpenKey] = useState(null)
  const expandedRef = useRef(null)

  const handleBoxClick = (key) => {
    setOpenKey((current) => (current === key ? null : key))
  }

  const handleClose = () => {
    setOpenKey(null)
  }

  useEffect(() => {
    if (openKey && expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [openKey])

  const ActiveSection = SECTIONS.find((s) => s.key === openKey)?.Component || null

  return (
    <>
      <Helmet>
        <title>Resources | HVAC Sales Master</title>
        <meta name="description" content="Vetted HVAC resources — load calculator, training and certification, manufacturer technical libraries, and industry associations." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <Banner
        title="Resources"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Resources' },
        ]}
      />
      <div className={styles.layout}>
        <main className={styles.main}>
          <p className={styles.intro}>
            A working list of the tools, training, and references I actually reach for in the field. Bookmark what's useful — and let me know what's missing.
          </p>

          <div className={styles.boxGrid}>
            {SECTIONS.map((s) => {
              const isActive = openKey === s.key
              return (
                <button
                  key={s.key}
                  type="button"
                  className={`${styles.box} ${isActive ? styles.boxActive : ''}`}
                  onClick={() => handleBoxClick(s.key)}
                  aria-expanded={isActive}
                >
                  <span className={styles.boxTitle}>{s.title}</span>
                  <span className={styles.boxDesc}>{s.desc}</span>
                </button>
              )
            })}
          </div>

          {ActiveSection && (
            <div className={styles.expanded} ref={expandedRef}>
              <button type="button" onClick={handleClose} className={styles.backLink}>
                ← Back to Resources
              </button>
              <ActiveSection />
            </div>
          )}

          <p className={styles.dinoRec}>
            One more thing — we use <a href="https://www.dinoquote.com" target="_blank" rel="noopener noreferrer" className={styles.dinoLink}>Dino Quote</a> for online quoting and it's been one of the better moves we've made. Homeowners can get a ballpark number before you even show up, and it's helped us close more jobs. Worth a look if you're trying to grow.
          </p>

          <p className={styles.closing}>
            Know a resource that should be on this list? <a href="mailto:contact@hvacsalesmaster.com" className={styles.mailto}>Let me know.</a>
          </p>
        </main>

        <Sidebar />
      </div>
      <Newsletter />
    </>
  )
}
