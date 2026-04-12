import React, { useState } from 'react'
import ResultsPanel from './ResultsPanel'
import { getSaturationTemp, getTargetSuperheat, REFRIGERANT_OPTIONS } from '../../utils/refrigerantData'
import styles from './SuperheatCalc.module.css'

function diagnose(superheat, subcooling, meterType, targetSH) {
  const isTXV = meterType === 'txv'
  const scLow = subcooling < 8
  const scHigh = subcooling > 14
  const scOK = !scLow && !scHigh

  if (isTXV) {
    if (scOK && superheat >= 5 && superheat <= 25) return 'ok'
    if (superheat < 5 && scOK) return 'airflow'
    if (scLow && superheat > 15) return 'undercharge'
    if (scHigh && superheat < 5) return 'overcharge'
    if (scLow) return 'undercharge'
    if (scHigh) return 'overcharge'
    if (superheat < 5) return 'airflow'
    return 'check'
  }

  // Fixed orifice
  const shDiff = superheat - targetSH
  if (Math.abs(shDiff) <= 3 && scOK) return 'ok'
  if (shDiff > 3 && scLow) return 'undercharge'
  if (shDiff < -3 && scHigh) return 'overcharge'
  if (shDiff > 3) return 'undercharge'
  if (shDiff < -3) return 'overcharge'
  return 'check'
}

const TITLES = {
  ok: 'System Appears Properly Charged',
  undercharge: 'Possible Undercharge',
  overcharge: 'Possible Overcharge',
  airflow: 'Airflow Problem Suspected',
  check: 'Check Readings',
}

const NOTES = {
  ok: [
    'Readings are within normal range for this system type.',
    'Document these values as baseline for future service visits.',
    'Verify temperature split across the evaporator (14–22°F is typical).',
  ],
  undercharge: [
    'High superheat with low subcooling is the classic undercharge pattern.',
    'Check for refrigerant leaks before adding charge.',
    'Verify outdoor coil is clean and fan is running — a dirty condenser can mimic low charge.',
  ],
  overcharge: [
    'Low superheat with high subcooling indicates too much refrigerant.',
    'Overcharge causes high head pressure, reduces efficiency, and can damage the compressor.',
    'Recover refrigerant in small amounts, let system stabilize 10–15 minutes, recheck.',
  ],
  airflow: [
    'Low superheat with a TXV often points to an airflow problem, not a charge problem.',
    'Check: dirty filter, dirty evaporator coil, closed registers, undersized ductwork.',
    'Do NOT add refrigerant to compensate for an airflow restriction.',
  ],
  check: [
    'The readings don\'t match a clear pattern. Verify gauge accuracy and sensor placement.',
    'Recheck suction line temp at the service valve — insulate the probe for an accurate reading.',
    'If readings seem contradictory, check for a restricted metering device or non-condensables.',
  ],
}

const CUSTOMER_TEXT = {
  ok: 'We checked the refrigerant levels in your system and everything looks good. The pressures and temperatures are within the normal range, which means the system is charged correctly and running efficiently.',
  undercharge: 'The readings show your system may be low on refrigerant. This means it has to work harder to cool your home, which reduces efficiency and can eventually damage the compressor. We need to check for leaks before adding more refrigerant — otherwise we\'d just be putting a bandaid on the problem.',
  overcharge: 'Your system has more refrigerant than it needs. Too much refrigerant causes high pressure on the compressor, reduces cooling efficiency, and can lead to premature compressor failure. We\'ll remove the excess to bring it back into the proper range.',
  airflow: 'The refrigerant charge itself looks okay, but we\'re seeing signs of an airflow restriction. This usually means something is blocking the air from moving through the system properly — often a dirty filter, dirty coil, or closed vents. Fixing the airflow issue should bring the system back to normal performance.',
  check: 'Some of the readings we\'re seeing don\'t quite add up. We\'ll need to re-verify a few measurements and check for other possible issues before making any changes to the refrigerant charge.',
}

export default function SuperheatCalc() {
  const [refrigerant, setRefrigerant] = useState('R-410A')
  const [meterType, setMeterType] = useState('txv')
  const [suctionPSI, setSuctionPSI] = useState('')
  const [suctionTemp, setSuctionTemp] = useState('')
  const [liquidPSI, setLiquidPSI] = useState('')
  const [liquidTemp, setLiquidTemp] = useState('')
  const [outdoorTemp, setOutdoorTemp] = useState('')
  const [indoorWB, setIndoorWB] = useState('')
  const [result, setResult] = useState(null)

  const isTXV = meterType === 'txv'

  const calculate = () => {
    const sp = Number(suctionPSI)
    const st = Number(suctionTemp)
    const lp = Number(liquidPSI)
    const lt = Number(liquidTemp)
    if (!sp || !st || !lp || !lt) return

    const suctionSat = getSaturationTemp(refrigerant, sp)
    const liquidSat = getSaturationTemp(refrigerant, lp)
    if (suctionSat === null || liquidSat === null) return

    const superheat = Math.round((st - suctionSat) * 10) / 10
    const subcooling = Math.round((liquidSat - lt) * 10) / 10

    let targetSH = null
    if (!isTXV) {
      targetSH = getTargetSuperheat(outdoorTemp, indoorWB)
    }

    const dx = diagnose(superheat, subcooling, meterType, targetSH)

    setResult({
      superheat,
      subcooling,
      suctionSat,
      liquidSat,
      targetSH,
      dx,
    })
  }

  return (
    <div className={styles.tool}>
      <div className={styles.header}>
        <h3 className={styles.toolTitle}>Superheat &amp; Subcooling Calculator</h3>
        <p className={styles.toolSubtitle}>
          Enter your gauge readings and line temperatures to verify the charge
        </p>
      </div>

      <div className={styles.inputCard}>
        <div className={styles.group}>
          <label className={styles.field}>
            <span className={styles.label}>Refrigerant Type</span>
            <select value={refrigerant} onChange={(e) => setRefrigerant(e.target.value)} className={styles.input}>
              {REFRIGERANT_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>

          <div className={styles.field}>
            <span className={styles.label}>Metering Device</span>
            <div className={styles.toggleRow}>
              <button
                type="button"
                className={`${styles.toggleBtn} ${isTXV ? styles.toggleActive : ''}`}
                onClick={() => setMeterType('txv')}
              >
                TXV / EEV
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${!isTXV ? styles.toggleActive : ''}`}
                onClick={() => setMeterType('piston')}
              >
                Fixed Orifice / Piston
              </button>
            </div>
          </div>
        </div>

        <div className={styles.group}>
          <label className={styles.field}>
            <span className={styles.label}>Suction Pressure (PSIG)</span>
            <input type="number" value={suctionPSI} onChange={(e) => setSuctionPSI(e.target.value)} placeholder="e.g. 118" className={styles.input} min="0" />
            <span className={styles.hint}>Low-side gauge reading at the service valve</span>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Suction Line Temp (°F)</span>
            <input type="number" value={suctionTemp} onChange={(e) => setSuctionTemp(e.target.value)} placeholder="e.g. 55" className={styles.input} />
            <span className={styles.hint}>Measured on the suction line near the outdoor unit</span>
          </label>
        </div>

        <div className={styles.group}>
          <label className={styles.field}>
            <span className={styles.label}>Liquid Line Pressure (PSIG)</span>
            <input type="number" value={liquidPSI} onChange={(e) => setLiquidPSI(e.target.value)} placeholder="e.g. 350" className={styles.input} min="0" />
            <span className={styles.hint}>High-side gauge reading</span>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Liquid Line Temp (°F)</span>
            <input type="number" value={liquidTemp} onChange={(e) => setLiquidTemp(e.target.value)} placeholder="e.g. 92" className={styles.input} />
            <span className={styles.hint}>Measured on the liquid line near the outdoor unit</span>
          </label>
        </div>

        {!isTXV && (
          <div className={`${styles.group} ${styles.fadeIn}`}>
            <label className={styles.field}>
              <span className={styles.label}>Outdoor Ambient Temp (°F)</span>
              <input type="number" value={outdoorTemp} onChange={(e) => setOutdoorTemp(e.target.value)} placeholder="e.g. 85" className={styles.input} />
              <span className={styles.hint}>Air temperature entering the condenser coil</span>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Return Air Wet-Bulb (°F)</span>
              <input type="number" value={indoorWB} onChange={(e) => setIndoorWB(e.target.value)} placeholder="e.g. 63" className={styles.input} />
              <span className={styles.hint}>Wet-bulb temperature of the return air at the indoor coil</span>
            </label>
          </div>
        )}

        <button type="button" onClick={calculate} className={styles.calcBtn} disabled={!suctionPSI || !suctionTemp || !liquidPSI || !liquidTemp}>
          Check the Charge
        </button>
      </div>

      {result && (
        <ResultsPanel
          eyebrow="CHARGE ANALYSIS"
          title={TITLES[result.dx]}
          primaryValue={`${result.superheat}°F`}
          primaryUnit="SUPERHEAT"
          summary={`Actual superheat is ${result.superheat}°F and subcooling is ${result.subcooling}°F.`}
          metrics={[
            { label: 'Actual Superheat', value: `${result.superheat}`, unit: '°F' },
            { label: 'Target Superheat', value: isTXV ? 'N/A — TXV controls superheat' : `${result.targetSH} ± 3`, unit: isTXV ? '' : '°F' },
            { label: 'Actual Subcooling', value: `${result.subcooling}`, unit: '°F' },
            { label: 'Target Subcooling', value: isTXV ? '8–14' : 'Varies', unit: '°F' },
            { label: 'Suction Saturation Temp', value: `${result.suctionSat}`, unit: '°F' },
            { label: 'Liquid Saturation Temp', value: `${result.liquidSat}`, unit: '°F' },
          ]}
          notes={NOTES[result.dx]}
          customerText={CUSTOMER_TEXT[result.dx]}
          showPrint
        />
      )}
    </div>
  )
}
