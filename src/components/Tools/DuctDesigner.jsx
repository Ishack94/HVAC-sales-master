import React, { useState, useMemo, useEffect } from 'react'
import styles from './DuctDesigner.module.css'

const ROOM_TYPES = [
  'Living/Family Room',
  'Bedroom',
  'Kitchen',
  'Bathroom',
  'Dining Room',
  'Office',
  'Hallway',
  'Laundry',
  'Garage',
  'Bonus Room',
]

const FURNACE_BTU = [40000, 60000, 80000, 100000, 120000]
const TEMP_RISE = [35, 45, 55, 65, 70]
const TONNAGE = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0]

const PRESETS = {
  '3 Bed / 2 Bath': [
    { name: 'Living Room', sqft: 350, type: 'Living/Family Room' },
    { name: 'Kitchen', sqft: 200, type: 'Kitchen' },
    { name: 'Master Bedroom', sqft: 220, type: 'Bedroom' },
    { name: 'Bedroom 2', sqft: 150, type: 'Bedroom' },
    { name: 'Bedroom 3', sqft: 140, type: 'Bedroom' },
    { name: 'Master Bath', sqft: 80, type: 'Bathroom' },
    { name: 'Hall Bath', sqft: 60, type: 'Bathroom' },
    { name: 'Hallway', sqft: 60, type: 'Hallway' },
  ],
  '4 Bed / 2.5 Bath': [
    { name: 'Living Room', sqft: 400, type: 'Living/Family Room' },
    { name: 'Kitchen', sqft: 240, type: 'Kitchen' },
    { name: 'Dining Room', sqft: 160, type: 'Dining Room' },
    { name: 'Master Bedroom', sqft: 280, type: 'Bedroom' },
    { name: 'Bedroom 2', sqft: 160, type: 'Bedroom' },
    { name: 'Bedroom 3', sqft: 150, type: 'Bedroom' },
    { name: 'Bedroom 4', sqft: 140, type: 'Bedroom' },
    { name: 'Master Bath', sqft: 100, type: 'Bathroom' },
    { name: 'Full Bath', sqft: 70, type: 'Bathroom' },
    { name: 'Half Bath', sqft: 35, type: 'Bathroom' },
    { name: 'Hallway', sqft: 75, type: 'Hallway' },
  ],
  '5 Bed / 3 Bath': [
    { name: 'Living Room', sqft: 450, type: 'Living/Family Room' },
    { name: 'Family Room', sqft: 350, type: 'Living/Family Room' },
    { name: 'Kitchen', sqft: 280, type: 'Kitchen' },
    { name: 'Dining Room', sqft: 180, type: 'Dining Room' },
    { name: 'Master Bedroom', sqft: 320, type: 'Bedroom' },
    { name: 'Bedroom 2', sqft: 180, type: 'Bedroom' },
    { name: 'Bedroom 3', sqft: 160, type: 'Bedroom' },
    { name: 'Bedroom 4', sqft: 150, type: 'Bedroom' },
    { name: 'Bedroom 5', sqft: 140, type: 'Bedroom' },
    { name: 'Master Bath', sqft: 110, type: 'Bathroom' },
    { name: 'Full Bath 2', sqft: 80, type: 'Bathroom' },
    { name: 'Full Bath 3', sqft: 75, type: 'Bathroom' },
    { name: 'Office', sqft: 140, type: 'Office' },
    { name: 'Hallway', sqft: 90, type: 'Hallway' },
  ],
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function makeRoom(overrides = {}) {
  return {
    id: makeId(),
    name: '',
    sqft: '',
    type: 'Bedroom',
    ...overrides,
  }
}

/* Supply duct tiers — round + rectangular equivalents.
 * Index lookup so flex duct can bump every size up one increment. */
const SUPPLY_TIERS = [
  { max: 80,  round: '5"',  rect: '3¼×10' },
  { max: 110, round: '6"',  rect: '3¼×12' },
  { max: 160, round: '7"',  rect: '3¼×14' },
  { max: 225, round: '8"',  rect: '8×8' },
  { max: 300, round: '9"',  rect: '8×10' },
  { max: 400, round: '10"', rect: '8×12' },
  { max: 550, round: '12"', rect: '10×12 or 8×14' },
  { max: Infinity, round: '14"', rect: '12×12 or 8×18' },
]

function ductSizes(cfm, isFlex) {
  let idx = SUPPLY_TIERS.findIndex((t) => cfm <= t.max)
  if (idx < 0) idx = SUPPLY_TIERS.length - 1
  if (isFlex) idx = Math.min(idx + 1, SUPPLY_TIERS.length - 1)
  return { round: SUPPLY_TIERS[idx].round, rect: SUPPLY_TIERS[idx].rect }
}

function registerSize(cfm) {
  if (cfm <= 100) return '6×10'
  if (cfm <= 150) return '8×10'
  if (cfm <= 250) return '10×10 or 8×12'
  if (cfm <= 350) return '10×12'
  return '12×12'
}

const TRUNK_TIERS = [
  { max: 399,  label: '8×8 / 10" rd' },
  { max: 600,  label: '10×8 / 12" rd' },
  { max: 800,  label: '12×8 / 14" rd' },
  { max: 1000, label: '14×8 / 16" rd' },
  { max: 1200, label: '16×10 / 18" rd' },
  { max: 1600, label: '20×10 / 20" rd' },
  { max: Infinity, label: '20×12 / 22" rd' },
]

function trunkSizeLabel(cfm, isFlex) {
  let idx = TRUNK_TIERS.findIndex((t) => cfm <= t.max)
  if (idx < 0) idx = TRUNK_TIERS.length - 1
  if (isFlex) idx = Math.min(idx + 1, TRUNK_TIERS.length - 1)
  return TRUNK_TIERS[idx].label
}

function ductDiameterInches(roundLabel) {
  return parseInt(roundLabel, 10) || 8
}

function calcVelocity(cfm, roundLabel) {
  const d = ductDiameterInches(roundLabel)
  const areaSqft = Math.PI * Math.pow(d / 24, 2)
  return areaSqft > 0 ? Math.round(cfm / areaSqft) : 0
}

function returnSizeLabel(cfm) {
  if (cfm <= 150) return '14×6'
  if (cfm <= 200) return '14×8 or 16×8'
  if (cfm <= 300) return '20×8 or 16×10'
  if (cfm <= 400) return '20×10 or 14×14'
  if (cfm <= 500) return '20×12 or 24×10'
  return '20×14 or 24×12'
}

/* === Smart parse — client-side property description parser === */
function parseDescription(text) {
  const rooms = []
  const sqftMatch = text.match(/(\d[\d,.]*)\s*(?:sq\.?\s*ft|square\s*feet|sqft)/i)
  const totalSqFt = sqftMatch ? parseInt(sqftMatch[1].replace(/[,.]/g, ''), 10) : 2000

  const bedMatch = text.match(/(\d+)\s*(?:bed(?:room)?s?|br\b)/i)
  const bathMatch = text.match(/(\d+\.?\d*)\s*(?:bath(?:room)?s?|ba\b)/i)
  const beds = bedMatch ? parseInt(bedMatch[1], 10) : 3
  const baths = bathMatch ? parseFloat(bathMatch[1]) : 2

  const hasDining = /dining/i.test(text)
  const hasLaundry = /laundry/i.test(text)
  const hasOffice = /office|den|study/i.test(text)

  rooms.push({ name: 'Living Room', sqFt: Math.round(totalSqFt * 0.18), type: 'Living/Family Room' })
  rooms.push({ name: 'Kitchen', sqFt: Math.round(totalSqFt * 0.12), type: 'Kitchen' })
  rooms.push({ name: 'Master Bedroom', sqFt: Math.round(totalSqFt * 0.14), type: 'Bedroom' })
  for (let i = 2; i <= beds; i++) {
    rooms.push({ name: `Bedroom ${i}`, sqFt: Math.round(totalSqFt * 0.09), type: 'Bedroom' })
  }
  rooms.push({ name: 'Master Bath', sqFt: Math.round(totalSqFt * 0.05), type: 'Bathroom' })
  if (baths >= 2) rooms.push({ name: 'Hall Bath', sqFt: Math.round(totalSqFt * 0.04), type: 'Bathroom' })
  if (baths >= 2.5) rooms.push({ name: 'Half Bath', sqFt: Math.round(totalSqFt * 0.025), type: 'Bathroom' })
  if (hasDining) rooms.push({ name: 'Dining Room', sqFt: Math.round(totalSqFt * 0.08), type: 'Dining Room' })
  if (hasLaundry) rooms.push({ name: 'Laundry', sqFt: Math.round(totalSqFt * 0.03), type: 'Laundry' })
  if (hasOffice) rooms.push({ name: 'Office', sqFt: Math.round(totalSqFt * 0.07), type: 'Office' })
  rooms.push({ name: 'Hallway', sqFt: Math.round(totalSqFt * 0.04), type: 'Hallway' })

  // Adjust to match total — bump the living room
  const sum = rooms.reduce((s, r) => s + r.sqFt, 0)
  const diff = totalSqFt - sum
  rooms[0].sqFt += diff

  const matchedSqFt = !!sqftMatch
  const matchedBeds = !!bedMatch
  return { totalSqFt, rooms, matchedSqFt, matchedBeds }
}

/* === Floor plan === */
function roomColor(type) {
  if (type === 'Living/Family Room' || type === 'Kitchen' || type === 'Dining Room') return '#e8f4fd'
  if (type === 'Bedroom') return '#f0f4f8'
  if (type === 'Bathroom') return '#e6f0e6'
  return '#fff8e6'
}

function FloorPlan({ schedule }) {
  if (!schedule.length) return null

  const W = 800
  const H = 500
  const M = 20
  const ahW = 60
  const ahH = 110
  const padLeft = M + ahW + 18
  const usableW = W - padLeft - M
  const usableH = H - 2 * M

  const colsPerRow = schedule.length <= 6 ? 2 : 3
  const numRows = Math.ceil(schedule.length / colsPerRow)
  const rowH = usableH / numRows

  const placed = []
  for (let r = 0; r < numRows; r++) {
    const rowRooms = schedule.slice(r * colsPerRow, (r + 1) * colsPerRow)
    const rowTotalSqft = rowRooms.reduce((s, room) => s + room.sqft, 0) || 1
    let xCursor = padLeft
    rowRooms.forEach((room) => {
      const w = (room.sqft / rowTotalSqft) * usableW
      placed.push({
        room,
        x: xCursor,
        y: M + r * rowH,
        w,
        h: rowH,
      })
      xCursor += w
    })
  }

  const trunkY = H / 2
  const trunkStartX = M + ahW
  const trunkEndX = W - M

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={styles.floorPlanSvg}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Air handler */}
      <rect
        x={M}
        y={trunkY - ahH / 2}
        width={ahW}
        height={ahH}
        fill="#0e2340"
        rx={4}
      />
      <text x={M + ahW / 2} y={trunkY - 4} fill="white" fontSize="9" fontWeight="800" textAnchor="middle">
        AIR
      </text>
      <text x={M + ahW / 2} y={trunkY + 8} fill="white" fontSize="9" fontWeight="800" textAnchor="middle">
        HANDLER
      </text>

      {/* Room rectangles */}
      {placed.map((p, i) => (
        <g key={i}>
          <rect
            x={p.x}
            y={p.y}
            width={p.w}
            height={p.h}
            fill={roomColor(p.room.type)}
            stroke="#ccc"
            strokeWidth="1"
          />
          <text x={p.x + 10} y={p.y + 18} fill="#0e2340" fontSize="12" fontWeight="700">
            {p.room.name.length > 22 ? p.room.name.slice(0, 20) + '…' : p.room.name}
          </text>
          <text x={p.x + 10} y={p.y + 32} fill="#777" fontSize="10">
            {p.room.sqft} sq ft
          </text>
          <text
            x={p.x + p.w - 8}
            y={p.y + 18}
            fill="#4a9fe5"
            fontSize="10"
            fontWeight="800"
            textAnchor="end"
          >
            {p.room.round} supply
          </text>
        </g>
      ))}

      {/* Trunk line */}
      <line
        x1={trunkStartX}
        y1={trunkY}
        x2={trunkEndX}
        y2={trunkY}
        stroke="#0e2340"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Branch lines from trunk to each room center */}
      {placed.map((p, i) => {
        const cx = p.x + p.w / 2
        const cy = p.y + p.h / 2
        return (
          <g key={`b-${i}`}>
            <line
              x1={cx}
              y1={trunkY}
              x2={cx}
              y2={cy}
              stroke="#4a9fe5"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx={cx} cy={cy} r="3" fill="#4a9fe5" />
          </g>
        )
      })}
    </svg>
  )
}

function StepIndicator({ step }) {
  const labels = ['Rooms', 'Equipment', 'Results']
  return (
    <div className={styles.stepIndicator}>
      {labels.map((label, i) => {
        const num = i + 1
        const isActive = step === num
        const isComplete = step > num
        const dotClass = `${styles.stepDot} ${isActive ? styles.stepActive : ''} ${isComplete ? styles.stepComplete : ''}`
        return (
          <React.Fragment key={i}>
            <div className={dotClass}>
              <span className={styles.stepNum}>{isComplete ? '✓' : num}</span>
              <span className={styles.stepText}>{label}</span>
            </div>
            {i < labels.length - 1 && (
              <div className={`${styles.stepConnector} ${step > num ? styles.stepConnectorComplete : ''}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function TrunkDiagram({ segments, designCFM }) {
  if (!segments.length) return null

  const startX = 56
  const segWidth = 158
  const trunkBottomY = 130
  const minH = 30
  const maxH = 80
  const totalWidth = startX + segments.length * segWidth + 24
  const totalHeight = 230

  const segHeight = (cfm) => {
    const ratio = Math.max(0, cfm) / designCFM
    return minH + (maxH - minH) * ratio
  }

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className={styles.svg}
      preserveAspectRatio="xMinYMid meet"
      style={{ minWidth: totalWidth }}
    >
      {/* Air handler box */}
      <rect x={6} y={trunkBottomY - maxH} width={44} height={maxH} fill="#1b3a5c" rx={4} />
      <text x={28} y={trunkBottomY - maxH / 2 - 2} fill="white" textAnchor="middle" fontSize="9" fontWeight="800">AIR</text>
      <text x={28} y={trunkBottomY - maxH / 2 + 10} fill="white" textAnchor="middle" fontSize="9" fontWeight="800">HANDLER</text>

      {/* Title */}
      <text x={startX} y={20} fill="#0e2340" fontSize="11" fontWeight="800" letterSpacing="1">
        REDUCING TRUNK · {designCFM.toLocaleString()} CFM TOTAL
      </text>

      {segments.map((seg, i) => {
        const x = startX + i * segWidth
        const h = segHeight(seg.trunkCFM)
        const top = trunkBottomY - h
        const branchX = x + segWidth - 32
        const labelText = seg.room.length > 16 ? seg.room.slice(0, 14) + '…' : seg.room

        return (
          <g key={i}>
            {/* Trunk segment */}
            <rect x={x} y={top} width={segWidth} height={h} fill="#0e2340" stroke="#4a9fe5" strokeWidth="1.5" />

            {/* CFM label above trunk */}
            <text x={x + segWidth / 2} y={top - 8} fill="#1b3a5c" textAnchor="middle" fontSize="11" fontWeight="800">
              {Math.round(seg.trunkCFM).toLocaleString()} CFM
            </text>

            {/* Trunk size inside */}
            <text x={x + segWidth / 2 - 14} y={trunkBottomY - h / 2 + 4} fill="white" textAnchor="middle" fontSize="10" fontWeight="700">
              {seg.trunkSize}
            </text>

            {/* Branch takeoff */}
            <rect x={branchX - 5} y={trunkBottomY} width={10} height={42} fill="#4a9fe5" />
            <rect x={branchX - 9} y={trunkBottomY + 42} width={18} height={6} fill="#4a9fe5" rx={1} />

            {/* Branch labels */}
            <text x={branchX} y={trunkBottomY + 64} fill="#1b3a5c" textAnchor="middle" fontSize="10" fontWeight="700">
              {labelText}
            </text>
            <text x={branchX} y={trunkBottomY + 78} fill="#4a9fe5" textAnchor="middle" fontSize="10" fontWeight="800">
              {seg.roomCFM} CFM
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function DuctDesigner({ initialEquipment }) {
  const [step, setStep] = useState(1)
  const [rooms, setRooms] = useState([makeRoom()])
  const [furnaceBTU, setFurnaceBTU] = useState(80000)
  const [tempRise, setTempRise] = useState(55)
  const [tonnage, setTonnage] = useState(3.0)
  const [material, setMaterial] = useState('rigid') // 'rigid' | 'flex'
  const isFlex = material === 'flex'

  // AI property lookup state
  const [pasteText, setPasteText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)
  const [aiSuccess, setAiSuccess] = useState(null)

  // Accept pre-filled equipment from Load Calculator
  useEffect(() => {
    if (initialEquipment) {
      setTonnage(initialEquipment.tonnage)
      setFurnaceBTU(initialEquipment.btu)
    }
  }, [initialEquipment])

  const totalSqft = rooms.reduce((sum, r) => sum + (Number(r.sqft) || 0), 0)
  const validRooms = rooms.filter((r) => Number(r.sqft) > 0)
  const canAdvance = validRooms.length >= 2

  const heatingCFM = Math.round(furnaceBTU / (1.08 * tempRise))
  const coolingCFM = Math.round(tonnage * 400)
  const designCFM = Math.max(heatingCFM, coolingCFM)

  const addRoom = () => setRooms([...rooms, makeRoom()])
  const removeRoom = (id) => {
    const next = rooms.filter((r) => r.id !== id)
    setRooms(next.length ? next : [makeRoom()])
  }
  const updateRoom = (id, key, value) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, [key]: value } : r)))
  }
  const loadPreset = (presetName) => {
    setRooms(PRESETS[presetName].map((r) => makeRoom(r)))
  }
  const reset = () => {
    setStep(1)
    setRooms([makeRoom()])
    setFurnaceBTU(80000)
    setTempRise(55)
    setTonnage(3.0)
    setMaterial('rigid')
    setPasteText('')
    setAiError(null)
    setAiSuccess(null)
  }

  const handleAnalyze = () => {
    if (!pasteText.trim() || aiLoading) return
    setAiLoading(true)
    setAiError(null)
    setAiSuccess(null)
    try {
      const data = parseDescription(pasteText.trim())
      if (!data.matchedSqFt && !data.matchedBeds) {
        throw new Error('No sq ft or bedroom count found')
      }
      const newRooms = data.rooms.map((r) =>
        makeRoom({
          name: r.name || '',
          sqft: String(Math.round(Number(r.sqFt ?? r.sqft ?? 0))),
          type: ROOM_TYPES.includes(r.type) ? r.type : 'Bedroom',
        })
      )
      setRooms(newRooms)
      setAiSuccess({ count: newRooms.length, totalSqFt: data.totalSqFt })
    } catch (err) {
      console.error('Smart parse failed:', err)
      setAiError(
        "Couldn't find sq ft or bedroom count. Include something like '1800 sq ft, 3 bed, 2 bath' and try again, or use Quick Fill below."
      )
    } finally {
      setAiLoading(false)
    }
  }

  const supplySchedule = useMemo(() => {
    if (step !== 3 || totalSqft === 0) return []
    const sorted = [...validRooms].sort((a, b) => Number(b.sqft) - Number(a.sqft))
    return sorted.map((room, i) => {
      const sqft = Number(room.sqft)
      const cfm = Math.round(designCFM * (sqft / totalSqft))
      const sizes = ductSizes(cfm, isFlex)
      const fpm = calcVelocity(cfm, sizes.round)
      return {
        id: room.id,
        name: room.name || `Room ${i + 1}`,
        type: room.type,
        sqft,
        cfm,
        round: sizes.round,
        rect: sizes.rect,
        register: registerSize(cfm),
        fpm,
      }
    })
  }, [step, validRooms, totalSqft, designCFM, isFlex])

  const trunkSegments = useMemo(() => {
    if (step !== 3 || !supplySchedule.length) return []
    let remaining = designCFM
    return supplySchedule.map((room) => {
      const tSize = trunkSizeLabel(remaining, isFlex)
      const tRound = tSize.match(/(\d+)"\s*rd/)?.[1]
      const tFPM = tRound ? calcVelocity(remaining, tRound + '"') : 0
      const seg = {
        room: room.name,
        roomCFM: room.cfm,
        trunkCFM: remaining,
        trunkSize: tSize,
        trunkFPM: tFPM,
      }
      remaining = Math.max(0, remaining - room.cfm)
      return seg
    })
  }, [step, supplySchedule, designCFM, isFlex])

  const returnInfo = useMemo(() => {
    if (step !== 3) return null
    const numReturns = Math.max(2, Math.ceil(totalSqft / 500))
    const cfmPerReturn = Math.round(designCFM / numReturns)
    return {
      numReturns,
      cfmPerReturn,
      grilleSize: returnSizeLabel(cfmPerReturn),
    }
  }, [step, totalSqft, designCFM])

  return (
    <div className={styles.tool}>
      <div className={styles.header}>
        <h3 className={styles.toolTitle}>Duct Design Calculator</h3>
        <p className={styles.toolSubtitle}>
          Size your supply and return ductwork based on Manual D principles
        </p>
      </div>

      <StepIndicator step={step} />

      {/* === STEP 1: ROOMS === */}
      {step === 1 && (
        <div className={styles.stepPanel} key="step1">
          {/* Smart parse property lookup */}
          <div className={styles.aiSection}>
            <div className={styles.aiHeader}>
              <span className={styles.aiBadge}>Smart Parse</span>
              <h4 className={styles.aiTitle}>Paste Property Description</h4>
              <p className={styles.aiSubtitle}>
                Drop in a property description with sq ft and bedroom count and we'll auto-fill the room layout for you.
              </p>
            </div>

            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="e.g. 'Beautiful 4 bed, 2.5 bath ranch with 2,200 sq ft. Open dining room, laundry, attached garage.'"
              className={styles.aiTextarea}
              rows={4}
              disabled={aiLoading}
            />

            <div className={styles.aiActions}>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!pasteText.trim() || aiLoading}
                className={`${styles.aiBtn} ${aiLoading ? styles.aiBtnLoading : ''}`}
              >
                {aiLoading ? 'Analyzing…' : 'Analyze Property →'}
              </button>
            </div>

            {aiLoading && (
              <div className={styles.aiSkeleton} aria-hidden="true">
                <div className={styles.skeletonBar} />
                <div className={styles.skeletonBar} />
                <div className={styles.skeletonBar} />
                <div className={styles.skeletonBar} />
              </div>
            )}

            {aiSuccess && !aiLoading && (
              <div className={styles.aiSuccess}>
                ✓ Found {aiSuccess.count} rooms · {aiSuccess.totalSqFt.toLocaleString()} sq ft total — review and adjust below
              </div>
            )}

            {aiError && !aiLoading && (
              <div className={styles.aiError}>{aiError}</div>
            )}
          </div>

          <div className={styles.aiDivider}>
            <span>— or start from a template —</span>
          </div>

          <div className={styles.presets}>
            <span className={styles.presetsLabel}>Quick fill</span>
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => loadPreset(name)}
                className={styles.presetBtn}
              >
                {name}
              </button>
            ))}
          </div>

          <div className={styles.roomList}>
            <div className={styles.roomHeader}>
              <span>Room name</span>
              <span>Sq ft</span>
              <span>Type</span>
              <span></span>
            </div>
            {rooms.map((room) => (
              <div key={room.id} className={styles.roomRow}>
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                  placeholder="Living Room"
                  className={styles.input}
                />
                <input
                  type="number"
                  value={room.sqft}
                  onChange={(e) => updateRoom(room.id, 'sqft', e.target.value)}
                  placeholder="0"
                  min="0"
                  className={styles.input}
                />
                <select
                  value={room.type}
                  onChange={(e) => updateRoom(room.id, 'type', e.target.value)}
                  className={styles.input}
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeRoom(room.id)}
                  className={styles.deleteBtn}
                  aria-label="Delete room"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={addRoom} className={styles.addRoomBtn}>
            + Add Room
          </button>

          <div className={styles.totalRow}>
            <span>Total square footage</span>
            <strong>{totalSqft.toLocaleString()} sq ft</strong>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!canAdvance}
              className={styles.primaryBtn}
            >
              Next: Select Equipment →
            </button>
          </div>
        </div>
      )}

      {/* === STEP 2: EQUIPMENT === */}
      {step === 2 && (
        <div className={styles.stepPanel} key="step2">
          <button type="button" onClick={() => setStep(1)} className={styles.stepBackLink}>
            ← Back to Rooms
          </button>

          <div className={styles.equipPanels}>
            <div className={styles.equipPanel}>
              <h4 className={styles.equipTitle}>Furnace</h4>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Furnace BTU</span>
                <select
                  value={furnaceBTU}
                  onChange={(e) => setFurnaceBTU(Number(e.target.value))}
                  className={styles.input}
                >
                  {FURNACE_BTU.map((b) => (
                    <option key={b} value={b}>{b.toLocaleString()} BTU</option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Temperature Rise</span>
                <select
                  value={tempRise}
                  onChange={(e) => setTempRise(Number(e.target.value))}
                  className={styles.input}
                >
                  {TEMP_RISE.map((t) => (
                    <option key={t} value={t}>{t}°F</option>
                  ))}
                </select>
              </label>
              <div className={styles.cfmReadout}>
                <span className={styles.cfmReadoutLabel}>Heating CFM</span>
                <span className={styles.cfmReadoutValue}>{heatingCFM.toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.equipPanel}>
              <h4 className={styles.equipTitle}>Air Conditioner</h4>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Tonnage</span>
                <select
                  value={tonnage}
                  onChange={(e) => setTonnage(Number(e.target.value))}
                  className={styles.input}
                >
                  {TONNAGE.map((t) => (
                    <option key={t} value={t}>{t.toFixed(1)} ton</option>
                  ))}
                </select>
              </label>
              <div className={styles.cfmReadout}>
                <span className={styles.cfmReadoutLabel}>Cooling CFM</span>
                <span className={styles.cfmReadoutValue}>{coolingCFM.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className={styles.materialSection}>
            <span className={styles.materialLabel}>Duct Material</span>
            <div className={styles.segmentedControl} role="radiogroup" aria-label="Duct material">
              <button
                type="button"
                role="radio"
                aria-checked={material === 'rigid'}
                onClick={() => setMaterial('rigid')}
                className={`${styles.segmentBtn} ${material === 'rigid' ? styles.segmentBtnActive : ''}`}
              >
                Sheet Metal
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={material === 'flex'}
                onClick={() => setMaterial('flex')}
                className={`${styles.segmentBtn} ${material === 'flex' ? styles.segmentBtnActive : ''}`}
              >
                Flex Duct
              </button>
            </div>
            {isFlex && (
              <p className={styles.materialNote}>
                Flex duct has ~3× the friction loss of sheet metal. Duct sizes are increased one increment to compensate.
              </p>
            )}
          </div>

          <div className={styles.designCfm}>
            <span className={styles.designCfmLabel}>Design CFM</span>
            <span className={styles.designCfmValue}>{designCFM.toLocaleString()}</span>
            <p className={styles.designCfmNote}>
              The higher CFM value determines your duct sizing to handle peak airflow.
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => setStep(3)}
              className={styles.primaryBtn}
            >
              Generate Duct Layout →
            </button>
          </div>
        </div>
      )}

      {/* === STEP 3: RESULTS === */}
      {step === 3 && (
        <div className={styles.stepPanel} key="step3">
          <div className={styles.resultsHeader}>
            <h4 className={styles.resultsTitle}>Your Duct System</h4>
            <p className={styles.resultsSummary}>
              {totalSqft.toLocaleString()} sq ft &nbsp;·&nbsp; Design CFM {designCFM.toLocaleString()} &nbsp;·&nbsp; {validRooms.length} rooms
            </p>
          </div>

          {/* System Overview — auto-generated floor plan */}
          <div className={styles.resultBlock}>
            <h5 className={styles.resultBlockTitle}>System Overview</h5>
            <p className={styles.blockIntro}>Simplified layout — not to scale</p>
            <div className={styles.floorPlanWrap}>
              <FloorPlan schedule={supplySchedule} />
            </div>
          </div>

          {/* Section A: Supply duct schedule */}
          <div className={styles.resultBlock}>
            <h5 className={styles.resultBlockTitle}>
              Supply Duct Schedule — {isFlex ? 'Flex Duct' : 'Sheet Metal'}
            </h5>
            <div className={styles.tableWrap}>
              <table className={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Sq Ft</th>
                    <th>CFM</th>
                    <th>Round</th>
                    <th>Rectangular</th>
                    <th>Register</th>
                    <th>Velocity</th>
                  </tr>
                </thead>
                <tbody>
                  {supplySchedule.map((row) => (
                    <tr key={row.id}>
                      <td className={styles.roomCell}>{row.name}</td>
                      <td>{row.sqft}</td>
                      <td>{row.cfm}</td>
                      <td className={styles.duct}>{row.round}</td>
                      <td className={styles.duct}>{row.rect}</td>
                      <td>{row.register}</td>
                      <td style={{ color: row.fpm < 600 ? '#059669' : row.fpm > 900 ? '#dc2626' : '#0e2340', fontWeight: 700 }}>
                        {row.fpm} {row.fpm < 600 ? 'Quiet' : row.fpm > 900 ? '⚠ Noisy' : 'FPM'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: Trunk diagram */}
          <div className={styles.resultBlock}>
            <h5 className={styles.resultBlockTitle}>Trunk Line Sizing — Reducing Trunk Method</h5>
            <p className={styles.blockIntro}>
              Each branch takeoff reduces the remaining trunk capacity. Sized largest-room-first to show maximum reduction.
            </p>
            <div className={styles.svgWrap}>
              <TrunkDiagram segments={trunkSegments} designCFM={designCFM} />
            </div>
            {trunkSegments.some((s) => s.trunkFPM > 900) && (
              <p style={{ fontSize: '13px', color: '#dc2626', fontStyle: 'italic', marginTop: '12px' }}>
                One or more trunk sections exceed 900 FPM. Consider upsizing the trunk to reduce noise.
              </p>
            )}
          </div>

          {/* Section C: Return air */}
          <div className={styles.resultBlock}>
            <h5 className={styles.resultBlockTitle}>Return Air Sizing</h5>
            <div className={styles.returnGrid}>
              <div className={styles.returnStat}>
                <span className={styles.returnLabel}>Total Return CFM</span>
                <span className={styles.returnValue}>{designCFM.toLocaleString()}</span>
              </div>
              <div className={styles.returnStat}>
                <span className={styles.returnLabel}>Recommended Returns</span>
                <span className={styles.returnValue}>{returnInfo.numReturns}</span>
              </div>
              <div className={styles.returnStat}>
                <span className={styles.returnLabel}>CFM per Return</span>
                <span className={styles.returnValue}>{returnInfo.cfmPerReturn}</span>
              </div>
              <div className={styles.returnStat}>
                <span className={styles.returnLabel}>Grille / Duct Size</span>
                <span className={styles.returnValueSmall}>{returnInfo.grilleSize}</span>
              </div>
            </div>
            <p className={styles.returnNote}>
              Return air sizing follows the rule of 1 sq inch of duct area per CFM. Distribute returns to balance airflow — high returns favor cooling, low returns favor heating, or use a single central return sized for full system flow.
            </p>
          </div>

          {/* Common mistakes callout */}
          <div className={styles.callout}>
            <h5 className={styles.calloutTitle}>Common Duct Design Mistakes</h5>
            <p className={styles.calloutText}>
              <strong>Undersized returns are the #1 problem.</strong> In roughly 80% of residential installs, the return duct system is too small. If your system is noisy or your rooms aren't getting enough air, check the return first.
            </p>
            <p className={styles.calloutText}>
              <strong>Flex duct must be pulled taut.</strong> Sagging, kinked, or loosely hung flex duct can add 30% or more friction loss. A 10-foot run of saggy flex can perform like 15+ feet of straight duct. Stretch it tight and support it every 4 feet.
            </p>
            <p className={styles.calloutText}>
              <strong>Every 90° elbow adds resistance.</strong> A single 90° elbow is equivalent to about 15 feet of straight duct. Two 45° elbows create a smoother turn with less pressure drop than one sharp 90°. Plan your routing to minimize turns.
            </p>
            <p className={styles.calloutText}>
              <strong>Don't forget the filter.</strong> A dirty or restrictive filter eats into your static pressure budget fast. A standard 1-inch filter adds ~0.10" WC of resistance. A 4-inch media filter adds ~0.20" WC. Size your ducts assuming the filter is partially loaded.
            </p>
            <p className={styles.calloutText}>
              <strong>Bigger isn't always better.</strong> Oversized ducts reduce air velocity, which sounds good until you realize low velocity means poor air mixing in the room. The air dumps out of the register and falls straight to the floor instead of mixing. Hit the target CFM with the right size — not bigger.
            </p>
            <p className={styles.calloutText}>
              <strong>Seal every joint.</strong> Duct leakage wastes 20-30% of conditioned air in a typical home. Use mastic (not duct tape) on every connection, especially in unconditioned spaces like attics and crawlspaces.
            </p>
          </div>

          <p className={styles.disclaimer}>
            This calculator provides estimates based on simplified Manual D principles using equal friction method at 0.08" w.g. per 100 ft. Actual duct design should account for available static pressure, equivalent length of fittings, and local code requirements. Always consult with a licensed HVAC professional for final system design.
          </p>

          <div className={styles.actions}>
            <button type="button" onClick={reset} className={styles.secondaryBtn}>
              ← Start Over
            </button>
            <button type="button" onClick={() => window.print()} className={styles.primaryBtn}>
              Print Results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
