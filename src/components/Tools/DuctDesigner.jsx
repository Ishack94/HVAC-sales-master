import React, { useState, useMemo } from 'react'
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

function roundDuctSize(cfm) {
  if (cfm <= 80) return '5"'
  if (cfm <= 110) return '6"'
  if (cfm <= 160) return '7"'
  if (cfm <= 225) return '8"'
  if (cfm <= 300) return '9"'
  if (cfm <= 400) return '10"'
  if (cfm <= 550) return '12"'
  return '14"'
}

function rectDuctSize(cfm) {
  if (cfm <= 80) return '3¼×10'
  if (cfm <= 110) return '3¼×12'
  if (cfm <= 160) return '3¼×14'
  if (cfm <= 225) return '8×8'
  if (cfm <= 300) return '8×10'
  if (cfm <= 400) return '8×12'
  if (cfm <= 550) return '10×12 or 8×14'
  return '12×12 or 8×18'
}

function registerSize(cfm) {
  if (cfm <= 100) return '6×10'
  if (cfm <= 150) return '8×10'
  if (cfm <= 250) return '10×10 or 8×12'
  if (cfm <= 350) return '10×12'
  return '12×12'
}

function trunkSizeLabel(cfm) {
  if (cfm < 400) return '8×8 / 10" rd'
  if (cfm <= 600) return '10×8 / 12" rd'
  if (cfm <= 800) return '12×8 / 14" rd'
  if (cfm <= 1000) return '14×8 / 16" rd'
  if (cfm <= 1200) return '16×10 / 18" rd'
  if (cfm <= 1600) return '20×10 / 20" rd'
  return '20×12 / 22" rd'
}

function returnSizeLabel(cfm) {
  if (cfm <= 150) return '14×6'
  if (cfm <= 200) return '14×8 or 16×8'
  if (cfm <= 300) return '20×8 or 16×10'
  if (cfm <= 400) return '20×10 or 14×14'
  if (cfm <= 500) return '20×12 or 24×10'
  return '20×14 or 24×12'
}

/* === AI property lookup === */
async function analyzeProperty(text) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Anthropic API key not configured (VITE_ANTHROPIC_API_KEY).')
  }

  const systemPrompt = `You are an HVAC duct design assistant. The user will provide either a real estate listing URL or a property description. Extract the following and respond ONLY with valid JSON, no markdown or backticks:
{
  "totalSqFt": number,
  "rooms": [
    { "name": string, "sqFt": number, "type": string }
  ]
}

Room types must be one of: Living/Family Room, Bedroom, Kitchen, Bathroom, Dining Room, Office, Hallway, Laundry, Garage, Bonus Room.

If the listing mentions specific room dimensions, calculate sq ft from those. If only total sq ft and room count are given, estimate room sizes proportionally using these typical ratios for a home:
- Living/Family Room: 18-22% of total
- Kitchen: 10-14%
- Master Bedroom: 12-16%
- Other Bedrooms: 8-11% each
- Bathrooms: 4-6% each
- Dining Room: 8-10%
- Hallway: 4-5%
- Laundry: 3-4%

Always include a Hallway. Round sq ft to nearest 10. The rooms should add up to approximately the total sq ft.`

  const isUrl = /^https?:\/\//i.test(text)
  const userContent = isUrl
    ? `${text}\n\nThis is a property listing URL. Based on common listings at this type of URL, estimate a typical 3bed/2bath ~1800 sqft home if you cannot access the URL directly. The user can adjust the values after.`
    : text

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    }),
  })

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`)
  }

  const data = await response.json()
  const textBlocks = (data.content || []).filter((b) => b.type === 'text')
  if (!textBlocks.length) throw new Error('No text content in response')
  const lastText = textBlocks[textBlocks.length - 1].text || ''

  // Strip markdown fences if present and extract the JSON object
  const stripped = lastText.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const match = stripped.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON object in response')
  return JSON.parse(match[0])
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

export default function DuctDesigner() {
  const [step, setStep] = useState(1)
  const [rooms, setRooms] = useState([makeRoom()])
  const [furnaceBTU, setFurnaceBTU] = useState(80000)
  const [tempRise, setTempRise] = useState(55)
  const [tonnage, setTonnage] = useState(3.0)

  // AI property lookup state
  const [pasteText, setPasteText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)
  const [aiSuccess, setAiSuccess] = useState(null)

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
    setPasteText('')
    setAiError(null)
    setAiSuccess(null)
  }

  const handleAnalyze = async () => {
    if (!pasteText.trim() || aiLoading) return
    setAiLoading(true)
    setAiError(null)
    setAiSuccess(null)
    try {
      const data = await analyzeProperty(pasteText.trim())
      if (!data.rooms || !Array.isArray(data.rooms) || data.rooms.length === 0) {
        throw new Error('No rooms returned')
      }
      const newRooms = data.rooms.map((r) =>
        makeRoom({
          name: r.name || '',
          sqft: String(Math.round(Number(r.sqFt ?? r.sqft ?? 0))),
          type: ROOM_TYPES.includes(r.type) ? r.type : 'Bedroom',
        })
      )
      setRooms(newRooms)
      const totalSqFt =
        Number(data.totalSqFt) ||
        newRooms.reduce((s, r) => s + Number(r.sqft || 0), 0)
      setAiSuccess({ count: newRooms.length, totalSqFt })
    } catch (err) {
      console.error('AI lookup failed:', err)
      setAiError(
        "Couldn't parse that listing. Try pasting the property description text directly, or use Quick Fill below."
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
      return {
        id: room.id,
        name: room.name || `Room ${i + 1}`,
        type: room.type,
        sqft,
        cfm,
        round: roundDuctSize(cfm),
        rect: rectDuctSize(cfm),
        register: registerSize(cfm),
      }
    })
  }, [step, validRooms, totalSqft, designCFM])

  const trunkSegments = useMemo(() => {
    if (step !== 3 || !supplySchedule.length) return []
    let remaining = designCFM
    return supplySchedule.map((room) => {
      const seg = {
        room: room.name,
        roomCFM: room.cfm,
        trunkCFM: remaining,
        trunkSize: trunkSizeLabel(remaining),
      }
      remaining = Math.max(0, remaining - room.cfm)
      return seg
    })
  }, [step, supplySchedule, designCFM])

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
          {/* AI property lookup */}
          <div className={styles.aiSection}>
            <div className={styles.aiHeader}>
              <span className={styles.aiBadge}>AI Powered</span>
              <h4 className={styles.aiTitle}>Import from a Listing</h4>
              <p className={styles.aiSubtitle}>
                Paste a property URL or description and we'll auto-fill the room layout for you.
              </p>
            </div>

            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste a Redfin or Zillow listing URL, or paste the property description text directly..."
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
            <h5 className={styles.resultBlockTitle}>Supply Duct Schedule</h5>
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
