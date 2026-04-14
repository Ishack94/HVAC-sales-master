import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import DuctDesigner from '../components/Tools/DuctDesigner'
import ReverseDuct from '../components/Tools/ReverseDuct'
import SuperheatCalc from '../components/Tools/SuperheatCalc'
import EnergySavingsCalc from '../components/Tools/EnergySavingsCalc'
import ResultsPanel from '../components/Tools/ResultsPanel'
import sectionAccentResources from '../assets/section-accent-resources.webp'
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

const TONNAGE_OPTIONS = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0]
const BTU_OPTIONS = [40000, 60000, 80000, 100000, 120000]

function nearestTonnage(t) {
  return TONNAGE_OPTIONS.reduce((prev, curr) => Math.abs(curr - t) < Math.abs(prev - t) ? curr : prev)
}
function nearestBTU(b) {
  return BTU_OPTIONS.reduce((prev, curr) => Math.abs(curr - b) < Math.abs(prev - b) ? curr : prev)
}

function LoadCalculator({ onTransfer }) {
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
    let rangeLow = Math.floor(tonnage * 2) / 2
    let rangeHigh = Math.ceil(tonnage * 2) / 2
    if (rangeLow === rangeHigh) {
      rangeLow = Math.max(1.5, tonnage - 0.5)
      rangeHigh = tonnage
    }

    return { totalBTU: Math.round(totalBTU), tonnage, rangeLow, rangeHigh }
  }, [sqft, ceiling, windows, doors, occupants, insulation, climate, sun])

  const customerText = `Based on the size and characteristics of your home, you'd need approximately a ${result.tonnage.toFixed(1)}-ton system to keep it comfortable year-round. That's a ${result.totalBTU.toLocaleString()} BTU system.`

  const handleTransfer = () => {
    if (onTransfer) {
      onTransfer({
        tonnage: nearestTonnage(result.tonnage),
        btu: nearestBTU(result.tonnage * 20000),
      })
    }
  }

  return (
    <div className={styles.calculator}>
      <div className={styles.calcGrid}>
        <div className={styles.calcGroup}>
          <label className={styles.calcField}>
            <span className={styles.calcLabel}>Square Footage</span>
            <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} min="100" className={styles.calcInput} />
          </label>
          <label className={styles.calcField}>
            <span className={styles.calcLabel}>Ceiling Height</span>
            <select value={ceiling} onChange={(e) => setCeiling(Number(e.target.value))} className={styles.calcInput}>
              {CEILING_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
        <div className={styles.calcGroup}>
          <label className={styles.calcField}>
            <span className={styles.calcLabel}>Number of Windows</span>
            <input type="number" value={windows} onChange={(e) => setWindows(e.target.value)} min="0" className={styles.calcInput} />
          </label>
          <label className={styles.calcField}>
            <span className={styles.calcLabel}>Number of Exterior Doors</span>
            <input type="number" value={doors} onChange={(e) => setDoors(e.target.value)} min="0" className={styles.calcInput} />
          </label>
        </div>
        <div className={styles.calcGroup}>
          <label className={styles.calcField}>
            <span className={styles.calcLabel}>Number of Occupants</span>
            <input type="number" value={occupants} onChange={(e) => setOccupants(e.target.value)} min="0" className={styles.calcInput} />
          </label>
          <label className={styles.calcField}>
            <span className={styles.calcLabel}>Insulation Quality</span>
            <select value={insulation} onChange={(e) => setInsulation(Number(e.target.value))} className={styles.calcInput}>
              {INSULATION_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
        <div className={styles.calcGroup}>
          <label className={styles.calcField}>
            <span className={styles.calcLabel}>Climate Zone</span>
            <select value={climate} onChange={(e) => setClimate(Number(e.target.value))} className={styles.calcInput}>
              {CLIMATE_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className={styles.calcField}>
            <span className={styles.calcLabel}>Sun Exposure</span>
            <select value={sun} onChange={(e) => setSun(Number(e.target.value))} className={styles.calcInput}>
              {SUN_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <ResultsPanel
        eyebrow="LOAD CALCULATOR"
        title="Recommended System Size"
        primaryValue={result.tonnage.toFixed(1)}
        primaryUnit="Tons"
        summary={`A ${result.tonnage.toFixed(1)}-ton system should keep this home comfortable year-round.`}
        metrics={[
          { label: 'Estimated Cooling Load', value: result.totalBTU.toLocaleString(), unit: 'BTU/hr' },
          { label: 'Recommended Airflow', value: Math.round(result.tonnage * 400).toLocaleString(), unit: 'CFM' },
          { label: 'Acceptable Range', value: `${result.rangeLow.toFixed(1)} – ${result.rangeHigh.toFixed(1)}`, unit: 'Tons' },
        ]}
        notes={[
          ...(insulation >= 1.15 ? ['Homes with poor insulation often need capacity toward the higher end of the range.'] : []),
          ...(sun >= 1.1 ? ['High sun exposure increases cooling demand — consider window treatments or shading.'] : []),
          ...(Number(windows) > 12 ? ['Higher window counts add significant solar heat gain to the cooling load.'] : []),
          'Undersizing risk: system may struggle on the hottest days. Rooms farthest from the unit may not reach temperature.',
          'Oversizing risk: system will short-cycle, wasting energy and leaving humidity problems in cooling mode.',
          'This estimate assumes the duct system can deliver the required airflow. Restrictive ductwork will reduce comfort.',
        ]}
        customerText={customerText}
        actionLabel="Size the Ductwork for This System →"
        onAction={handleTransfer}
        showPrint
      />
      <p className={styles.calcDisclaimer}>
        This is a simplified estimate based on rule-of-thumb calculations. For accurate equipment sizing, a full Manual J load calculation by a licensed HVAC professional is recommended.
      </p>
    </div>
  )
}

function CalculatorSection({ onTransfer }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionH2}>HVAC Load Calculator</h2>
      <p>
        A quick rule-of-thumb cooling load estimator. Plug in the basics about a home and get a ballpark BTU and tonnage figure. It's not a replacement for a real Manual J — but it's a fast sanity check before you walk into a sales call or quote a replacement.
      </p>
      <LoadCalculator onTransfer={onTransfer} />
    </section>
  )
}

function DuctDesignerSection({ initialEquipment }) {
  return (
    <section className={styles.sectionFlush}>
      <DuctDesigner initialEquipment={initialEquipment} />
    </section>
  )
}

function ReverseDuctSection() {
  return (
    <section className={styles.sectionFlush}>
      <ReverseDuct />
    </section>
  )
}

function SuperheatSection() {
  return (
    <section className={styles.sectionFlush}>
      <SuperheatCalc />
    </section>
  )
}

function EnergySavingsSection() {
  return (
    <section className={styles.sectionFlush}>
      <EnergySavingsCalc />
    </section>
  )
}

export default function Resources() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
  const [openKey, setOpenKey] = useState(null)
  const expandedRef = useRef(null)
  const [ductEquipment, setDuctEquipment] = useState(null)

  const handleBoxClick = (key) => {
    setOpenKey((current) => (current === key ? null : key))
  }

  const handleClose = () => {
    setOpenKey(null)
  }

  const handleTransferToDuct = (equipment) => {
    setDuctEquipment(equipment)
    setOpenKey('duct-designer')
  }

  useEffect(() => {
    if (openKey && expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [openKey])

  const renderSection = () => {
    if (openKey === 'calculator') {
      return <CalculatorSection onTransfer={handleTransferToDuct} />
    }
    if (openKey === 'duct-designer') {
      return <DuctDesignerSection initialEquipment={ductEquipment} />
    }
    if (openKey === 'reverse-duct') {
      return <ReverseDuctSection />
    }
    if (openKey === 'superheat') {
      return <SuperheatSection />
    }
    if (openKey === 'energy-savings') {
      return <EnergySavingsSection />
    }
    return null
  }

  return (
    <>
      <Helmet>
        <title>Resources | HVAC Sales Master</title>
        <meta name="description" content="Free HVAC calculators for load sizing, duct design, superheat and subcooling, and energy savings. Built for techs in the field." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Resources | HVAC Sales Master" />
        <meta property="og:description" content="Free HVAC calculators for load sizing, duct design, superheat and subcooling, and energy savings. Built for techs in the field." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
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

          <img src={sectionAccentResources} alt="" role="presentation" className={styles.sectionAccent} />

          <div className={styles.boxGrid}>
            {[
              { key: 'calculator', path: '/resources/hvac-load-calculator', title: 'HVAC Load Calculator', desc: 'Estimate cooling load and equipment size', subtitle: 'Estimate system size', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 14.5L16 6L26 14.5" stroke="#0e2340" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 13.5V25H23V13.5" stroke="#0e2340" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.5 18A4.5 4.5 0 0 1 21 16.2" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M20.5 16L20.8 13.8" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M20.5 16L18.2 15.9" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/></svg>) },
              { key: 'duct-designer', path: '/resources/duct-design-calculator', title: 'Duct Design Calculator', desc: 'Size supply and return ductwork for any house', subtitle: 'Design the airflow', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 16H18" stroke="#0e2340" strokeWidth="1.75" strokeLinecap="round"/><path d="M18 16L24 10" stroke="#0e2340" strokeWidth="1.75" strokeLinecap="round"/><path d="M18 16L24 22" stroke="#0e2340" strokeWidth="1.75" strokeLinecap="round"/><path d="M24 10H27" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M24 22H27" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M10 12V20" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/></svg>) },
              { key: 'reverse-duct', path: '/resources/reverse-duct-calculator', title: 'Reverse Duct Calculator', desc: 'Already have ducts? Find out how much airflow they can handle', subtitle: 'Verify duct capacity', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M10 10H20C23.314 10 26 12.686 26 16C26 19.314 23.314 22 20 22H10" stroke="#0e2340" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 10L13 7" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M10 10L13 13" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M10 22L7 19" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M10 22L7 25" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/></svg>) },
              { key: 'superheat', path: '/resources/superheat-subcooling-calculator', title: 'Superheat & Subcooling', desc: 'Check if the system is properly charged with superheat and subcooling calculations', subtitle: 'Verify the charge', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 9V21" stroke="#0e2340" strokeWidth="1.75" strokeLinecap="round"/><circle cx="16" cy="24" r="3.5" stroke="#0e2340" strokeWidth="1.75"/><path d="M20 12H23" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M20 16H24.5" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M20 20H23" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M12 16H8" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/></svg>) },
              { key: 'energy-savings', path: '/resources/energy-savings-calculator', title: 'Energy Savings Calculator', desc: 'Show homeowners how much they\'ll save by upgrading to a higher SEER system', subtitle: 'Compare efficiency', icon: (<svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M7 24V12H12V24" stroke="#0e2340" strokeWidth="1.75" strokeLinejoin="round"/><path d="M20 24V16H25V24" stroke="#0e2340" strokeWidth="1.75" strokeLinejoin="round"/><path d="M9.5 10.5H22.5" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M22.5 10.5L19.8 7.8" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/><path d="M22.5 10.5L19.8 13.2" stroke="#4a9fe5" strokeWidth="1.75" strokeLinecap="round"/></svg>) },
            ].map((s) => {
              const isActive = openKey === s.key
              return (
                <button
                  key={s.key}
                  type="button"
                  className={`${styles.box} ${isActive ? styles.boxActive : ''}`}
                  onClick={() => handleBoxClick(s.key)}
                  aria-expanded={isActive}
                >
                  <span className={styles.boxTitleRow}>
                    <span className={styles.boxTitle}>{s.title}</span>
                    {s.icon}
                  </span>
                  {s.subtitle && <span className={styles.boxSubtitle}>{s.subtitle}</span>}
                  <span className={styles.boxDesc}>{s.desc}</span>
                  <Link to={s.path} className={styles.boxLink} onClick={(e) => e.stopPropagation()}>Open full page →</Link>
                </button>
              )
            })}
          </div>

          {openKey && (
            <div className={styles.expanded} ref={expandedRef}>
              <button type="button" onClick={handleClose} className={styles.backLink}>
                ← Back to Resources
              </button>
              {renderSection()}
            </div>
          )}

          <p className={styles.dinoRec}>
            One more thing — if your website still has a "contact us for a free estimate" form, check out <a href="https://www.dinoquote.com" target="_blank" rel="noopener noreferrer" className={styles.dinoLink}>Dino Quote</a>. Here's how it works: instead of a contact form, you embed their quoting tool right on your site. A homeowner shows up, answers a few quick questions — square footage, what system they have now, what they care about — and Dino Quote instantly generates three good-better-best options with your actual products, your pricing, and installed costs. They can see energy savings, compare systems side by side, and basically sell themselves before you ever pick up the phone. The leads come straight to you through email, text, or right into your CRM if you're running ServiceTitan, Housecall Pro, Jobber, whatever. And it tracks where every lead came from and whether it turned into an actual job, so you can see what's making you money and what's not. It's plug-and-play — works on any website. We've been using it and it's been one of the better moves we've made.
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
