import React from 'react';

/**
 * Fault code dataset loader (v1.1.0).
 *
 * Loads brand family data on demand. Each brand family is a separate JSON file
 * to keep initial bundle size small — the tool only loads the brand the user picks.
 *
 * v1.1.0 adds:
 *   - identifyPlatformByModelNumber() — auto-match a nameplate model number to a platform
 *   - getVisualIdentificationOptions() — get the list of platforms with visual descriptions
 *     for the "Don't know the model?" fallback UI
 */

import brandFamiliesIndex from './brand-families-index.json';

// Dynamic imports for lazy loading of brand family data
const brandFamilyLoaders = {
  nortek_nordyne: () => import('./nortek-nordyne.json'),
  bosch_york: () => import('./bosch-york.json'),
  // Additional families added as they're normalized:
  // carrier_global: () => import('./carrier-global.json'),
  // trane_technologies: () => import('./trane-technologies.json'),
  // lennox_allied: () => import('./lennox-allied.json'),
  // daikin_goodman: () => import('./daikin-goodman.json'),
  // rheem_ruud: () => import('./rheem-ruud.json'),
};

export const getBrandFamiliesIndex = () => {
  return brandFamiliesIndex;
};

export const loadBrandFamily = async (brandFamilyId) => {
  const loader = brandFamilyLoaders[brandFamilyId];
  if (!loader) {
    throw new Error(`Brand family not available: ${brandFamilyId}`);
  }
  const module = await loader();
  return module.default;
};

export const findCodesInPlatform = (brandFamilyData, platformId, codeIdentifierQuery) => {
  const platform = brandFamilyData.platforms.find(p => p.platform_id === platformId);
  if (!platform) return [];
  if (!codeIdentifierQuery) return platform.codes;
  const query = codeIdentifierQuery.toLowerCase();
  return platform.codes.filter(c =>
    c.code_identifier.toLowerCase().includes(query) ||
    c.meaning.toLowerCase().includes(query)
  );
};

export const getCrossGenerationConflicts = (brandFamilyData, codeIdentifier) => {
  if (!brandFamilyData.cross_generation_conflicts) return [];
  const query = codeIdentifier.toLowerCase().trim();
  return brandFamilyData.cross_generation_conflicts.filter(
    c => c.code_identifier.toLowerCase().trim() === query
  );
};

export const getAvailableBrandFamilies = () => {
  return Object.keys(brandFamilyLoaders);
};

/**
 * NEW in v1.1.0.
 *
 * Identify which platform a user's nameplate model number matches.
 * Returns the matching platform object, or null if no match is found.
 * Case-insensitive prefix matching. Whitespace and common separators
 * (hyphens, slashes) are stripped from user input before matching.
 *
 * Example:
 *   Input: "58SC0B-040080-C" on Carrier Global data
 *   Returns: the "58sc0b_3digit" platform
 *
 * If multiple platforms match (unlikely but possible), returns the one
 * with the longest matching prefix (most specific match wins).
 *
 * If no platform has model_number_prefixes populated for this brand family,
 * returns null — the tool should fall back to visual identification.
 */
export const identifyPlatformByModelNumber = (brandFamilyData, modelNumber) => {
  if (!modelNumber || typeof modelNumber !== 'string') return null;
  const normalized = modelNumber.toUpperCase().replace(/[\s\-/]/g, '');
  if (!normalized) return null;

  let bestMatch = null;
  let bestPrefixLength = 0;

  for (const platform of brandFamilyData.platforms) {
    if (!platform.model_number_prefixes || !platform.model_number_prefixes.length) continue;
    for (const prefix of platform.model_number_prefixes) {
      const normalizedPrefix = prefix.toUpperCase().replace(/[\s\-/]/g, '');
      if (normalized.startsWith(normalizedPrefix) && normalizedPrefix.length > bestPrefixLength) {
        bestMatch = platform;
        bestPrefixLength = normalizedPrefix.length;
      }
    }
  }

  return bestMatch;
};

/**
 * NEW in v1.1.0.
 *
 * Return the list of platforms as {platform_id, platform_name, visual_identification,
 * display_type, applies_to_years} objects, for use in the "Don't know the model?"
 * visual picker UI.
 *
 * Platforms without a visual_identification string fall back to platform_description.
 * Platforms with neither are skipped (treated as not visually identifiable).
 */
export const getVisualIdentificationOptions = (brandFamilyData) => {
  return brandFamilyData.platforms
    .map(p => ({
      platform_id: p.platform_id,
      platform_name: p.platform_name,
      visual_identification: p.visual_identification || p.platform_description || null,
      display_type: p.display_type,
      applies_to_years: p.applies_to_years || null
    }))
    .filter(opt => opt.visual_identification !== null);
};
