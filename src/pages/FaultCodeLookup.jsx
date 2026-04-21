import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  getBrandFamiliesIndex,
  getBrandFamily,
  identifyPlatformByModelNumber,
  findPlatform,
  findCode,
  getCrossGenerationConflict,
} from '../data/fault-codes/loader';
import styles from './FaultCodeLookup.module.css';

/**
 * Fault Code Lookup V1
 * Path: /troubleshoot/codes
 *
 * Three-screen flow: brand → model/visual identification → code entry + result.
 * Subcode-aware: surfaces retrieval procedures for platforms requiring subcodes.
 * Keyboard shortcuts: 1-7 for brands, / to focus input, Esc to go back, Cmd+K universal.
 */

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

function Breadcrumb({ items, onNavigate }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <button type="button" onClick={() => onNavigate('brands')} className={styles.crumbLink}>
        All brands
      </button>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className={styles.crumbSep} aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() => onNavigate(item.screen)}
            className={styles.crumbLink}
          >
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
            <div
              key={n}
              className={cfg.level >= n ? `${styles.thermTick} ${styles.active}` : styles.thermTick}
            />
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

function BrandGrid({ brandFamilies, onSelect }) {
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
        {brandFamilies.total_normalized_records} codes · {families.length} brand families
      </div>
    </>
  );
}

function ModelInput({ family, onPlatformSelected, onVisualFallback, onNavigate }) {
  const [value, setValue] = useState('');
  const [match, setMatch] = useState(null);
  const [helper, setHelper] = useState('Type to identify the platform automatically');
  const [helperClass, setHelperClass] = useState('');
  const inputRef = useRef(null);
  const routeTimerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      setHelper(`Recognized — ${best.platform_name}`);
      setHelperClass(styles.matchSuccess);
      clearTimeout(routeTimerRef.current);
      routeTimerRef.current = setTimeout(() => onPlatformSelected(best), 900);
    } else {
      setMatch(null);
      setHelper('No match yet — keep typing, or identify by what you see');
      setHelperClass('');
      clearTimeout(routeTimerRef.current);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[{ screen: 'model', label: family.brand_family_name }]}
        onNavigate={onNavigate}
      />
      <label className={styles.inputLabel} htmlFor="model-input">
        What model number do you have?
      </label>
      <input
        ref={inputRef}
        id="model-input"
        type="text"
        className={styles.inputField}
        placeholder="Enter model number"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
      />
      <div className={`${styles.inputHelper} ${helperClass}`}>{helper}</div>
      <button
        type="button"
        onClick={onVisualFallback}
        className={styles.altLink}
      >
        Can't read the model number? Identify by what you see →
      </button>
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
      <div className={styles.inputLabel} style={{ marginBottom: 8 }}>
        What do you see on the equipment?
      </div>
      <div className={styles.label} style={{ marginBottom: 24 }}>
        Pick the display or indicator that matches
      </div>
      <div className={styles.visualOptions}>
        {family.platforms.map((p) => (
          <button
            key={p.platform_id}
            type="button"
            onClick={() => onPlatformSelected(p)}
            className={styles.visualOption}
          >
            <div className={styles.visualOptionTitle}>{p.platform_name}</div>
            <div className={styles.visualOptionDesc}>
              {(p.visual_identification || p.platform_description || '').slice(0, 220)}
              {(p.visual_identification || p.platform_description || '').length > 220 ? '…' : ''}
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function CodeInput({ family, platform, onCodeSelected, onNavigate }) {
  const [value, setValue] = useState('');
  const [helper, setHelper] = useState(`${platform.codes.length} codes on this platform`);
  const [helperIsSuggestions, setHelperIsSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

    // Normalize user input: remove dots/dashes/spaces for fuzzy match
    const normalized = trimmed.replace(/[.\-\s]/g, '');

    const exact = platform.codes.find((c) => {
      const id = c.code_identifier.toLowerCase();
      const cid = c.code_id.toLowerCase();
      const nId = id.replace(/[.\-\s]/g, '');
      const nCid = cid.replace(/[.\-\s]/g, '');
      return id === trimmed || cid === trimmed || nId === normalized || nCid === normalized;
    });

    if (exact) {
      onCodeSelected(exact);
      return;
    }

    const partials = platform.codes.filter((c) => {
      const id = c.code_identifier.toLowerCase();
      return id.includes(trimmed) || c.code_id.toLowerCase().includes(trimmed);
    });

    if (partials.length === 0) {
      setHelper('No matches — check the code format');
      setHelperIsSuggestions(false);
      setSuggestions([]);
    } else if (partials.length <= 6) {
      setHelper(`${partials.length} possible match${partials.length > 1 ? 'es' : ''}:`);
      setHelperIsSuggestions(true);
      setSuggestions(partials);
    } else {
      setHelper(`${partials.length} codes match — keep typing`);
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
      <label className={styles.inputLabel} htmlFor="code-input">
        What code do you see?
      </label>
      <input
        ref={inputRef}
        id="code-input"
        type="text"
        className={styles.inputField}
        placeholder="Enter the code as shown on the display"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <div className={styles.inputHelper}>
        {helper}
        {helperIsSuggestions && (
          <div className={styles.suggestions}>
            {suggestions.map((s) => (
              <button
                key={s.code_id}
                type="button"
                onClick={() => onCodeSelected(s)}
                className={styles.suggestionChip}
              >
                {s.code_identifier}
              </button>
            ))}
          </div>
        )}
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
        {proc.navigation_steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      {proc.tool_required && (
        <div className={styles.subcodeTool}>
          <strong>Tool required:</strong> {proc.tool_required}
        </div>
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

function ResultCard({ family, platform, code, onLookupAnother, onChangeBrand }) {
  const conflict = getCrossGenerationConflict(family.brand_family_id, code.code_identifier);
  const [copyStatus, setCopyStatus] = useState('');

  const handleCopy = async () => {
    const text = [
      `${code.code_identifier} — ${code.meaning}`,
      '',
      `Brand: ${family.brand_family_name}`,
      `Platform: ${platform.platform_name}`,
      '',
      'This code typically points to:',
      ...code.root_causes.map((c) => `  • ${c}`),
      '',
      'Next checks to confirm:',
      ...code.diagnostic_path.map((s, i) => `  ${i + 1}. ${s}`),
      '',
      `Escalation: ${code.escalation}`,
      `Reset: ${code.reset_behavior}`,
      '',
      `Source: ${code.source}`,
      '',
      'via hvacsalesmaster.com/troubleshoot/codes',
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
              {code.root_causes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </section>

          <hr className={styles.sectionDivider} />

          <section className={styles.section}>
            <div className={styles.label}>Next checks to confirm</div>
            <ol className={styles.diagnosticList}>
              {code.diagnostic_path.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
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
          <div className={styles.conflictLabel}>⚠ Cross-generation conflict</div>
          <div className={styles.conflictText}>{conflict.ui_banner_text}</div>
        </div>
      )}

      <SubcodeRetrievalPanel platform={platform} />
      <AppOnlyNote platform={platform} />

      <section className={styles.section} style={{ marginTop: 40 }}>
        <div className={styles.label}>Source</div>
        <div className={styles.sourceText}>{code.source}</div>
      </section>

      <div className={styles.actionBar}>
        <button type="button" className={styles.btnPrimary} onClick={onLookupAnother}>
          Look up another code
        </button>
        <button type="button" className={styles.btnSecondary} onClick={handleCopy}>
          {copyStatus || 'Copy result'}
        </button>
        <button type="button" className={styles.btnSecondary} onClick={onChangeBrand}>
          Change brand
        </button>
      </div>
    </>
  );
}

export default function FaultCodeLookup() {
  const [brandFamilies, setBrandFamilies] = useState(null);
  const [screen, setScreen] = useState('brands');
  const [currentFamily, setCurrentFamily] = useState(null);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [currentCode, setCurrentCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const idx = getBrandFamiliesIndex();
      setBrandFamilies(idx);
    } catch (e) {
      setError(e.message || 'Failed to load dataset');
    }
  }, []);

  const goBrands = useCallback(() => {
    setScreen('brands');
    setCurrentFamily(null);
    setCurrentPlatform(null);
    setCurrentCode(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectBrand = useCallback((brandFamilyId) => {
    const fam = getBrandFamily(brandFamilyId);
    if (!fam) return;
    setCurrentFamily(fam);
    setCurrentPlatform(null);
    setCurrentCode(null);
    setScreen('model');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectPlatform = useCallback((platform) => {
    setCurrentPlatform(platform);
    setCurrentCode(null);
    setScreen('code');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectCode = useCallback((code) => {
    setCurrentCode(code);
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigate = useCallback((target) => {
    if (target === 'brands') goBrands();
    else if (target === 'model') {
      setScreen('model');
      setCurrentPlatform(null);
      setCurrentCode(null);
    } else if (target === 'visual') setScreen('visual');
    else if (target === 'code') {
      setScreen('code');
      setCurrentCode(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [goBrands]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape') {
        if (screen === 'result') navigate('code');
        else if (screen === 'code') navigate('model');
        else if (screen === 'visual') navigate('model');
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
  }, [screen, brandFamilies, navigate, goBrands, selectBrand]);

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loadingError}>Unable to load fault code dataset: {error}</div>
        </div>
      </div>
    );
  }

  if (!brandFamilies) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Fault Code Lookup</h1>
          <div className={styles.subhead}>HVAC Sales Master</div>
        </header>

        {screen === 'brands' && (
          <BrandGrid brandFamilies={brandFamilies} onSelect={selectBrand} />
        )}
        {screen === 'model' && currentFamily && (
          <ModelInput
            family={currentFamily}
            onPlatformSelected={selectPlatform}
            onVisualFallback={() => setScreen('visual')}
            onNavigate={navigate}
          />
        )}
        {screen === 'visual' && currentFamily && (
          <VisualPicker
            family={currentFamily}
            onPlatformSelected={selectPlatform}
            onNavigate={navigate}
          />
        )}
        {screen === 'code' && currentFamily && currentPlatform && (
          <CodeInput
            family={currentFamily}
            platform={currentPlatform}
            onCodeSelected={selectCode}
            onNavigate={navigate}
          />
        )}
        {screen === 'result' && currentFamily && currentPlatform && currentCode && (
          <ResultCard
            family={currentFamily}
            platform={currentPlatform}
            code={currentCode}
            onLookupAnother={() => {
              setCurrentCode(null);
              setScreen('code');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onChangeBrand={goBrands}
          />
        )}
      </div>
    </div>
  );
}
