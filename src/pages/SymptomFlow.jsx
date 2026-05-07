import React from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import symptomFlows from '../data/symptom-flows.json'
import styles from './SymptomFlow.module.css'

const SITE = 'https://www.hvacsalesmaster.com'

function truncate(text, max) {
  if (!text) return ''
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + '…'
}

function Breadcrumb({ label }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link to="/troubleshoot/symptom" className={styles.crumbLink}>All symptoms</Link>
      <span className={styles.crumbSep}>/</span>
      <span className={styles.crumbCurrent}>{label}</span>
    </nav>
  )
}

function FieldWarning({ text }) {
  if (!text) return null
  return (
    <div className={styles.warningBox}>
      <div className={styles.warningLabel}>Field Warning</div>
      <p className={styles.warningText}>{text}</p>
    </div>
  )
}

function CTA({ to }) {
  return (
    <div className={styles.ctaWrap}>
      <Link to={to} className={styles.ctaLink}>
        Read the full walkthrough
        <span className={styles.ctaArrow} aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

function StandardLayout({ data, canonicalUrl, ogTitle, ogDesc }) {
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.tile_label,
    description: data.quick_summary,
    step: data.diagnostic_steps.map((s) => ({
      '@type': 'HowToStep',
      position: s.step,
      name: s.action,
      text: s.rationale,
    })),
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb label={data.tile_label} />

        <header className={styles.header}>
          <h1 className={styles.title}>{data.tile_label}</h1>
          <p className={styles.summary}>{data.quick_summary}</p>
        </header>

        <section className={styles.section} aria-labelledby="causes-label">
          <div id="causes-label" className={styles.sectionLabel}>Most likely causes</div>
          <ul className={styles.causesList}>
            {data.top_causes.map((c, i) => (
              <li key={i} className={styles.causeItem}>
                <span className={styles.causeText}>{c.cause}</span>
                {c.percent_of_calls && <span className={styles.causePill}>{c.percent_of_calls}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="steps-label">
          <div id="steps-label" className={styles.sectionLabel}>Diagnostic steps</div>
          <ol className={styles.stepsList}>
            {data.diagnostic_steps.map((s) => (
              <li key={s.step} className={styles.stepItem}>
                <div className={styles.stepBadge}>{s.step}</div>
                <div className={styles.stepBody}>
                  <p className={styles.stepAction}>{s.action}</p>
                  <p className={styles.stepRationale}>{s.rationale}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="escalate-label">
          <div id="escalate-label" className={styles.sectionLabel}>When to escalate</div>
          <div className={styles.escalateBox}>
            <p className={styles.escalateText}>{data.when_to_escalate}</p>
          </div>
        </section>

        {data.field_warning && (
          <section className={styles.section}>
            <FieldWarning text={data.field_warning} />
          </section>
        )}

        <CTA to={data.linked_article_path} />
      </div>
    </div>
  )
}

function NoiseTriageLayout({ data, canonicalUrl, ogTitle, ogDesc }) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb label={data.tile_label} />

        <header className={styles.header}>
          <h1 className={styles.title}>{data.tile_label}</h1>
          <p className={styles.summary}>{data.quick_summary}</p>
        </header>

        <section className={styles.section} aria-labelledby="shutdown-label">
          <div id="shutdown-label" className={styles.sectionLabel}>Shut down for these noises</div>
          <div className={styles.noiseGrid}>
            {data.shutdown_noises.map((n, i) => (
              <article key={i} className={styles.noiseCard}>
                <h3 className={styles.noiseHeading}>{n.noise}</h3>
                <p className={styles.noiseMeans}>{n.what_it_means}</p>
                <p className={styles.noiseAction}>
                  <span className={styles.noiseActionLabel}>Action:</span>{n.action}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="benign-label">
          <div id="benign-label" className={styles.sectionLabel}>Benign noises (no action needed)</div>
          <ul className={styles.benignList}>
            {data.benign_noises.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </section>

        {data.field_warning && (
          <section className={styles.section}>
            <FieldWarning text={data.field_warning} />
          </section>
        )}

        <CTA to={data.linked_article_path} />
      </div>
    </div>
  )
}

export default function SymptomFlow({ symptomId: symptomIdProp } = {}) {
  const params = useParams()
  const symptomId = symptomIdProp ?? params.symptomId
  const location = useLocation()

  const data = symptomFlows.find((s) => s.symptom_id === symptomId)

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>Symptom not found</h1>
            <p className={styles.notFoundText}>That diagnostic flow doesn't exist.</p>
            <Link to="/troubleshoot/symptom" className={styles.notFoundLink}>← Back to symptom router</Link>
          </div>
        </div>
      </div>
    )
  }

  const canonicalUrl = `${SITE}${location.pathname}`
  const ogTitle = `${data.tile_label} — HVAC Diagnostic Quick Reference | HVAC Sales Master`
  const ogDesc = truncate(data.quick_summary, 155)

  if (data.format === 'noise_triage') {
    return <NoiseTriageLayout data={data} canonicalUrl={canonicalUrl} ogTitle={ogTitle} ogDesc={ogDesc} />
  }

  return <StandardLayout data={data} canonicalUrl={canonicalUrl} ogTitle={ogTitle} ogDesc={ogDesc} />
}
