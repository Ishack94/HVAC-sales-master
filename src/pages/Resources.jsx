import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Banner from '../components/Layout/Banner'
import Sidebar from '../components/Layout/Sidebar'
import Newsletter from '../components/Home/Newsletter'
import DuctDesigner from '../components/Tools/DuctDesigner'
import Ductulator from '../components/Tools/Ductulator'
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

function TrainingSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionH2}>Training &amp; Certification Resources</h2>
      <p>
        Whether you're prepping for your EPA 608 card, chasing NATE certification, or just trying to keep your skills sharp, these are the platforms worth your time. None of this is sponsored — it's just where I'd send a new tech who asked.
      </p>

      <h3 className={styles.sectionH3}>EPA 608 Certification</h3>
      <p>
        <a href="https://skillcatapp.com/epa-608-certification-online" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>SkillCat</strong></a> — Online EPA 608 for $10, 98% pass rate, proctored remotely. The cheapest legitimate path to your card.
      </p>
      <p>
        <a href="https://epatest.com" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>Mainstream Engineering</strong></a> — Free Type I training software and official testing since 2002. A trusted name in the industry.
      </p>
      <p>
        <a href="https://acca.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>ACCA EPA 608 Course</strong></a> — Affordable online prep from the industry's own contractor association.
      </p>

      <h3 className={styles.sectionH3}>NATE Certification</h3>
      <p>
        <a href="https://natex.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>NATE Official</strong></a> — The gold standard field technician certification, recognized by every major manufacturer. If you want your résumé to stand out, this is the one.
      </p>
      <p>
        <a href="https://hvacr.elearn.network" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>HVACR Learning Network</strong></a> — CEU credits, NATE prep, and manufacturer-partnered courses all under one roof.
      </p>
      <p>
        <a href="https://hvacexammaster.com" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>HVAC Exam Master</strong></a> — 1,000+ practice questions for EPA 608 and NATE. Worth running through before test day.
      </p>

      <h3 className={styles.sectionH3}>Continuing Education</h3>
      <p>
        <a href="https://ashrae.org/education" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>ASHRAE eLearning</strong></a> — Research-backed courses on energy efficiency, indoor air quality, and building systems. The nerdy-but-essential stuff.
      </p>
      <p>
        <a href="https://acca.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>ACCA ComfortU</strong></a> — On-demand training for contractors covering Manual J, sales, and business management.
      </p>
      <p>
        <a href="https://skillcatapp.com" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>SkillCat Trade School Diploma</strong></a> — A full HVAC program online, 200+ courses, IACET accredited. Solid for techs who want a structured curriculum.
      </p>
    </section>
  )
}

function ManufacturerSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionH2}>Manufacturer Technical Resources</h2>
      <p>
        Bookmark these. When you're standing in front of a 12-year-old condenser at 4 PM trying to figure out a wiring change, the manufacturer's own documentation is faster and more accurate than any forum thread. Every tech should have a folder of these in their phone.
      </p>
      <p>
        <a href="https://www.carrier.com/residential/en/us/for-professionals/" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>Carrier</strong></a> — Product literature, warranty lookup, technical support.
      </p>
      <p>
        <a href="https://www.trane.com/residential/en/for-contractors/" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>Trane</strong></a> — Manuals, registration, contractor resources.
      </p>
      <p>
        <a href="https://www.goodmanmfg.com/resources" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>Goodman</strong></a> — Literature library, warranty info, wiring diagrams.
      </p>
      <p>
        <a href="https://www.lennox.com/contractors" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>Lennox</strong></a> — Manuals, parts catalogs, technical bulletins.
      </p>
      <p>
        <a href="https://www.rheem.com/support" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>Rheem</strong></a> — Product support, installation guides, troubleshooting.
      </p>
      <p>
        <a href="https://www.yorkhvac.com/support" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>York</strong></a> — Product documents, warranty registration.
      </p>
      <p>
        <a href="https://www.ahridirectory.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>AHRI Directory</strong></a> — Certified equipment ratings and performance verification for any brand.
      </p>
      <p>
        <strong>Why AHRI matters:</strong> When you're matching a condenser to an air handler, the AHRI Directory is the only place you can verify the SEER, HSPF, and EER ratings of the actual <em>system match</em> — not just the individual components. If you're quoting efficiency to a homeowner or filing for a utility rebate, this is the source of truth.
      </p>
    </section>
  )
}

function AssociationSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionH2}>Industry Associations</h2>
      <p>
        Joining an association sounds boring until the day you need a code answer, a legal opinion, a continuing-ed credit, or a contact in another market. These groups are where the standards get written, the training gets built, and the people who run this industry actually meet each other. If you want to grow past just turning wrenches, get involved.
      </p>
      <p>
        <a href="https://www.ashrae.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>ASHRAE</strong></a> — 57,000+ members across 132 countries. Sets the standards for energy efficiency and IAQ, and publishes the ASHRAE Journal.
      </p>
      <p>
        <a href="https://www.acca.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>ACCA</strong></a> — 60,000+ professionals. Publishes the Manual J / S / D / T standards, runs a Find-A-Contractor service, and offers serious business resources for owners.
      </p>
      <p>
        <a href="https://www.natex.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>NATE</strong></a> — The leading field technician certification body, recognized by every major manufacturer and contractor.
      </p>
      <p>
        <a href="https://www.rses.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>RSES</strong></a> — The refrigeration training authority since 1933. Publishes the monthly RSES Journal and runs solid certification prep.
      </p>
      <p>
        <a href="https://www.smacna.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>SMACNA</strong></a> — Duct construction and HVAC system standards, adopted in building codes nationwide.
      </p>
      <p>
        <a href="https://nationalcomfortinstitute.com" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>NCI (National Comfort Institute)</strong></a> — Performance-based testing and balancing. The best airflow diagnostics training in the industry.
      </p>
      <p>
        <a href="https://www.phccweb.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>PHCC</strong></a> — Plumbing, Heating, Cooling Contractors Association. Strong on legislative advocacy and contractor support.
      </p>
      <p>
        <a href="https://www.ahrinet.org" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>AHRI</strong></a> — Represents equipment manufacturers and maintains the certified product directories you'll use for every install.
      </p>
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

function DuctulatorSection() {
  return (
    <section className={styles.sectionFlush}>
      <Ductulator />
    </section>
  )
}

function SoftwareToolsSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionH2}>Software &amp; Tools</h2>
      <p>
        Most HVAC design tools are either expensive desktop software or overly simplified calculators that don't help with real jobs. We're building the tools we wish we had — free, web-based, and designed for techs who actually work in the field.
      </p>

      <h3 className={styles.sectionH3}>Training</h3>
      <p>
        <a href="https://skillcatapp.com" target="_blank" rel="noopener noreferrer" className={styles.extLink}><strong>SkillCat</strong></a> — Mobile-first trade training platform with EPA 608 certification, OSHA-10, and 200+ HVAC courses. $10/month. Legit accredited training you can do from your phone between calls.
      </p>

      <h3 className={styles.sectionH3}>Built right here</h3>
      <p>
        We're building our own suite of free HVAC design tools — no signup, no paywall, no desktop software required. Use the HVAC Load Calculator, Duct Design Calculator, and Quick Ductulator above. More tools are coming.
      </p>
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
    key: 'training',
    title: 'Training & Certification',
    desc: 'EPA 608, NATE prep, and continuing education',
    Component: TrainingSection,
  },
  {
    key: 'manufacturer',
    title: 'Manufacturer Resources',
    desc: 'Technical docs from every major brand',
    Component: ManufacturerSection,
  },
  {
    key: 'associations',
    title: 'Industry Associations',
    desc: 'Professional organizations worth joining',
    Component: AssociationSection,
  },
  {
    key: 'duct-designer',
    title: 'Duct Design Calculator',
    desc: 'Size supply and return ductwork for any house',
    Component: DuctDesignerSection,
  },
  {
    key: 'software',
    title: 'Software & Tools',
    desc: 'Pro-grade design software and field apps',
    Component: SoftwareToolsSection,
  },
  {
    key: 'ductulator',
    title: 'Quick Ductulator',
    desc: 'Size any duct in seconds — round, rectangular, and velocity',
    Component: DuctulatorSection,
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
            {SECTIONS.slice(0, 6).map((s) => {
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

          <div className={styles.boxGridLastRow}>
            {SECTIONS.slice(6).map((s) => {
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
