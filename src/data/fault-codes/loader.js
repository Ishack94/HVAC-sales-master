// src/data/fault-codes/loader.js
// Fault code brand-family loader with model-prefix identification
// Schema v1.1.0

import brandFamiliesIndex from './brand-families-index.json';
import nortekNordyne from './nortek-nordyne.json';
import boschYork from './bosch-york.json';
import carrierGlobal from './carrier-global.json';
import traneTechnologies from './trane-technologies.json';

// Registry of normalized brand families
const brandFamilyRegistry = {
  nortek_nordyne: nortekNordyne,
  bosch_york: boschYork,
  carrier_global: carrierGlobal,
  trane_technologies: traneTechnologies,
};

/**
 * Get a brand family by ID
 * @param {string} brandFamilyId
 * @returns {object|null} Brand family data or null if not loaded
 */
export function getBrandFamily(brandFamilyId) {
  return brandFamilyRegistry[brandFamilyId] || null;
}

/**
 * List all loaded brand families
 * @returns {object[]} Array of brand family data objects
 */
export function listBrandFamilies() {
  return Object.values(brandFamilyRegistry);
}

/**
 * Get the brand-families index (metadata for all known brand families)
 * @returns {object} Index with metadata
 */
export function getBrandFamiliesIndex() {
  return brandFamiliesIndex;
}

/**
 * Identify a platform by matching the longest prefix against a model number.
 * @param {string} modelNumber — user-entered model number (case-insensitive)
 * @returns {object|null} { brandFamilyId, platformId, platformName, matchedPrefix } or null
 */
export function identifyPlatformByModelNumber(modelNumber) {
  if (!modelNumber || typeof modelNumber !== 'string') return null;
  const cleaned = modelNumber.trim().toUpperCase().replace(/[^A-Z0-9*-]/g, '');

  let bestMatch = null;
  let bestPrefixLength = 0;

  for (const family of Object.values(brandFamilyRegistry)) {
    if (!family.platforms) continue;
    for (const platform of family.platforms) {
      const prefixes = platform.model_number_prefixes || [];
      for (const prefix of prefixes) {
        const cleanedPrefix = prefix.trim().toUpperCase().replace(/[^A-Z0-9*-]/g, '');
        if (cleanedPrefix && cleaned.startsWith(cleanedPrefix) && cleanedPrefix.length > bestPrefixLength) {
          bestMatch = {
            brandFamilyId: family.brand_family_id,
            platformId: platform.platform_id,
            platformName: platform.platform_name,
            matchedPrefix: prefix,
          };
          bestPrefixLength = cleanedPrefix.length;
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Get visual identification options — list of platforms with their visual-ID descriptions
 * for a given brand family, to help users identify their platform visually.
 * @param {string} brandFamilyId
 * @returns {object[]} Array of { platformId, platformName, visualIdentification, displayType, appliesTo }
 */
export function getVisualIdentificationOptions(brandFamilyId) {
  const family = getBrandFamily(brandFamilyId);
  if (!family || !family.platforms) return [];
  return family.platforms.map((p) => ({
    platformId: p.platform_id,
    platformName: p.platform_name,
    visualIdentification: p.visual_identification || '',
    displayType: p.display_type || '',
    appliesTo: p.applies_to_models || [],
  }));
}

/**
 * Find a specific platform by ID across all loaded brand families
 * @param {string} platformId
 * @returns {object|null} { brandFamily, platform } or null
 */
export function findPlatform(platformId) {
  for (const family of Object.values(brandFamilyRegistry)) {
    if (!family.platforms) continue;
    const platform = family.platforms.find((p) => p.platform_id === platformId);
    if (platform) {
      return { brandFamily: family, platform };
    }
  }
  return null;
}

/**
 * Find a specific code within a platform
 * @param {string} platformId
 * @param {string} codeIdentifier — e.g. "33", "e04", "Err.126.00"
 * @returns {object|null} { brandFamily, platform, code } or null
 */
export function findCode(platformId, codeIdentifier) {
  const result = findPlatform(platformId);
  if (!result) return null;
  const normalized = codeIdentifier.trim().toLowerCase();
  const code = result.platform.codes.find(
    (c) =>
      c.code_identifier.trim().toLowerCase() === normalized ||
      c.code_id.trim().toLowerCase() === normalized,
  );
  return code ? { ...result, code } : null;
}

/**
 * Check if a code identifier is shared across multiple platforms (cross-gen conflict)
 * @param {string} brandFamilyId
 * @param {string} codeIdentifier
 * @returns {object|null} Cross-gen conflict descriptor, or null if not a conflict
 */
export function getCrossGenerationConflict(brandFamilyId, codeIdentifier) {
  const family = getBrandFamily(brandFamilyId);
  if (!family || !family.cross_generation_conflicts) return null;
  const normalized = codeIdentifier.trim().toLowerCase();
  return (
    family.cross_generation_conflicts.find((c) =>
      c.code_identifier.toLowerCase().split(/\s*[\/,]\s*/).some((id) => id === normalized),
    ) || null
  );
}
