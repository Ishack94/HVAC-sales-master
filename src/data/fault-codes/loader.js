/**
 * Fault Code Loader
 *
 * Lazy-loads brand family data on demand.
 * Each brand family is a separate JSON file in this directory.
 *
 * Schema version: 1.1.0
 * - Added model_number_prefixes (array) for nameplate model number matching
 * - Added visual_identification (string) for visual picker fallback
 * - Added identifyPlatformByModelNumber() helper
 * - Added getVisualIdentificationOptions() helper
 */

// Brand family registry - maps brand_family_id to dynamic import
const brandFamilyRegistry = {
  nortek_nordyne: () => import('./nortek-nordyne.json'),
  bosch_york: () => import('./bosch-york.json'),
  carrier_global: () => import('./carrier-global.json'),
  // trane_technologies: () => import('./trane-technologies.json'),
  // lennox_allied: () => import('./lennox-allied.json'),
  // daikin_goodman: () => import('./daikin-goodman.json'),
  // rheem_ruud: () => import('./rheem-ruud.json'),
};

// Cache loaded brand families in memory (session-scoped)
const loadedFamilies = new Map();

/**
 * Load a brand family by ID. Returns the full brand family data object.
 * Lazy-loads on first request, caches for subsequent calls.
 */
export async function loadBrandFamily(brandFamilyId) {
  if (loadedFamilies.has(brandFamilyId)) {
    return loadedFamilies.get(brandFamilyId);
  }

  const loader = brandFamilyRegistry[brandFamilyId];
  if (!loader) {
    throw new Error(`Unknown brand family: ${brandFamilyId}`);
  }

  const mod = await loader();
  const data = mod.default || mod;
  loadedFamilies.set(brandFamilyId, data);
  return data;
}

/**
 * Normalize a model number for prefix matching.
 * Case-insensitive, strips whitespace and common separators (-, _, /).
 */
function normalizeModelNumber(modelNumber) {
  if (!modelNumber || typeof modelNumber !== 'string') return '';
  return modelNumber.toUpperCase().replace(/[\s\-_/]/g, '');
}

/**
 * Identify platform by model number prefix match.
 * Uses longest-prefix-wins logic across all platforms in a brand family.
 *
 * @param {object} brandFamilyData - loaded brand family data
 * @param {string} modelNumber - user-entered model number
 * @returns {object|null} - matching platform object, or null if no match
 */
export function identifyPlatformByModelNumber(brandFamilyData, modelNumber) {
  if (!brandFamilyData || !brandFamilyData.platforms) return null;
  const normalized = normalizeModelNumber(modelNumber);
  if (!normalized) return null;

  let bestMatch = null;
  let bestMatchLength = 0;

  for (const platform of brandFamilyData.platforms) {
    if (!platform.model_number_prefixes) continue;

    for (const prefix of platform.model_number_prefixes) {
      const normalizedPrefix = normalizeModelNumber(prefix);
      if (normalized.startsWith(normalizedPrefix) && normalizedPrefix.length > bestMatchLength) {
        bestMatch = platform;
        bestMatchLength = normalizedPrefix.length;
      }
    }
  }

  return bestMatch;
}

/**
 * Get visual identification options for a brand family.
 * Returns array of { platform_id, platform_name, visual_identification, display_type }
 * for showing a visual picker when user doesn't know model number.
 *
 * @param {object} brandFamilyData - loaded brand family data
 * @returns {array} - array of visual identification options
 */
export function getVisualIdentificationOptions(brandFamilyData) {
  if (!brandFamilyData || !brandFamilyData.platforms) return [];

  return brandFamilyData.platforms
    .filter(p => p.visual_identification)
    .map(p => ({
      platform_id: p.platform_id,
      platform_name: p.platform_name,
      visual_identification: p.visual_identification,
      display_type: p.display_type,
    }));
}

/**
 * Look up a specific code within a platform.
 * Returns the code record, or null if not found.
 */
export function findCode(platform, codeIdentifier) {
  if (!platform || !platform.codes) return null;
  const normalized = String(codeIdentifier).trim().toUpperCase();
  return platform.codes.find(c =>
    String(c.code_identifier).trim().toUpperCase() === normalized
  ) || null;
}

/**
 * Get all platforms for a brand family (for UI listing).
 */
export function getPlatforms(brandFamilyData) {
  return brandFamilyData && brandFamilyData.platforms ? brandFamilyData.platforms : [];
}

/**
 * Get cross-generation conflicts for a specific code.
 * Returns matching conflict entries, useful for UI banner display.
 */
export function getCrossGenerationConflicts(brandFamilyData, codeIdentifier) {
  if (!brandFamilyData || !brandFamilyData.cross_generation_conflicts) return [];
  const normalized = String(codeIdentifier).trim().toUpperCase();
  return brandFamilyData.cross_generation_conflicts.filter(conflict =>
    String(conflict.code_identifier).trim().toUpperCase() === normalized
  );
}
