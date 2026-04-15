import React, { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import ResultsPanel from '../components/Tools/ResultsPanel'
import styles from './ToolPage.module.css'

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

const inputStyle = {
  width: '100%', minHeight: '48px', padding: '11px 14px',
  fontFamily: "'Figtree', sans-serif", fontSize: '15px', color: '#1b3a5c',
  background: '#ffffff', border: '1px solid rgba(14,35,64,0.12)',
  borderRadius: '4px', outline: 'none',
}
const labelStyle = {
  fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '0.5px', color: '#1b3a5c', marginBottom: '6px', display: 'block',
}
const groupStyle = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
  paddingBottom: '1.5rem', marginBottom: '1.5rem',
  borderBottom: '1px solid rgba(14,35,64,0.06)',
}

export default function LoadCalcPage() {
  const location = useLocation()
  const canonicalUrl = `https://www.hvacsalesmaster.com${location.pathname}`
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
    const subtotal = baseBTU + w * 1000 + d * 1000 + occ * 400
    const totalBTU = subtotal * insulation * climate * sun
    const tonnage = Math.round((totalBTU / 12000) * 2) / 2
    let rangeLow = Math.floor(tonnage * 2) / 2
    let rangeHigh = Math.ceil(tonnage * 2) / 2
    if (rangeLow === rangeHigh) { rangeLow = Math.max(1.5, tonnage - 0.5); rangeHigh = tonnage }
    return { totalBTU: Math.round(totalBTU), tonnage, rangeLow, rangeHigh }
  }, [sqft, ceiling, windows, doors, occupants, insulation, climate, sun])

  const customerText = `Based on the size and characteristics of your home, you'd need approximately a ${result.tonnage.toFixed(1)}-ton system to keep it comfortable year-round. That's a ${result.totalBTU.toLocaleString()} BTU system.`

  return (
    <>
      <Helmet>
        <title>HVAC Load Calculator — Free Cooling Load Estimator | HVAC Sales Master</title>
        <meta name="description" content="Free HVAC load calculator. Estimate cooling load, BTU, tonnage, and airflow for any home. Built for techs and sales pros in the field." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="HVAC Load Calculator — Free Cooling Load Estimator | HVAC Sales Master" />
        <meta property="og:description" content="Free HVAC load calculator. Estimate cooling load, BTU, tonnage, and airflow for any home." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Banner title="HVAC Load Calculator" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources', to: '/resources' }, { label: 'Load Calculator' }]} />
      <div className={styles.layout}>
        <main className={styles.main}>
          <Link to="/resources" className={styles.backLink}>← Back to Resources</Link>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: '15px', color: '#5a6068', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic' }}>Use this on the initial visit to estimate system size before pulling a full Manual J. Enter the home's basic specs and get a recommended tonnage you can show the customer right from your phone.</p>
          <div style={{ backgroundColor: '#f5f6f8', border: '1px solid rgba(14,35,64,0.06)', borderRadius: '4px', padding: '2rem', position: 'relative' }}>
            <div style={groupStyle}>
              <label><span style={labelStyle}>Square Footage</span><input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} min="100" style={inputStyle} /></label>
              <label><span style={labelStyle}>Ceiling Height</span><select value={ceiling} onChange={(e) => setCeiling(Number(e.target.value))} style={inputStyle}>{CEILING_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}</select></label>
            </div>
            <div style={groupStyle}>
              <label><span style={labelStyle}>Number of Windows</span><input type="number" value={windows} onChange={(e) => setWindows(e.target.value)} min="0" style={inputStyle} /></label>
              <label><span style={labelStyle}>Number of Exterior Doors</span><input type="number" value={doors} onChange={(e) => setDoors(e.target.value)} min="0" style={inputStyle} /></label>
            </div>
            <div style={groupStyle}>
              <label><span style={labelStyle}>Number of Occupants</span><input type="number" value={occupants} onChange={(e) => setOccupants(e.target.value)} min="0" style={inputStyle} /></label>
              <label><span style={labelStyle}>Insulation Quality</span><select value={insulation} onChange={(e) => setInsulation(Number(e.target.value))} style={inputStyle}>{INSULATION_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}</select></label>
            </div>
            <div style={{ ...groupStyle, borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
              <label><span style={labelStyle}>Climate Zone</span><select value={climate} onChange={(e) => setClimate(Number(e.target.value))} style={inputStyle}>{CLIMATE_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}</select></label>
              <label><span style={labelStyle}>Sun Exposure</span><select value={sun} onChange={(e) => setSun(Number(e.target.value))} style={inputStyle}>{SUN_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}</select></label>
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
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
                'Undersizing risk: system may struggle on the hottest days.',
                'Oversizing risk: system will short-cycle, wasting energy and leaving humidity problems.',
                'This estimate assumes the duct system can deliver the required airflow.',
              ]}
              customerText={customerText}
              showPrint
            />
            {(() => {
              const min = result.rangeLow
              const max = result.rangeHigh
              const span = max - min || 1
              const pct = Math.min(95, Math.max(5, ((result.tonnage - min) / span) * 100))
              const inRange = result.tonnage >= min && result.tonnage <= max
              return (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ position: 'relative', height: '8px', background: '#1b3a5c', borderRadius: '4px' }}>
                    <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)', width: '16px', height: '16px', borderRadius: '50%', background: inRange ? '#4a9fe5' : '#e74c3c', border: '2px solid white' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#8a8f96', fontFamily: "'Figtree', sans-serif" }}>
                    <span>{min.toFixed(1)}</span>
                    <span>{max.toFixed(1)}</span>
                  </div>
                </div>
              )
            })()}
          </div>
          <p style={{ fontSize: '13px', color: '#8a8f96', marginTop: '16px' }}>Estimate based on Manual J residential load calculation principles. For exact sizing, a full Manual J with measured inputs is recommended.</p>
          <Link to="/resources/duct-design-calculator" style={{ fontFamily: "'Figtree', sans-serif", fontSize: '15px', fontWeight: 600, color: '#4a9fe5', textDecoration: 'none', marginTop: '12px', display: 'inline-block' }}>Next: Size your ductwork →</Link>
        </main>
        <Sidebar />
      </div>
    </>
  )
}
