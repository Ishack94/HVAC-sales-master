import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  getBrandFamiliesIndex,
  getBrandFamily,
  identifyPlatformByModelNumber,
  findPlatform,
  findCode,
  getCrossGenerationConflict,
} from '../data/fault-codes/loader';
import styles from './FaultCodeLookup.module.css';

/* ── helpers ─────────────────────────────────────────────────── */

const SEVERITY_CONFIG = {
  informational: { level: 1, label: 'Informational', sub: 'No action needed', color: 'var(--sev-info)' },
  service_soon: { level: 2, label: 'Service Soon', sub: 'Schedule repair', color: 'var(--sev-soon)' },
  urgent: { level: 3, label: 'Urgent', sub: 'Fix now', color: 'var(--sev-urgent)' },
  safety_critical: { level: 4, label: 'Safety Critical', sub: 'Immediate concern', color: 'var(--sev-critical)' },
};

const DEEPER_DETAIL_LABELS = {
  public_manual: 'Full detail in OEM manual',
  contractor_app: 'Deep detail in contractor app',
  wall_control_partial: 'Deeper detail on wall control',
  dealer_library: 'Detail in dealer portal',
  none: null,
  unknown: null,
};

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const RECENT_KEY = 'hvac-fcl-recent-v1';
const MAX_RECENT = 5;

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
  catch { return []; }
}

function saveRecent(entry) {
  try {
    let recent = getRecent();
    recent = recent.filter(r => r.code_id !== entry.code_id);
    recent.unshift(entry);
    if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch {}
}

function clearRecent() {
  try { localStorage.removeItem(RECENT_KEY); } catch {}
}

const BASE = '/troubleshoot/codes';

/* ── sub-components ──────────────────────────────────────────── */

function Breadcrumb({ items, onNavigate }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <button type="button" onClick={() => onNavigate('brands')} className={styles.crumbLink}>
        All brands
      </button>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className={styles.crumbSep} aria-hidden="true">/</span>
          <button type="button" onClick={() => onNavigate(item.screen)} className={styles.crumbLink}>
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

function Thermometer({ severity }) {
  const fillRef = useRef(null);
  const bulbRef = useRef(null);
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.informational;
  const pct = (cfg.level / 4) * 100;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (fillRef.current) fillRef.current.style.height = pct + '%';
      if (bulbRef.current) bulbRef.current.style.background = cfg.color;
    });
    return () => cancelAnimationFrame(frame);
  }, [severity, pct, cfg.color]);

  return (
    <div className={styles.thermometerWrap}>
      <div className={styles.thermometer} role="img" aria-label={cfg.label + ' severity, level ' + cfg.level + ' of 4'}>
        <div className={styles.thermTube}>
          <div ref={fillRef} className={styles.thermFill} style={{ height: 0 }} />
        </div>
        <div ref={bulbRef} className={styles.thermBulb} style={{ background: SEVERITY_CONFIG.informational.color }} />
        <div className={styles.thermTicks} aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={cfg.level >= n ? `${styles.thermTick} ${styles.active}` : styles.thermTick} />
          ))}
        </div>
      </div>
      <div className={styles.severityLabel}>
        <div className={styles.severityLevel}>{cfg.label}</div>
        <div className={styles.severitySub}>{cfg.sub}</div>
      </div>
    </div>
  );
}

function RecentlyViewed({ onSelect }) {
  const [recent, setRecent] = useState(() => getRecent());
  if (!recent.length) return null;

  const handleClear = () => {
    clearRecent();
    setRecent([]);
  };

  return (
    <div className={styles.recentSection}>
      <div className={styles.recentHeader}>
        <span className={styles.label} style={{ marginBottom: 0 }}>Recently viewed</span>
        <button type="button" onClick={handleClear} className={styles.clearLink}>Clear</button>
      </div>
      <div className={styles.recentList}>
        {recent.map((r) => (
          <button key={r.code_id} type="button" className={styles.recentItem} onClick={() => onSelect(r)}>
            <div className={styles.recentCode}>{r.code_identifier}</div>
            <div className={styles.recentDetail}>
              <div className={styles.recentBrand}>{r.brand_family_name}</div>
              <div className={styles.recentMeaning}>{(r.meaning || '').slice(0, 80)}{(r.meaning || '').length > 80 ? '\u2026' : ''}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BrandGrid({ brandFamilies, onSelect, onOpenCamera }) {
  const families = brandFamilies.brand_families.filter((f) => f.status === 'normalized');
  return (
    <>
      <div className={styles.label}>Select equipment brand</div>
      <div className={styles.brandGrid}>
        {families.map((f, idx) => (
          <button
            key={f.brand_family_id}
            type="button"
            onClick={() => onSelect(f.brand_family_id)}
            className={styles.brandTile}
            aria-label={`${f.brand_family_name}, ${f.record_count} codes, press ${idx + 1}`}
          >
            <div className={styles.brandShortcut}>{idx + 1}</div>
            <div className={styles.brandName}>{f.brand_family_name}</div>
            <div className={styles.brandCount}>{f.record_count} codes</div>
          </button>
        ))}
      </div>
      <div className={styles.datasetTotal}>
        {brandFamilies.total_normalized_records} codes &middot; {families.length} brand families
      </div>
      <div className={styles.crossLinks}>
        <button type="button" className={styles.crossLinkBtn} onClick={() => onOpenCamera('nameplate')}>
          <div className={styles.crossLinkTitle}>Scan to fill: nameplate</div>
          <div className={styles.crossLinkDesc}>Use your camera to identify brand, model, and platform</div>
        </button>
        <Link to="/troubleshoot/symptom" className={styles.crossLinkBtn}>
          <div className={styles.crossLinkTitle}>No code? Start from a symptom</div>
          <div className={styles.crossLinkDesc}>Route from a customer complaint to the right diagnostic flow</div>
        </Link>
      </div>
    </>
  );
}

function ModelInput({ family, onPlatformSelected, onVisualFallback, onNavigate, onOpenCamera }) {
  const [value, setValue] = useState('');
  const [match, setMatch] = useState(null);
  const [helper, setHelper] = useState('Type to identify the platform automatically');
  const [helperClass, setHelperClass] = useState('');
  const inputRef = useRef(null);
  const routeTimerRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    const cleaned = val.trim().toUpperCase().replace(/[^A-Z0-9*-]/g, '');
    if (cleaned.length < 2) {
      setMatch(null);
      setHelper('Type to identify the platform automatically');
      setHelperClass('');
      clearTimeout(routeTimerRef.current);
      return;
    }

    let best = null;
    let bestLen = 0;
    for (const p of family.platforms) {
      for (const prefix of p.model_number_prefixes || []) {
        const cp = prefix.toUpperCase().replace(/[^A-Z0-9*-]/g, '');
        if (cleaned.startsWith(cp) && cp.length > bestLen) {
          best = p;
          bestLen = cp.length;
        }
      }
    }

    if (best) {
      setMatch(best);
      setHelper(`Recognized \u2014 ${best.platform_name}`);
      setHelperClass(styles.matchSuccess);
      clearTimeout(routeTimerRef.current);
      routeTimerRef.current = setTimeout(() => onPlatformSelected(best), 900);
    } else {
      setMatch(null);
      setHelper('No match yet \u2014 keep typing, or identify by what you see');
      setHelperClass('');
      clearTimeout(routeTimerRef.current);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ screen: 'model', label: family.brand_family_name }]} onNavigate={onNavigate} />
      <label className={styles.inputLabel} htmlFor="model-input">What model number do you have?</label>
      <input
        ref={inputRef} id="model-input" type="text" className={styles.inputField}
        placeholder="Enter model number" value={value} onChange={handleChange}
        autoComplete="off" autoCorrect="off" autoCapitalize="characters" spellCheck={false}
      />
      <div className={`${styles.inputHelper} ${helperClass}`}>{helper}</div>
      <div className={styles.inputActions}>
        <button type="button" onClick={onVisualFallback} className={styles.altLink}>
          Can't read the model number? Identify by what you see &rarr;
        </button>
        <button type="button" onClick={() => onOpenCamera('nameplate')} className={styles.altLink}>
          Scan to fill &rarr;
        </button>
      </div>
    </>
  );
}

function VisualPicker({ family, onPlatformSelected, onNavigate }) {
  return (
    <>
      <Breadcrumb
        items={[
          { screen: 'model', label: family.brand_family_name },
          { screen: 'visual', label: 'Identify by sight' },
        ]}
        onNavigate={onNavigate}
      />
      <div className={styles.inputLabel} style={{ marginBottom: 8 }}>What do you see on the equipment?</div>
      <div className={styles.label} style={{ marginBottom: 24 }}>Pick the display or indicator that matches</div>
      <div className={styles.visualOptions}>
        {family.platforms.map((p) => (
          <button key={p.platform_id} type="button" onClick={() => onPlatformSelected(p)} className={styles.visualOption}>
            <div className={styles.visualOptionTitle}>{p.platform_name}</div>
            <div className={styles.visualOptionDesc}>
              {(p.visual_identification || p.platform_description || '').slice(0, 220)}
              {(p.visual_identification || p.platform_description || '').length > 220 ? '\u2026' : ''}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function CodeInput({ family, platform, onCodeSelected, onNavigate, onOpenCamera, prefill, onPrefillConsumed }) {
  const [value, setValue] = useState('');
  const [helper, setHelper] = useState(`${platform.codes.length} codes on this platform`);
  const [helperIsSuggestions, setHelperIsSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (prefill) {
      setValue(prefill);
      if (onPrefillConsumed) onPrefillConsumed();
      if (inputRef.current) inputRef.current.focus();
    }
  }, [prefill, onPrefillConsumed]);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      setHelper(`${platform.codes.length} codes on this platform`);
      setHelperIsSuggestions(false);
      setSuggestions([]);
      return;
    }

    const normalized = trimmed.replace(/[.\-\s]/g, '');
    const exact = platform.codes.find((c) => {
      const id = c.code_identifier.toLowerCase();
      const cid = c.code_id.toLowerCase();
      return id === trimmed || cid === trimmed || id.replace(/[.\-\s]/g, '') === normalized || cid.replace(/[.\-\s]/g, '') === normalized;
    });

    if (exact) { onCodeSelected(exact); return; }

    const partials = platform.codes.filter((c) => {
      const id = c.code_identifier.toLowerCase();
      return id.includes(trimmed) || c.code_id.toLowerCase().includes(trimmed);
    });

    if (partials.length === 0) {
      setHelper('No matches \u2014 check the code format');
      setHelperIsSuggestions(false);
      setSuggestions([]);
    } else if (partials.length <= 6) {
      setHelper(`${partials.length} possible match${partials.length > 1 ? 'es' : ''}:`);
      setHelperIsSuggestions(true);
      setSuggestions(partials);
    } else {
      setHelper(`${partials.length} codes match \u2014 keep typing`);
      setHelperIsSuggestions(false);
      setSuggestions([]);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { screen: 'model', label: family.brand_family_name },
          { screen: 'code', label: platform.platform_name },
        ]}
        onNavigate={onNavigate}
      />
      <label className={styles.inputLabel} htmlFor="code-input">What code do you see?</label>
      <input
        ref={inputRef} id="code-input" type="text" className={styles.inputField}
        placeholder="Enter the code as shown on the display" value={value} onChange={handleChange}
        autoComplete="off" autoCorrect="off" spellCheck={false}
      />
      <div className={styles.inputHelper}>
        {helper}
        {helperIsSuggestions && (
          <div className={styles.suggestions}>
            {suggestions.map((s) => (
              <button key={s.code_id} type="button" onClick={() => onCodeSelected(s)} className={styles.suggestionChip}>
                {s.code_identifier}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.inputActions}>
        <button type="button" onClick={() => onOpenCamera('display')} className={styles.altLink}>
          Scan to fill: display code &rarr;
        </button>
      </div>
    </>
  );
}

function SubcodeRetrievalPanel({ platform }) {
  const proc = platform.subcode_retrieval_procedure;
  if (!proc) return null;
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
  );
}

function AppOnlyNote({ platform }) {
  if (platform.deeper_detail_in !== 'contractor_app' || platform.subcode_retrieval_procedure) return null;
  let appName = 'the manufacturer\u2019s contractor app';
  if (platform.platform_id.startsWith('trane_')) appName = 'the Trane Technician app';
  else if (platform.platform_id.startsWith('rheem_ruud_premium')) appName = 'the Rheem Contractor App (QR code on equipment)';
  return (
    <div className={styles.appNote}>
      <div className={styles.appNoteLabel}>Deeper detail available</div>
      <div className={styles.appNoteText}>
        The manufacturer has pushed full per-code troubleshooting trees into {appName}. Use the app for subcode detail beyond what's shown here.
      </div>
    </div>
  );
}

function FieldQuirksAccordion({ family }) {
  const [open, setOpen] = useState(false);
  const quirks = family.field_quirks;
  if (!quirks || !quirks.length) return null;

  return (
    <div className={styles.quirksPanel}>
      <button type="button" className={styles.quirksToggle} onClick={() => setOpen(!open)}>
        <span className={styles.quirksLabel}>Platform field notes</span>
        <span className={styles.quirksCount}>{quirks.length} expert note{quirks.length !== 1 ? 's' : ''}</span>
        <span className={styles.quirksArrow}>{open ? '\u25B2' : '\u25BC'}</span>
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
  );
}

function CameraScanner({ mode, onResult, onClose }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('scanning');
    setError(null);
    setResult(null);

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/ocr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mode }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
      setStatus('done');
    } catch (err) {
      setError(err.message || 'Scan failed');
      setStatus('error');
    }
  };

  return (
    <div className={styles.cameraModal} onClick={onClose}>
      <div className={styles.cameraCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.cameraHeader}>
          <div className={styles.cameraTitle}>
            {mode === 'nameplate' ? 'Scan to fill: nameplate' : 'Scan to fill: display code'}
          </div>
          <button type="button" className={styles.cameraClose} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.cameraHint}>
          {mode === 'nameplate'
            ? 'Point your camera at the equipment data plate showing brand, model, and serial number.'
            : 'Point your camera at the control board display, LED pattern, or 7-segment readout.'}
        </div>

        <input ref={fileRef} type="file" accept="image/*" capture="environment" className={styles.hiddenInput} onChange={handleFile} />

        {status === 'idle' && (
          <>
            {mode === 'display' && (
              <div className={styles.cameraHint}>
                Photos can't count LED blinks. For single-LED flash-count codes (e.g. "3 blinks"), use manual entry instead.
              </div>
            )}
            <button type="button" className={styles.cameraBtn} onClick={() => fileRef.current?.click()}>
              Open camera
            </button>
            <button type="button" className={styles.cameraBtnSecondary}
              onClick={() => { fileRef.current?.removeAttribute('capture'); fileRef.current?.click(); }}>
              Upload from gallery
            </button>
            <div className={styles.cameraHint}>
              Scanned values may need verification. Double-check before parts ordering or warranty submission.
            </div>
          </>
        )}

        {status === 'scanning' && (
          <div className={styles.cameraStatus}>
            <div className={styles.cameraSpinner} />
            Analyzing image...
          </div>
        )}

        {status === 'error' && (
          <div className={styles.cameraError}>
            {error}
            <button type="button" className={styles.cameraBtnSecondary} onClick={() => { setStatus('idle'); setError(null); }}>
              Try another photo
            </button>
          </div>
        )}

        {status === 'done' && result && (
          <div className={styles.cameraResult}>
            {mode === 'nameplate' && (
              <>
                {result.brand && <div className={styles.cameraResultRow}><span className={styles.cameraResultLabel}>Brand</span> {result.brand}</div>}
                {result.model && <div className={styles.cameraResultRow}><span className={styles.cameraResultLabel}>Model</span> {result.model}</div>}
                {result.serial && <div className={styles.cameraResultRow}><span className={styles.cameraResultLabel}>Serial</span> {result.serial}</div>}
              </>
            )}
            {mode === 'display' && (
              <>
                {result.code && <div className={styles.cameraResultRow}><span className={styles.cameraResultLabel}>Code</span> {result.code}</div>}
                {result.display_type && <div className={styles.cameraResultRow}><span className={styles.cameraResultLabel}>Display type</span> {result.display_type}</div>}
              </>
            )}
            {result.confidence && <div className={styles.cameraConfidence}>Confidence: {result.confidence}</div>}
            <button type="button" className={styles.cameraBtn} onClick={() => onResult(result)}>
              Use this result
            </button>
            <button type="button" className={styles.cameraBtnSecondary} onClick={() => { setStatus('idle'); setResult(null); }}>
              Try another photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ family, platform, code, onLookupAnother, onChangeBrand, shareUrl }) {
  const conflict = getCrossGenerationConflict(family.brand_family_id, code.code_identifier);
  const [copyStatus, setCopyStatus] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    saveRecent({
      code_id: code.code_id,
      code_identifier: code.code_identifier,
      meaning: code.meaning,
      brand_family_id: family.brand_family_id,
      brand_family_name: family.brand_family_name,
      platform_id: platform.platform_id,
    });
  }, [code.code_id, code.code_identifier, code.meaning, family.brand_family_id, family.brand_family_name, platform.platform_id]);

  const handleCopy = async () => {
    const text = [
      `${code.code_identifier} \u2014 ${code.meaning}`,
      '',
      `Brand: ${family.brand_family_name}`,
      `Platform: ${platform.platform_name}`,
      '',
      'This code typically points to:',
      ...code.root_causes.map((c) => `  \u2022 ${c}`),
      '',
      'Next checks to confirm:',
      ...code.diagnostic_path.map((s, i) => `  ${i + 1}. ${s}`),
      '',
      `Escalation: ${code.escalation}`,
      `Reset: ${code.reset_behavior}`,
      '',
      `Source: ${code.source}`,
      '',
      `via hvacsalesmaster.com${shareUrl}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch {
      setCopyStatus('Copy failed');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://www.hvacsalesmaster.com${shareUrl}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {}
  };

  return (
    <>
      <Breadcrumb
        items={[
          { screen: 'model', label: family.brand_family_name },
          { screen: 'code', label: platform.platform_name },
          { screen: 'result', label: code.code_identifier },
        ]}
        onNavigate={(screen) => {
          if (screen === 'code') onLookupAnother();
          else if (screen === 'brands') onChangeBrand();
          else if (screen === 'model') onLookupAnother();
        }}
      />
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
          <div className={styles.conflictLabel}>{'\u26A0'} Cross-generation conflict</div>
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
        <button type="button" className={styles.btnPrimary} onClick={onLookupAnother}>Look up another code</button>
        <button type="button" className={styles.btnSecondary} onClick={handleCopy}>{copyStatus || 'Copy result'}</button>
        <button type="button" className={styles.btnSecondary} onClick={handleShareLink}>{shareCopied ? 'Link copied!' : 'Copy share link'}</button>
        <button type="button" className={styles.btnSecondary} onClick={onChangeBrand}>Change brand</button>
      </div>
    </>
  );
}

/* ── main component ──────────────────────────────────────────── */

export default function FaultCodeLookup() {
  const location = useLocation();
  const nav = useNavigate();
  const [brandFamilies, setBrandFamilies] = useState(null);
  const [screen, setScreen] = useState('brands');
  const [currentFamily, setCurrentFamily] = useState(null);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [currentCode, setCurrentCode] = useState(null);
  const [cameraMode, setCameraMode] = useState(null);
  const [error, setError] = useState(null);
  const initialSyncDone = useRef(false);

  useEffect(() => {
    try {
      const idx = getBrandFamiliesIndex();
      setBrandFamilies(idx);
    } catch (e) {
      setError(e.message || 'Failed to load dataset');
    }
  }, []);

  // V3: URL → state sync on mount and back/forward navigation
  useEffect(() => {
    if (!brandFamilies) return;
    const segments = location.pathname.replace(BASE, '').split('/').filter(Boolean);
    if (!segments.length) {
      if (initialSyncDone.current) return;
      initialSyncDone.current = true;
      return;
    }

    const [brandId, platformId, codeSlug] = segments;

    const fam = getBrandFamily(brandId);
    if (!fam) { initialSyncDone.current = true; return; }

    setCurrentFamily(fam);

    if (!platformId) {
      setScreen('model');
      setCurrentPlatform(null);
      setCurrentCode(null);
      initialSyncDone.current = true;
      return;
    }

    const plat = fam.platforms.find(p => p.platform_id === platformId);
    if (!plat) { setScreen('model'); initialSyncDone.current = true; return; }

    setCurrentPlatform(plat);

    if (!codeSlug) {
      setScreen('code');
      setCurrentCode(null);
      initialSyncDone.current = true;
      return;
    }

    const normalizedSlug = codeSlug.toLowerCase();
    const code = plat.codes.find(c => slugify(c.code_id) === normalizedSlug || slugify(c.code_identifier) === normalizedSlug);
    if (code) {
      setCurrentCode(code);
      setScreen('result');
    } else {
      setScreen('code');
    }
    initialSyncDone.current = true;
  }, [location.pathname, brandFamilies]);

  const goBrands = useCallback(() => {
    setScreen('brands');
    setCurrentFamily(null);
    setCurrentPlatform(null);
    setCurrentCode(null);
    nav(BASE, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nav]);

  const selectBrand = useCallback((brandFamilyId) => {
    const fam = getBrandFamily(brandFamilyId);
    if (!fam) return;
    setCurrentFamily(fam);
    setCurrentPlatform(null);
    setCurrentCode(null);
    setScreen('model');
    nav(`${BASE}/${brandFamilyId}`, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nav]);

  const selectPlatform = useCallback((platform) => {
    setCurrentPlatform(platform);
    setCurrentCode(null);
    setScreen('code');
    if (currentFamily) {
      nav(`${BASE}/${currentFamily.brand_family_id}/${platform.platform_id}`, { replace: false });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nav, currentFamily]);

  const selectCode = useCallback((code) => {
    setCurrentCode(code);
    setScreen('result');
    if (currentFamily && currentPlatform) {
      nav(`${BASE}/${currentFamily.brand_family_id}/${currentPlatform.platform_id}/${slugify(code.code_id)}`, { replace: false });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nav, currentFamily, currentPlatform]);

  const handleNavigate = useCallback((target) => {
    if (target === 'brands') goBrands();
    else if (target === 'model') {
      setScreen('model');
      setCurrentPlatform(null);
      setCurrentCode(null);
      if (currentFamily) nav(`${BASE}/${currentFamily.brand_family_id}`, { replace: false });
    } else if (target === 'visual') setScreen('visual');
    else if (target === 'code') {
      setScreen('code');
      setCurrentCode(null);
      if (currentFamily && currentPlatform) {
        nav(`${BASE}/${currentFamily.brand_family_id}/${currentPlatform.platform_id}`, { replace: false });
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [goBrands, nav, currentFamily, currentPlatform]);

  const handleRecentSelect = useCallback((recent) => {
    const fam = getBrandFamily(recent.brand_family_id);
    if (!fam) return;
    const plat = fam.platforms.find(p => p.platform_id === recent.platform_id);
    if (!plat) return;
    const code = plat.codes.find(c => c.code_id === recent.code_id);
    if (!code) return;
    setCurrentFamily(fam);
    setCurrentPlatform(plat);
    setCurrentCode(code);
    setScreen('result');
    nav(`${BASE}/${fam.brand_family_id}/${plat.platform_id}/${slugify(code.code_id)}`, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [nav]);

  const [ocrCodePrefill, setOcrCodePrefill] = useState(null);

  const handleCameraResult = useCallback((result) => {
    setCameraMode(null);
    if (!result) return;

    // Nameplate mode — set brand/platform but require user to confirm via normal flow
    if (result.brand_family_id) {
      const fam = getBrandFamily(result.brand_family_id);
      if (fam) {
        setCurrentFamily(fam);
        setCurrentPlatform(null);
        setCurrentCode(null);
        setScreen('model');
        nav(`${BASE}/${fam.brand_family_id}`, { replace: false });
        return;
      }
    }

    // Display mode — prefill the code input, never auto-select
    if (result.code) {
      setOcrCodePrefill(result.code.trim());
    }
  }, [nav]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape') {
        if (cameraMode) { setCameraMode(null); return; }
        if (screen === 'result') handleNavigate('code');
        else if (screen === 'code') handleNavigate('model');
        else if (screen === 'visual') handleNavigate('model');
        else if (screen === 'model') goBrands();
      }
      if (screen === 'brands' && brandFamilies) {
        const keyNum = parseInt(e.key, 10);
        if (keyNum >= 1 && keyNum <= 9) {
          const families = brandFamilies.brand_families.filter((f) => f.status === 'normalized');
          if (families[keyNum - 1]) selectBrand(families[keyNum - 1].brand_family_id);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, brandFamilies, handleNavigate, goBrands, selectBrand, cameraMode]);

  const shareUrl = currentFamily && currentPlatform && currentCode
    ? `${BASE}/${currentFamily.brand_family_id}/${currentPlatform.platform_id}/${slugify(currentCode.code_id)}`
    : BASE;

  if (error) {
    return (
      <div className={styles.page}><div className={styles.container}>
        <div className={styles.loadingError}>Unable to load fault code dataset: {error}</div>
      </div></div>
    );
  }

  if (!brandFamilies) {
    return (
      <div className={styles.page}><div className={styles.container}>
        <div className={styles.loading}>Loading\u2026</div>
      </div></div>
    );
  }

  // SEO meta — varies by screen
  const SITE = 'https://www.hvacsalesmaster.com';
  let seoTitle = 'Fault Code Lookup \u2014 735 HVAC Codes from 7 Brand Families | HVAC Sales Master';
  let seoDesc = 'Look up HVAC fault codes from Carrier, Trane, Lennox, Goodman, Rheem, York/Bosch, and Nordyne. 735 OEM-cited codes with root causes, diagnostic steps, and reset procedures for residential techs.';
  let seoCanonical = `${SITE}/troubleshoot/codes`;
  let seoOgType = 'website';
  let seoJsonLd = null;

  if (screen === 'model' && currentFamily) {
    const brandNames = (currentFamily.brands || []).map(b => typeof b === 'string' ? b : b.name).slice(0, 5).join(', ');
    seoTitle = `${currentFamily.brand_family_name} Fault Codes \u2014 ${currentFamily.platforms?.reduce((s, p) => s + p.codes.length, 0) || ''} Codes | HVAC Sales Master`;
    seoDesc = `Full list of ${currentFamily.brand_family_name} fault codes with meanings, root causes, and diagnostic steps. Covers ${brandNames}. Free contractor tool.`;
    seoCanonical = `${SITE}/troubleshoot/codes/${currentFamily.brand_family_id}`;
  } else if ((screen === 'code' || screen === 'visual') && currentFamily && currentPlatform) {
    seoTitle = `${currentPlatform.platform_name} Fault Codes \u2014 ${currentPlatform.codes.length} Codes | HVAC Sales Master`;
    seoDesc = `Fault code lookup for ${currentPlatform.platform_name}. Meanings, diagnostic paths, and reset procedures.`;
    seoCanonical = `${SITE}/troubleshoot/codes/${currentFamily.brand_family_id}/${currentPlatform.platform_id}`;
  } else if (screen === 'result' && currentFamily && currentPlatform && currentCode) {
    const shortBrand = currentFamily.brand_family_name.split(' /')[0];
    seoTitle = `${shortBrand} ${currentCode.code_identifier} Fault Code \u2014 ${currentCode.meaning} | HVAC Sales Master`;
    seoDesc = `${currentCode.code_identifier} on ${currentPlatform.platform_name}: ${currentCode.meaning}. Root causes, diagnostic steps, and reset procedure. Severity: ${currentCode.severity.replace(/_/g, ' ')}.`;
    seoCanonical = `${SITE}${shareUrl}`;
    seoOgType = 'article';
    seoJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `${shortBrand} ${currentCode.code_identifier} \u2014 ${currentCode.meaning}`,
      description: currentCode.meaning,
      articleSection: 'HVAC Fault Codes',
      about: { '@type': 'Thing', name: `${currentPlatform.platform_name} fault code ${currentCode.code_identifier}` },
      mainEntity: {
        '@type': 'HowTo',
        name: `How to diagnose ${shortBrand} ${currentCode.code_identifier}`,
        step: currentCode.diagnostic_path.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
      },
      publisher: { '@type': 'Organization', name: 'HVAC Sales Master', url: SITE },
      url: seoCanonical,
    };
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Helmet>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDesc} />
          <link rel="canonical" href={seoCanonical} />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDesc} />
          <meta property="og:url" content={seoCanonical} />
          <meta property="og:type" content={seoOgType} />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDesc} />
          {seoJsonLd && (
            <script type="application/ld+json">{JSON.stringify(seoJsonLd)}</script>
          )}
        </Helmet>
        <header className={styles.header}>
          <h1 className={styles.title}>Fault Code Lookup</h1>
          <div className={styles.subhead}>HVAC Sales Master</div>
        </header>

        {screen === 'brands' && (
          <>
            <RecentlyViewed onSelect={handleRecentSelect} />
            <BrandGrid brandFamilies={brandFamilies} onSelect={selectBrand} onOpenCamera={setCameraMode} />
          </>
        )}
        {screen === 'model' && currentFamily && (
          <ModelInput family={currentFamily} onPlatformSelected={selectPlatform}
            onVisualFallback={() => setScreen('visual')} onNavigate={handleNavigate} onOpenCamera={setCameraMode} />
        )}
        {screen === 'visual' && currentFamily && (
          <VisualPicker family={currentFamily} onPlatformSelected={selectPlatform} onNavigate={handleNavigate} />
        )}
        {screen === 'code' && currentFamily && currentPlatform && (
          <CodeInput family={currentFamily} platform={currentPlatform}
            onCodeSelected={selectCode} onNavigate={handleNavigate} onOpenCamera={setCameraMode}
            prefill={ocrCodePrefill} onPrefillConsumed={() => setOcrCodePrefill(null)} />
        )}
        {screen === 'result' && currentFamily && currentPlatform && currentCode && (
          <ResultCard family={currentFamily} platform={currentPlatform} code={currentCode}
            onLookupAnother={() => { setCurrentCode(null); setScreen('code');
              nav(`${BASE}/${currentFamily.brand_family_id}/${currentPlatform.platform_id}`, { replace: false });
              window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onChangeBrand={goBrands} shareUrl={shareUrl} />
        )}

        {cameraMode && (
          <CameraScanner mode={cameraMode} onResult={handleCameraResult} onClose={() => setCameraMode(null)} />
        )}
      </div>
    </div>
  );
}
