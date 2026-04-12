// Pressure-Temperature saturation tables (PSIG → °F)
const PT_TABLES = {
  'R-410A': [
    [50,5.8],[75,19.5],[100,31.1],[118,38.5],[125,41.2],[130,43.0],[140,46.8],
    [150,50.4],[160,53.8],[175,59.0],[200,66.7],[225,73.7],[250,80.1],[275,86.1],
    [300,91.8],[325,97.1],[350,102.1],[375,106.9],[400,111.5],[425,115.8],
    [450,120.0],[475,124.0],[500,127.9],[550,135.3],[600,142.3],
  ],
  'R-22': [
    [30,14.7],[40,22.4],[50,29.1],[60,35.1],[70,40.5],[80,45.5],[100,54.5],
    [120,62.4],[140,69.5],[160,75.9],[180,81.9],[200,87.4],[225,94.0],
    [250,100.1],[275,105.8],[300,111.2],[350,121.2],
  ],
  'R-134a': [
    [5,15.4],[10,23.0],[15,29.4],[20,35.0],[25,40.0],[30,44.4],[35,48.5],
    [40,52.2],[50,58.9],[60,65.0],[70,70.5],[80,75.6],[100,84.7],
    [120,92.7],[140,99.9],[160,106.5],[180,112.5],[200,118.1],
  ],
  'R-404A': [
    [20,-7.1],[30,2.5],[40,10.6],[50,17.6],[60,23.7],[70,29.2],[80,34.2],
    [100,43.1],[120,50.9],[140,57.9],[160,64.2],[180,70.0],[200,75.4],
    [225,82.0],[250,88.0],[275,93.6],[300,98.8],[350,108.5],
  ],
  'R-407C': [
    [30,7.7],[40,16.1],[50,23.4],[60,29.8],[70,35.6],[80,40.9],[100,50.3],
    [120,58.5],[140,65.8],[160,72.4],[180,78.5],[200,84.1],[225,91.0],
    [250,97.3],[275,103.2],[300,108.7],[350,118.8],
  ],
  'R-32': [
    [40,4.1],[50,12.5],[60,19.8],[70,26.2],[80,32.0],[100,42.1],[120,50.8],
    [140,58.5],[160,65.4],[180,71.8],[200,77.7],[225,84.8],[250,91.4],
    [275,97.4],[300,103.1],[350,113.6],[400,123.0],[450,131.5],
  ],
}

/**
 * Get saturation temperature for a given refrigerant and pressure using linear interpolation.
 * Returns null if pressure is out of range.
 */
export function getSaturationTemp(refrigerant, pressure) {
  const table = PT_TABLES[refrigerant]
  if (!table) return null
  const p = Number(pressure)
  if (isNaN(p)) return null

  // Below table range
  if (p <= table[0][0]) return table[0][1]
  // Above table range
  if (p >= table[table.length - 1][0]) return table[table.length - 1][1]

  // Find bracketing points and interpolate
  for (let i = 0; i < table.length - 1; i++) {
    const [p1, t1] = table[i]
    const [p2, t2] = table[i + 1]
    if (p >= p1 && p <= p2) {
      const ratio = (p - p1) / (p2 - p1)
      return Math.round((t1 + ratio * (t2 - t1)) * 10) / 10
    }
  }
  return null
}

/**
 * Target superheat for fixed orifice systems based on outdoor ambient and indoor wet-bulb.
 */
export function getTargetSuperheat(outdoorTemp, indoorWB) {
  const oa = Number(outdoorTemp)
  const wb = Number(indoorWB)
  if (isNaN(oa) || isNaN(wb)) return 12

  if (oa > 95) return 5
  if (oa >= 86) {
    if (wb <= 62) return 12
    if (wb <= 67) return 8
    return 5
  }
  if (oa >= 76) {
    if (wb <= 62) return 15
    if (wb <= 67) return 11
    return 7
  }
  // oa <= 75
  if (wb <= 62) return 18
  if (wb <= 67) return 14
  return 10
}

export const REFRIGERANT_OPTIONS = [
  { value: 'R-410A', label: 'R-410A' },
  { value: 'R-22', label: 'R-22' },
  { value: 'R-134a', label: 'R-134a' },
  { value: 'R-404A', label: 'R-404A' },
  { value: 'R-407C', label: 'R-407C' },
  { value: 'R-32', label: 'R-32' },
]
