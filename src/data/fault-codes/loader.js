import React from 'react';

/**
 * Fault code dataset loader.
 *
 * Loads brand family data on demand. Each brand family is a separate JSON file
 * to keep initial bundle size small — the tool only loads the brand the user picks.
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
