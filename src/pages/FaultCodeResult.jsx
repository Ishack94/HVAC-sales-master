import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getCrossGenerationConflict } from '../data/fault-codes/loader'
import styles from './FaultCodeLookup.module.css'

const SEVERITY_CONFIG = {
  informational: { level: 1, label: 'Informational', sub: 'No action needed', color: 'var(--sev-info)' },
  service_soon: { level: 2, label: 'Service Soon', sub: 'Schedule repair', color: 'var(--sev-soon)' },
  urgent: { level: 3, label: 'Urgent', sub: 'Fix now', color: 'var(--sev-urgent)' },
  safety_critical: { level: 4, label: 'Safety Critical', sub: 'Immediate concern', color: 'var(--sev-critical)' },
}

const BASE = '/troubleshoot/codes'

function Thermometer({ severity }) {
  const fillRef = useRef(null)
  const bulbRef = useRef(null)
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.informational
  const pct = (cfg.level / 4) * 100

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (fillRef.current) fillRef.current.style.height = pct + '%'
      if (bulbRef.current) bulbRef.current.style.background = cfg.color
    })
    return () => cancelAnimationFrame(frame)
  }, [severity, pct, cfg.color])

  return (
    <div className={styles.thermometerWrap}>
      <div className={styles.thermometer} role="img" aria-label={cfg.label + ' severity, level ' + cfg.level + ' of 4'}>
        <div className={styles.thermTube}>
          <div ref={fillRef} className={styles.thermFill} style={{ height: 0 }} />
        </div>
        <div ref={bulbRef} className={styles.thermBulb} style={{ background: SEVERITY_CONFIG.informational.color }} />
        <div className={styles.thermTicks}>
          {[1, 2, 3, 4].map((lvl) => (
            <div key={lvl} className={`${styles.thermTick} ${lvl <= cfg.level ? styles.active : ''}`} />
          ))}
        </div>
      </div>
      <div className={styles.severityLabel}>
        <div className={styles.severityLevel}>{cfg.label}</div>
        <div className={styles.severitySub}>{cfg.sub}</div>
      </div>
    </div>
  )
}

function SubcodeRetrievalPanel({ platform }) {
  const proc = platform.subcode_retrieval_procedure
  if (!proc) return null
  return (
    <div className={styles.subcodePanel}>
      <div className={styles.subcodeLabel}>Need deeper detail?</div>
      <div className={styles.subcodeTitle}>
        {platform.subcode_required === 'likely'
          ? 'A subcode may be available for this fault.'
          : 'Retrieve the subcode for this platform:'}
      </div>
      <ol className={styles.subcodeSteps}>
        {proc.navigation_steps.map((step, i) => (<li key={i}>{step}</li>))}
      </ol>
      {proc.tool_required && (
        <div className={styles.subcodeTool}><strong>Tool required:</strong> {proc.tool_required}</div>
      )}
    </div>
  )
}

function AppOnlyNote({ platform }) {
  if (platform.deeper_detail_in !== 'contractor_app' || platform.subcode_retrieval_procedure) return null
  let appName = "the manufacturer's contractor app"
  if (platform.platform_id.startsWith('trane_')) appName = 'the Trane Technician app'
  else if (platform.platform_id.startsWith('rheem_ruud_premium')) appName = 'the Rheem Contractor App (QR code on equipment)'
  return (
    <div className={styles.appNote}>
      <div className={styles.appNoteLabel}>Deeper detail available</div>
      <div className={styles.appNoteText}>
        The manufacturer has pushed full per-code troubleshooting trees into {appName}. Use the app for subcode detail beyond what's shown here.
      </div>
    </div>
  )
}

function FieldQuirksAccordion({ family }) {
  const [open, setOpen] = useState(false)
  const quirks = family.field_quirks
  if (!quirks || !quirks.length) return null
  return (
    <div className={styles.quirksPanel}>
      <button type="button" className={styles.quirksToggle} onClick={() => setOpen(!open)}>
        <span className={styles.quirksLabel}>Platform field notes</span>
        <span className={styles.quirksCount}>{quirks.length} expert note{quirks.length !== 1 ? 's' : ''}</span>
        <span className={styles.quirksArrow}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className={styles.quirksList}>
          {quirks.map((q, i) => (
            <div key={i} className={styles.quirkItem}>
              <div className={styles.quirkTitle}>{q.title || q.quirk || 'Field note'}</div>
              {q.applies_to && <div className={styles.quirkApplies}>{q.applies_to}</div>}
              <div className={styles.quirkReason}>{q.reason || q.detail || q.description || ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FaultCodeResult({ family, platform, code }) {
  const conflict = getCrossGenerationConflict(family.brand_family_id, code.code_identifier)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Fault Code Lookup</h1>
          <div className={styles.subhead}>HVAC Sales Master</div>
        </header>

        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to={BASE} className={styles.crumbLink}>All brands</Link>
          <span className={styles.crumbSep} aria-hidden="true">/</span>
          <Link to={`${BASE}/${family.brand_family_id}`} className={styles.crumbLink}>{family.brand_family_name}</Link>
          <span className={styles.crumbSep} aria-hidden="true">/</span>
          <Link to={`${BASE}/${family.brand_family_id}/${platform.platform_id}`} className={styles.crumbLink}>{platform.platform_name}</Link>
          <span className={styles.crumbSep} aria-hidden="true">/</span>
          <span>{code.code_identifier}</span>
        </nav>

        <article className={styles.resultCard}>
          <div className={styles.resultMain}>
            <div className={styles.codeBig}>{code.code_identifier}</div>
            <div className={styles.codeMeaning}>{code.meaning}</div>

            <section className={styles.section}>
              <div className={styles.label}>This code typically points to</div>
              <ul className={styles.causesList}>
                {code.root_causes.map((c, i) => (<li key={i}>{c}</li>))}
              </ul>
            </section>

            <hr className={styles.sectionDivider} />

            <section className={styles.section}>
              <div className={styles.label}>Next checks to confirm</div>
              <ol className={styles.diagnosticList}>
                {code.diagnostic_path.map((s, i) => (<li key={i}>{s}</li>))}
              </ol>
            </section>

            <hr className={styles.sectionDivider} />

            <section className={styles.section}>
              <div className={styles.label}>Escalation</div>
              <div className={styles.bodyText}>{code.escalation}</div>
            </section>

            <section className={styles.section}>
              <div className={styles.label}>Reset behavior</div>
              <div className={styles.bodyText}>{code.reset_behavior}</div>
            </section>
          </div>

          <Thermometer severity={code.severity} />
        </article>

        {conflict && (
          <div className={styles.conflictBanner}>
            <div className={styles.conflictLabel}>{'⚠'} Cross-generation conflict</div>
            <div className={styles.conflictText}>{conflict.ui_banner_text}</div>
          </div>
        )}

        <SubcodeRetrievalPanel platform={platform} />
        <AppOnlyNote platform={platform} />
        <FieldQuirksAccordion family={family} />

        <section className={styles.section} style={{ marginTop: 40 }}>
          <div className={styles.label}>Source</div>
          <div className={styles.sourceText}>{code.source}</div>
        </section>

        <div className={styles.actionBar}>
          <Link to={BASE} className={styles.btnPrimary}>Look up another code</Link>
          <Link to={BASE} className={styles.btnSecondary}>Change brand</Link>
        </div>
      </div>
    </div>
  )
}
